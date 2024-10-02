import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Toaster, toast } from 'sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Toaster />
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
