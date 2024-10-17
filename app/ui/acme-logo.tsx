import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function GolandLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image 
        src='/customers/goland_hun_logo_transparent.png'
        alt='goland_logo'
        height={32}
        width={32}
      />
      <p className="ml-4 text-[44px]">Goland</p>
    </div>
  );
}
