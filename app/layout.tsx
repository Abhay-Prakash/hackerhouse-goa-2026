import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HackerHouse Goa 2026 — Builder Card Generator',
  description: 'Create your official HackerHouse Goa 2026 Builder ID Card. Find your builder identity and make your way to the House.',
  keywords: ['HackerHouse', 'Goa', '2026', 'Builder', 'ID Card', 'FrameInGoa'],
  openGraph: {
    title: 'HackerHouse Goa 2026 — Builder Card Generator',
    description: 'Create your official HackerHouse Goa 2026 Builder ID Card.',
    type: 'website',
    siteName: 'HackerHouse Goa 2026',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HackerHouse Goa 2026 — Builder Card Generator',
    description: 'Create your official HackerHouse Goa 2026 Builder ID Card.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Space+Grotesk:wght@500;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
