import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HackerHouse Goa 2026',
    short_name: 'HH Goa',
    description: 'Builder Identity and Journey for HackerHouse Goa',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0c2d1f',
    theme_color: '#0c2d1f',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'apple-touch-icon' as any,
      }
    ],
  }
}
