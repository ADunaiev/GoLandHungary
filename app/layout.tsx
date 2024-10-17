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
        <link 
          rel="icon" 
          href='/customers/goland_hun_logo_transparent.png?<generated>' 
          type='image/<generated>'
          sizes='<generated>'
        />
      </head>
      <Toaster />
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
