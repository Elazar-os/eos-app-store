import { ImageResponse } from 'next/og'

export const contentType = 'image/png'
export const size = {
  width: 180,
  height: 180,
}

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #231f3d 0%, #9b3f2f 60%, #f0ab59 100%)',
          borderRadius: 42,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -18,
            right: -12,
            width: 72,
            height: 72,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.2)',
          }}
        />
        <div
          style={{
            width: 126,
            height: 126,
            borderRadius: 34,
            border: '1px solid rgba(255,255,255,0.32)',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff4ea',
            fontSize: 54,
            fontWeight: 800,
            letterSpacing: -2,
            textShadow: '0 3px 12px rgba(0,0,0,0.35)',
          }}
        >
          EOS
        </div>
      </div>
    ),
    size
  )
}
