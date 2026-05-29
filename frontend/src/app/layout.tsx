import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/layout/query-provider';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto'
});

export const metadata: Metadata = {
  title: 'LifeDrop',
  description: 'A blood donation social-service platform.',
  applicationName: 'LifeDrop',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'LifeDrop',
    statusBarStyle: 'default'
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes'
  }
};

export const viewport: Viewport = {
  themeColor: '#dc2626'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <ServiceWorkerRegister />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

