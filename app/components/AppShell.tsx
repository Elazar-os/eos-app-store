import Link from 'next/link'
import { ReactNode } from 'react'

type AppShellProps = {
  title: string
  description: string
  children: ReactNode
  badge?: string
}

export default function AppShell({ title, description, children, badge = 'EOS Suite' }: AppShellProps) {
  return (
    <div className="app-shell reveal">
      <header className="surface app-shell-header">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="brand-chip">{badge}</span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="muted mt-2 max-w-3xl text-sm sm:text-base">{description}</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium hover:bg-white"
          >
            Back to App Store
          </Link>
        </div>
      </header>
      <main className="app-shell-content">{children}</main>
    </div>
  )
}
