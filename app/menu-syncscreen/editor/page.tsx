'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import AppShell from '@/app/components/AppShell'

type MenuItem = {
  id: string
  item_name: string
  description: string | null
  price: string
  category: string
  screen_type: 'main' | 'sushi'
  screen_number: number
  priority: number
  enabled: boolean
}

type Draft = Omit<MenuItem, 'id'>

const emptyDraft: Draft = {
  item_name: '',
  description: '',
  price: '',
  category: '',
  screen_type: 'main',
  screen_number: 1,
  priority: 0,
  enabled: true,
}

export default function MenuSyncScreenEditorPage() {
  const [screenType, setScreenType] = useState<'main' | 'sushi'>('main')
  const [screenNumber, setScreenNumber] = useState(1)
  const [items, setItems] = useState<MenuItem[]>([])
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const selectedItems = useMemo(
    () => items.filter((item) => item.screen_type === screenType && item.screen_number === screenNumber),
    [items, screenType, screenNumber]
  )

  const fetchItems = async () => {
    setLoading(true)
    const response = await fetch(`/api/menu?screentype=${screenType}&screennumber=${screenNumber}`)
    const json = await response.json()
    if (json.success) {
      setItems(json.data)
      setMessage(`Loaded ${json.data.length} items from ${json.source ?? 'api'}.`)
    } else {
      setMessage(json.error ?? 'Failed to load items.')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenType, screenNumber])

  useEffect(() => {
    const AnyWindow = window as any
    const SpeechRecognition = AnyWindow.SpeechRecognition || AnyWindow.webkitSpeechRecognition

    if (!SpeechRecognition) {
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = async (event: any) => {
      const transcript: string = event.results?.[0]?.[0]?.transcript?.toLowerCase() ?? ''
      if (!transcript) return

      if (transcript.includes('freeze')) {
        await fetch('/api/screen-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ frozen: true, incrementVersion: true }),
        })
        setMessage('Voice command: frozen screens.')
        return
      }

      if (transcript.includes('unfreeze')) {
        await fetch('/api/screen-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ frozen: false, incrementVersion: true }),
        })
        setMessage('Voice command: unfroze screens.')
        return
      }

      if (transcript.startsWith('feature ')) {
        const name = transcript.replace('feature ', '').trim()
        const match = selectedItems.find((item) => item.item_name.toLowerCase().includes(name))
        if (!match) {
          setMessage(`Voice command: no match for "${name}".`)
          return
        }

        await fetch('/api/screen-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            featured: {
              item_name: match.item_name,
              price: match.price,
              category: match.category,
            },
            incrementVersion: true,
          }),
        })
        setMessage(`Voice command: featured ${match.item_name}.`)
      }
    }

    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
  }, [selectedItems])

  const addItem = async () => {
    setSaving(true)
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, screen_type: screenType, screen_number: screenNumber }),
    })
    const json = await response.json()
    if (json.success) {
      setDraft(emptyDraft)
      await fetch('/api/screen-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incrementVersion: true }),
      })
      await fetchItems()
    } else {
      setMessage(json.error ?? 'Failed to add item.')
    }
    setSaving(false)
  }

  const removeItem = async (id: string) => {
    const response = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' })
    const json = await response.json()
    if (!json.success) {
      setMessage(json.error ?? 'Delete failed.')
      return
    }

    await fetch('/api/screen-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incrementVersion: true }),
    })
    await fetchItems()
  }

  const toggleItem = async (item: MenuItem) => {
    const response = await fetch('/api/menu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, enabled: !item.enabled }),
    })
    const json = await response.json()
    if (!json.success) {
      setMessage(json.error ?? 'Update failed.')
      return
    }

    await fetch('/api/screen-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incrementVersion: true }),
    })
    await fetchItems()
  }

  const runVoice = () => {
    if (!recognitionRef.current || listening) return
    setListening(true)
    recognitionRef.current.start()
  }

  return (
    <AppShell
      title="Menu Editor"
      description="Edit menu items, push live updates, and control frozen/featured state with voice commands."
      badge="Restaurant Ops"
    >
      <div className="surface-strong p-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Link href="/menu-syncscreen" className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium">
            Back to Screens
          </Link>
          <button onClick={runVoice} className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white">
            {listening ? 'Listening...' : 'Voice Command'}
          </button>
          <button
            onClick={async () => {
              await fetch('/api/screen-state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frozen: true, incrementVersion: true }),
              })
              setMessage('Screens frozen.')
            }}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium"
          >
            Freeze Screens
          </button>
          <button
            onClick={async () => {
              await fetch('/api/screen-state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frozen: false, incrementVersion: true }),
              })
              setMessage('Screens unfrozen.')
            }}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium"
          >
            Unfreeze Screens
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <select
            value={screenType}
            onChange={(e) => setScreenType(e.target.value as 'main' | 'sushi')}
            className="rounded-xl border border-black/10 bg-white/90 px-3 py-2"
          >
            <option value="main">Main</option>
            <option value="sushi">Sushi</option>
          </select>
          <select
            value={screenNumber}
            onChange={(e) => setScreenNumber(Number(e.target.value))}
            className="rounded-xl border border-black/10 bg-white/90 px-3 py-2"
          >
            <option value={1}>Screen 1</option>
            <option value={2}>Screen 2</option>
            <option value={3}>Screen 3</option>
          </select>
          <button onClick={fetchItems} className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium">
            Refresh List
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-6">
          <input
            placeholder="Item name"
            value={draft.item_name}
            onChange={(e) => setDraft((prev) => ({ ...prev, item_name: e.target.value }))}
            className="rounded-xl border border-black/10 bg-white/90 px-3 py-2"
          />
          <input
            placeholder="Description"
            value={draft.description ?? ''}
            onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
            className="rounded-xl border border-black/10 bg-white/90 px-3 py-2"
          />
          <input
            placeholder="Price (e.g. 12.95)"
            value={draft.price}
            onChange={(e) => setDraft((prev) => ({ ...prev, price: e.target.value }))}
            className="rounded-xl border border-black/10 bg-white/90 px-3 py-2"
          />
          <input
            placeholder="Category"
            value={draft.category}
            onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
            className="rounded-xl border border-black/10 bg-white/90 px-3 py-2"
          />
          <input
            type="number"
            placeholder="Priority"
            value={draft.priority}
            onChange={(e) => setDraft((prev) => ({ ...prev, priority: Number(e.target.value) }))}
            className="rounded-xl border border-black/10 bg-white/90 px-3 py-2"
          />
          <button
            onClick={addItem}
            disabled={saving}
            className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Add Item'}
          </button>
        </div>

        {message && <p className="muted mb-3 text-sm">{message}</p>}

        <div className="space-y-2">
          {loading ? (
            <p className="muted">Loading menu items...</p>
          ) : selectedItems.length === 0 ? (
            <p className="muted">No items found for this screen.</p>
          ) : (
            selectedItems.map((item) => (
              <div key={item.id} className="surface flex items-center justify-between gap-3 p-3">
                <div>
                  <p className="font-semibold">{item.item_name}</p>
                  <p className="muted text-sm">{item.category} • ${item.price}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleItem(item)}
                    className="rounded-lg border border-black/10 px-3 py-1 text-sm"
                  >
                    {item.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  )
}
