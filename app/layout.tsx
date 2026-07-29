import type { Metadata, Viewport } from 'next';
import { Urbanist, Candal, JetBrains_Mono } from 'next/font/google';
import { SiteChrome } from '@/components/site-chrome';
import { PwaRegister } from '@/components/pwa-register';
import './globals.css';

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const candal = Candal({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Villanova Boxing | Gimnasio de Box Oficial',
  description:
    'Gimnasio Villanova Boxing: boxeo para niños, jóvenes y adultos. Membresías Individual, Dúo y Comunidad, retos, rutinas y tienda oficial.',
  applicationName: 'Villanova Boxing',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Villanova Boxing',
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: [
      { url: '/logo-white.png', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/logo-white.png',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#D4AF37',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${urbanist.variable} ${candal.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="bg-black text-[#f4f4f5] antialiased">
        <PwaRegister />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
