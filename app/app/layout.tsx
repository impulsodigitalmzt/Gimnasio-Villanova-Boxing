import type { Metadata, Viewport } from 'next';
import { PortalShell } from '@/components/portal/portal-shell';

export const metadata: Metadata = {
  title: 'Portal Villanova | Portal del Socio',
  description: 'Tu membresía, clase del día y retos Villanova en el celular.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Portal Villanova',
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default function MemberAppLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
