import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function GolandLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-black`}
    >
      <Image 
        src='/goal-hungary-logo.png'
        alt='goland_logo'
        height={32}
        width={180}
        priority={true}
      />
      {/*<p className="ml-4 text-[44px]">GOLAND</p> */}
    </div>
  );
}
