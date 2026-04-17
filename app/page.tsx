import Link from "next/link";

export default function Home() {
  const apps = [
    {
      title: "Chatbot Builder",
      description: "Create custom chatbots for businesses and hobbyists with API integration.",
      link: "/chatbot-builder",
      label: "AI",
      glyph: "CB",
      tone: "from-amber-500 to-rose-600",
    },
    {
      title: "Restaurant Menu Builder",
      description: "Build and manage restaurant menus with voice control and screen management.",
      link: "/menu-builder",
      label: "Hospitality",
      glyph: "MB",
      tone: "from-sky-500 to-cyan-700",
    },
    {
      title: "Photo Selector",
      description: "AI-powered photo selection for business and personal use.",
      link: "/photo-selector",
      label: "Media",
      glyph: "PS",
      tone: "from-violet-500 to-fuchsia-700",
    },
    {
      title: "Kosher Android Launcher",
      description: "Secure launcher for approved apps on kosher smartphones.",
      link: "/kosher-launcher",
      label: "Mobile",
      glyph: "KL",
      tone: "from-emerald-500 to-teal-700",
    },
    {
      title: "Community App for Shuls",
      description: "Connect with communities, zmanim, and shiurim.",
      link: "/shul-community",
      label: "Community",
      glyph: "SC",
      tone: "from-orange-500 to-red-700",
    },
    {
      title: "Resume Site",
      description: "Professional resume builder and sharing platform.",
      link: "/resume-site",
      label: "Career",
      glyph: "RS",
      tone: "from-indigo-500 to-blue-700",
    },
    {
      title: "Admin Dashboard",
      description: "View and manage chatbot and shul submissions in one place.",
      link: "/dashboard",
      label: "Ops",
      glyph: "AD",
      tone: "from-slate-500 to-slate-700",
    },
  ];

  return (
    <div className="app-shell reveal">
      <header className="surface app-shell-header">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <span className="brand-chip">EOS Platform</span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Elazar&apos;s Operating System</h1>
            <p className="muted mt-3 max-w-2xl text-sm sm:text-base">
              A curated suite of practical apps for community, productivity, and business workflows.
            </p>
          </div>
          <div className="surface px-4 py-3 text-sm">
            <p className="font-semibold">Live apps</p>
            <p className="muted">{apps.length} routes ready to use</p>
          </div>
        </div>
      </header>

      <main className="app-shell-content">
        <section className="surface-strong p-5 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Application Catalog</h2>
          <p className="muted mt-2 text-sm">Choose an app and continue shipping.</p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {apps.map((app) => (
              <AppCard key={app.link} {...app} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function AppCard({ title, description, link, label, glyph, tone }: { title: string; description: string; link: string; label: string; glyph: string; tone: string }) {
  return (
    <article className="surface p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${tone} text-center text-[13px] font-extrabold leading-10 tracking-wide text-white shadow-sm`}>
          {glyph}
        </div>
        <span className="brand-chip">{label}</span>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="muted mt-2 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="mt-6">
        <Link
          href={link}
          className="inline-flex items-center rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Launch App
        </Link>
      </div>
    </article>
  );
}
