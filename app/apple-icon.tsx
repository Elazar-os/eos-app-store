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
          color: '#f8fafc',
          fontSize: 92,
          fontWeight: 700,
          background: 'linear-gradient(145deg, #0b3b2e, #0f766e)',
          borderRadius: 32,
        }}
      >
        K
      </div>
    ),
    size
  )
}
