import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Toaster, toast } from 'sonner'
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>GOLAND Hungary App.</title>
      </head>
      <Toaster />
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
