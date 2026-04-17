import { ImageResponse } from 'next/og'

export const contentType = 'image/png'
export const size = {
  width: 512,
  height: 512,
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(150deg, #231f3d 0%, #9b3f2f 55%, #f0ab59 100%)',
          borderRadius: 102,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -90,
            right: -70,
            width: 260,
            height: 260,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.18)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -76,
            left: -92,
            width: 280,
            height: 280,
            borderRadius: 999,
            background: 'rgba(28, 16, 51, 0.24)',
          }}
        />
        <div
          style={{
            width: 350,
            height: 350,
            borderRadius: 86,
            border: '2px solid rgba(255,255,255,0.34)',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.17), rgba(255,255,255,0.04))',
            boxShadow: '0 24px 38px rgba(0,0,0,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 22,
              borderRadius: 62,
              border: '1px solid rgba(255,255,255,0.34)',
            }}
          />
          <div
            style={{
              color: '#fff4ea',
              fontSize: 168,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -6,
              textShadow: '0 6px 20px rgba(0,0,0,0.35)',
            }}
          >
            EOS
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 28,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 7,
              color: 'rgba(255, 245, 236, 0.9)',
            }}
          >
            APP STORE
          </div>
        </div>
      </div>
    ),
    size
  )
}
