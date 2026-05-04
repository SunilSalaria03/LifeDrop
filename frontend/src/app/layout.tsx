import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/layout/query-provider';

export const metadata: Metadata = {
  title: 'LifeDrop',
  description: 'A blood donation social-service platform.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

