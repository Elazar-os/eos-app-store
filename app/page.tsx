import Link from "next/link";

export default function Home() {
  const apps = [
    {
      title: "Chatbot Builder",
      description: "Create custom chatbots for businesses and hobbyists with API integration.",
      link: "/chatbot-builder",
      label: "AI",
      icon: "🤖",
      status: "active",
    },
    {
      title: "Restaurant Menu Builder",
      description: "Build and manage restaurant menus with voice control and screen management.",
      link: "/menu-builder",
      label: "Hospitality",
      icon: "🍽️",
      status: "active",
    },
    {
      title: "Photo Selector",
      description: "AI-powered photo selection for business and personal use.",
      link: "/photo-selector",
      label: "Media",
      icon: "📸",
      status: "active",
    },
    {
      title: "Kosher Android Launcher",
      description: "Secure launcher for approved apps on kosher smartphones.",
      link: "/kosher-launcher",
      label: "Mobile",
      icon: "📱",
      status: "beta",
    },
    {
      title: "Community App for Shuls",
      description: "Connect with communities, zmanim, and shiurim.",
      link: "/shul-community",
      label: "Community",
      icon: "🕍",
      status: "active",
    },
    {
      title: "Resume Site",
      description: "Professional resume builder and sharing platform with secure 30-day expiring links.",
      link: "/resume-site",
      label: "Career",
      icon: "📄",
      status: "active",
    },
    {
      title: "Admin Dashboard",
      description: "View and manage chatbot and shul submissions in one place.",
      link: "/dashboard",
      label: "Ops",
      icon: "⚙️",
      status: "active",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-4">
            {/* EOS Logo */}
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-blue-500/20 blur-xl"></div>
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
                <span className="text-2xl font-black tracking-tighter text-white">EOS</span>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Elazar&apos;s <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Operating System</span>
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                A curated suite of practical apps for community, productivity, and business workflows.
              </p>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="mt-6 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
              <span className="text-slate-400">System Online</span>
            </div>
            <div className="text-slate-400">
              <span className="font-semibold text-blue-400">{apps.length}</span> Apps Deployed
            </div>
            <div className="text-slate-400">
              <span className="font-semibold text-cyan-400">{apps.filter(a => a.status === 'active').length}</span> Active
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Application Catalog</h2>
          <p className="mt-2 text-slate-400">Select an application to launch</p>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <AppCard key={app.link} {...app} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-blue-500/20 bg-slate-900/50 py-8 text-center text-sm text-slate-500">
        <p>© 2025 Elazar Greisman. All rights reserved.</p>
      </footer>
    </div>
  );
}

function AppCard({ 
  title, 
  description, 
  link, 
  label, 
  icon, 
  status 
}: { 
  title: string; 
  description: string; 
  link: string; 
  label: string; 
  icon: string;
  status: string;
}) {
  return (
    <Link href={link}>
      <article className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-3xl shadow-inner">
              {icon}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-500/20">
                {label}
              </span>
              {status === 'beta' && (
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-500/20">
                  Beta
                </span>
              )}
              {status === 'active' && (
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                  <span className="text-xs text-green-400">Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
          </div>

          {/* Launch Button */}
          <div className="mt-6">
            <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 group-hover:shadow-blue-500/50 group-hover:scale-105">
              Launch App
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
