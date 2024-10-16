
import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import PSPDFKit from 'pspdfkit';
import GolandLogo from '@/app/ui/acme-logo';

/*
const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if(container && typeof window != 'undefined') {
      import('pspdfkit').then((PSPDFKit) => {
        if(PSPDFKit) {
          PSPDFKit.unload(container);
        }

        PSPDFKit.load({
          container,
          document: '/document.pdf',
          baseUrl: `${window.location.protocol}//${window.location.host}/`,
        });
      });
    }
  }, []); 

  return <div ref={containerRef} style={{ height: '100vh' }} />;
} */

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-gray-50 p-4 md:h-52">
        <GolandLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal ${lusitana.className} antialiased`}>
            <strong>Welcome to Global Ocean and Land Hungary(GOAL) web-site.</strong> 
            The site is under development now.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image 
            src="/white_truck.jpg"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image 
            src="/blue_truck.jpg"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshots of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}
