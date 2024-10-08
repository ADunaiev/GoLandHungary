import { 
    CheckIcon, 
    ClockIcon,
    ArrowRightIcon

} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ShipmentStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-black': status === 'in_process',
          'bg-green-500 text-white': status === 'delivered',
        },
      )}
    >
      {status === 'in_process' ? (
        <>
          in_process
          <ArrowRightIcon className="ml-1 w-4 text-black" />
        </>
      ) : null}
      {status === 'delivered' ? (
        <>
          delivered
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}