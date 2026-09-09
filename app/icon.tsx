import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png'; // Output PNG agar ujungnya transparan
 
export default async function Icon() {
  const logoData = await fetch(
    new URL('../public/logo-najwan.jpg', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16, // Membuatnya bulat sempurna
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        <img 
            // @ts-ignore
            src={logoData} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
    ),
    { ...size }
  );
}