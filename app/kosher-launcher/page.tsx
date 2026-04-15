'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/useAuth'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type LauncherProfile = {
  id: string
  owner_github_id: number
  owner_login: string
  profile_name: string
  platform: 'android' | 'ios' | 'shared'
  strict_mode: boolean
  install_code: string | null
}

type LauncherApp = {
  id: string
  profile_id: string
  app_name: string
  app_id: string | null
  category: string
  is_enabled: boolean
}

type Preset = {
  name: string
  strictMode: boolean
  apps: Array<{ appName: string; appId: string; category: string }>
}

const PRESETS: Preset[] = [
  {
    name: 'Strict Kosher',
    strictMode: true,
    apps: [
      { appName: 'Phone', appId: 'com.android.dialer', category: 'Communication' },
      { appName: 'Messages', appId: 'com.google.android.apps.messaging', category: 'Communication' },
      { appName: 'Calendar', appId: 'com.google.android.calendar', category: 'Productivity' },
      { appName: 'Tehillim', appId: 'org.tehillim', category: 'Torah' },
    ],
  },
  {
    name: 'Family Balanced',
    strictMode: true,
    apps: [
      { appName: 'Phone', appId: 'com.android.dialer', category: 'Communication' },
      { appName: 'Messages', appId: 'com.google.android.apps.messaging', category: 'Communication' },
      { appName: 'Gmail', appId: 'com.google.android.gm', category: 'Productivity' },
      { appName: 'Waze', appId: 'com.waze', category: 'Navigation' },
      { appName: 'Tehillim', appId: 'org.tehillim', category: 'Torah' },
    ],
  },
  {
    name: 'iPhone Starter',
    strictMode: true,
    apps: [
      { appName: 'Phone', appId: 'com.apple.mobilephone', category: 'Communication' },
      { appName: 'Messages', appId: 'com.apple.MobileSMS', category: 'Communication' },
      { appName: 'Calendar', appId: 'com.apple.mobilecal', category: 'Productivity' },
    ],
  },
]

function detectPlatform(): 'android' | 'ios' | 'shared' {
  if (typeof navigator === 'undefined') {
    return 'shared'
  }

  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('iphone') || ua.includes('ipad')) {
    return 'ios'
  }
  if (ua.includes('android')) {
    return 'android'
  }
  return 'shared'
}

function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export default function KosherLauncher() {
  const user = useUser()
  const [profile, setProfile] = useState<LauncherProfile | null>(null)
  const [apps, setApps] = useState<LauncherApp[]>([])
  const [newAppName, setNewAppName] = useState('')
  const [newAppId, setNewAppId] = useState('')
  const [newCategory, setNewCategory] = useState('General')
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<InstallPromptEvent | null>(null)

  const groupedApps = useMemo(() => {
    return apps.reduce<Record<string, LauncherApp[]>>((acc, app) => {
      if (!acc[app.category]) {
        acc[app.category] = []
      }
      acc[app.category].push(app)
      return acc
    }, {})
  }, [apps])

  useEffect(() => {
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredInstallPrompt(event as InstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      setStatusMessage('Loading your launcher profile...')

      const platform = detectPlatform()
      const { data: profileData, error: profileError } = await supabase
        .from('kosher_launcher_profiles')
        .upsert(
          {
            owner_github_id: user.id,
            owner_login: user.login,
            profile_name: 'Primary Device',
            platform,
          },
          {
            onConflict: 'owner_github_id,profile_name',
          }
        )
        .select('*')
        .single()

      if (profileError || !profileData) {
        setStatusMessage(profileError?.message || 'Could not load profile')
        setLoading(false)
        return
      }

      setProfile(profileData)

      const { data: appsData, error: appsError } = await supabase
        .from('kosher_launcher_apps')
        .select('*')
        .eq('profile_id', profileData.id)
        .order('created_at', { ascending: true })

      if (appsError) {
        setStatusMessage(appsError.message)
      } else {
        setApps(appsData || [])
        setStatusMessage('Launcher profile ready.')
      }

      setLoading(false)
    }

    void load()
  }, [user])

  const handleInstall = async () => {
    if (!deferredInstallPrompt) {
      return
    }
    await deferredInstallPrompt.prompt()
    await deferredInstallPrompt.userChoice
    setDeferredInstallPrompt(null)
  }

  const addApp = async (event: FormEvent) => {
    event.preventDefault()
    if (!profile || !newAppName.trim()) {
      return
    }

    const { data, error } = await supabase
      .from('kosher_launcher_apps')
      .insert({
        profile_id: profile.id,
        app_name: newAppName.trim(),
        app_id: newAppId.trim() || null,
        category: newCategory.trim() || 'General',
      })
      .select('*')
      .single()

    if (error || !data) {
      setStatusMessage(error?.message || 'Could not add app')
      return
    }

    setApps(prev => [...prev, data])
    setNewAppName('')
    setNewAppId('')
    setStatusMessage('App added to whitelist.')
  }

  const toggleApp = async (app: LauncherApp) => {
    const { data, error } = await supabase
      .from('kosher_launcher_apps')
      .update({ is_enabled: !app.is_enabled })
      .eq('id', app.id)
      .select('*')
      .single()

    if (error || !data) {
      setStatusMessage(error?.message || 'Could not update app state')
      return
    }

    setApps(prev => prev.map(item => (item.id === data.id ? data : item)))
  }

  const removeApp = async (appId: string) => {
    const { error } = await supabase.from('kosher_launcher_apps').delete().eq('id', appId)
    if (error) {
      setStatusMessage(error.message)
      return
    }
    setApps(prev => prev.filter(item => item.id !== appId))
    setStatusMessage('App removed from whitelist.')
  }

  const applyPreset = async (preset: Preset) => {
    if (!profile) {
      return
    }

    setStatusMessage(`Applying preset: ${preset.name}...`)

    const { error: profileError } = await supabase
      .from('kosher_launcher_profiles')
      .update({ strict_mode: preset.strictMode })
      .eq('id', profile.id)

    if (profileError) {
      setStatusMessage(profileError.message)
      return
    }

    const { error: clearError } = await supabase
      .from('kosher_launcher_apps')
      .delete()
      .eq('profile_id', profile.id)

    if (clearError) {
      setStatusMessage(clearError.message)
      return
    }

    const { data: insertedApps, error: insertError } = await supabase
      .from('kosher_launcher_apps')
      .insert(
        preset.apps.map(app => ({
          profile_id: profile.id,
          app_name: app.appName,
          app_id: app.appId,
          category: app.category,
        }))
      )
      .select('*')

    if (insertError) {
      setStatusMessage(insertError.message)
      return
    }

    setProfile(prev => (prev ? { ...prev, strict_mode: preset.strictMode } : prev))
    setApps(insertedApps || [])
    setStatusMessage(`Preset applied: ${preset.name}`)
  }

  const toggleStrictMode = async () => {
    if (!profile) {
      return
    }

    const { data, error } = await supabase
      .from('kosher_launcher_profiles')
      .update({ strict_mode: !profile.strict_mode })
      .eq('id', profile.id)
      .select('*')
      .single()

    if (error || !data) {
      setStatusMessage(error?.message || 'Could not update strict mode')
      return
    }

    setProfile(data)
    setStatusMessage(`Strict mode ${data.strict_mode ? 'enabled' : 'disabled'}.`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-lg">Loading launcher configuration...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-16">
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold mb-3">Kosher Launcher</h1>
          <p className="text-slate-300 mb-6">
            Sign in first so your whitelist profile can be saved and synced.
          </p>
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-3 font-semibold"
          >
            Sign In with GitHub
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <section className="rounded-3xl border border-emerald-900/60 bg-gradient-to-br from-emerald-950 to-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-emerald-300 text-sm uppercase tracking-widest">Kosher Launcher</p>
              <h1 className="text-3xl sm:text-4xl font-bold mt-2">Whitelist Control Center</h1>
              <p className="text-slate-300 mt-3 max-w-2xl">
                Build approved app lists, save a profile for each device, and install this manager as a home-screen app.
              </p>
            </div>
            <div className="text-sm text-slate-300">
              <p>Logged in as: <span className="font-semibold">{user.login}</span></p>
              <p>Profile: <span className="font-semibold">{profile?.profile_name || 'Primary Device'}</span></p>
              {profile?.install_code ? <p>Install code: <span className="font-semibold">{profile.install_code}</span></p> : null}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Approved Apps</h2>
            <form onSubmit={addApp} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <input
                value={newAppName}
                onChange={event => setNewAppName(event.target.value)}
                placeholder="App name"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                required
              />
              <input
                value={newCategory}
                onChange={event => setNewCategory(event.target.value)}
                placeholder="Category"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
              />
              <input
                value={newAppId}
                onChange={event => setNewAppId(event.target.value)}
                placeholder="Package / Bundle ID"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
              />
              <button
                type="submit"
                className="sm:col-span-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
              >
                Add to Whitelist
              </button>
            </form>

            {Object.keys(groupedApps).length === 0 ? (
              <p className="text-slate-400">No approved apps yet. Add one manually or apply a preset.</p>
            ) : (
              <div className="space-y-5">
                {Object.entries(groupedApps).map(([category, categoryApps]) => (
                  <div key={category}>
                    <h3 className="text-emerald-300 font-semibold mb-2">{category}</h3>
                    <div className="space-y-2">
                      {categoryApps.map(app => (
                        <div
                          key={app.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950 p-3"
                        >
                          <div>
                            <p className="font-medium">{app.app_name}</p>
                            <p className="text-xs text-slate-400">{app.app_id || 'No package ID set'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleApp(app)}
                              className={`rounded-md px-3 py-1 text-sm font-medium ${
                                app.is_enabled
                                  ? 'bg-emerald-800 text-emerald-100'
                                  : 'bg-slate-700 text-slate-100'
                              }`}
                            >
                              {app.is_enabled ? 'Enabled' : 'Disabled'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeApp(app.id)}
                              className="rounded-md px-3 py-1 text-sm font-medium bg-rose-900 text-rose-100"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold mb-3">Profile Controls</h2>
              <p className="text-sm text-slate-300 mb-4">
                Platform: <span className="font-semibold capitalize">{profile?.platform || 'shared'}</span>
              </p>
              <button
                type="button"
                onClick={toggleStrictMode}
                className={`w-full rounded-lg py-2 font-semibold ${
                  profile?.strict_mode
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                Strict mode: {profile?.strict_mode ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold mb-3">Quick Presets</h2>
              <div className="space-y-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="w-full text-left rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 hover:border-emerald-700"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold mb-3">Install Manager</h2>
              {deferredInstallPrompt ? (
                <button
                  type="button"
                  onClick={handleInstall}
                  className="w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 py-2 font-semibold"
                >
                  Install on this device
                </button>
              ) : (
                <p className="text-sm text-slate-300">
                  If your browser supports install prompts, the install button will appear automatically.
                </p>
              )}

              {isIosDevice() ? (
                <p className="text-xs text-slate-400 mt-3">
                  iPhone: open Safari share menu, then choose “Add to Home Screen”.
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-300">{statusMessage}</p>
        </section>
      </div>
    </div>
  )
}