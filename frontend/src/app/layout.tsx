import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/layout/query-provider';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto'
});

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
      <body className={roboto.variable}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

