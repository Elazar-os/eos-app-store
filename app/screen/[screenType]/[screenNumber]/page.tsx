import Script from 'next/script'
import { notFound } from 'next/navigation'
import './screen.css'

type Props = {
  params: Promise<{ screenType: string; screenNumber: string }>
}

export default async function ScreenPage({ params }: Props) {
  const { screenType, screenNumber } = await params
  const validType = screenType === 'main' || screenType === 'sushi'
  const parsedNumber = Number(screenNumber)
  const validNumber = Number.isInteger(parsedNumber) && parsedNumber >= 1 && parsedNumber <= 3

  if (!validType || !validNumber) {
    notFound()
  }

  return (
    <div className="screen-wrap" id="screen-wrap">
      <header className="screen-header">
        <div className="header-left">
          <span className="header-logo" id="header-logo">King of Delancey</span>
          <span className="header-pipe" id="header-pipe">|</span>
          <span className="header-subtitle" id="header-subtitle">Est. 2009</span>
        </div>
        <div className="header-right">
          <span className="header-screen-id" id="header-screen-id"></span>
          <div className="live-pill">
            <span className="pulse-dot" id="pulse-dot"></span>
            <span className="live-text">LIVE</span>
          </div>
        </div>
      </header>

      <main className="screen-body" id="screen-body">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading menu...</p>
        </div>
      </main>

      <footer className="screen-footer">
        <span className="footer-clock" id="footer-clock"></span>
        <div className="footer-ticker-wrap" id="footer-ticker-wrap">
          <span className="footer-ticker" id="footer-ticker"></span>
        </div>
        <span className="footer-brand" id="footer-brand">KING OF DELANCEY</span>
      </footer>

      <div className="frozen-badge" id="frozen-badge">FROZEN</div>

      <div className="fullscreen-overlay" id="fullscreen-overlay">
        <div className="overlay-logo">KING OF DELANCEY</div>
        <div className="overlay-text">Tap anywhere to continue</div>
      </div>

      <Script src="/app.js?v=v12" strategy="afterInteractive" />
    </div>
  )
}
