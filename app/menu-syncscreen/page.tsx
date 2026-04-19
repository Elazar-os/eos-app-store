import Link from 'next/link'
import AppShell from '../components/AppShell'

const screens = [
  { type: 'sushi', number: 1, title: 'Sushi Screen 1', note: 'Specialty Rolls' },
  { type: 'sushi', number: 2, title: 'Sushi Screen 2', note: 'Rolls, Tempura, Nigiri' },
  { type: 'main', number: 1, title: 'Main Screen 1', note: 'Starters, Soups, Salads' },
  { type: 'main', number: 2, title: 'Main Screen 2', note: 'Burgers, Sandwiches' },
  { type: 'main', number: 3, title: 'Main Screen 3', note: 'Shawarma, Platters, Wraps, Sides' },
]

export default function MenuSyncScreenPage() {
  return (
    <AppShell
      title="Menu SyncScreen"
      description="TV-ready digital displays imported from your Replit project."
      badge="Restaurant"
    >
      <div className="surface-strong p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {screens.map((screen) => (
            <article key={`${screen.type}-${screen.number}`} className="surface p-4">
              <h2 className="text-lg font-semibold">{screen.title}</h2>
              <p className="muted mt-1 text-sm">{screen.note}</p>
              <Link
                href={`/screen/${screen.type}/${screen.number}`}
                className="mt-4 inline-flex rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white"
              >
                Open Display
              </Link>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
