import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice, deleteInvoiceRate, deleteInvoiceRateEditInvoice, deleteRouteFromShipment } from '@/app/lib/actions';


export function CreateRouteFromShipment({shipment_id}: 
  {shipment_id: string}) {
  return (
    <Link
      href={`/dashboard/shipments/${shipment_id}/edit/create_route`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Route</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  )
}

export function DeleteRouteFromShipment ({ id }: { id: string }) {
  const deleteRouteFromShipmentWithId = deleteRouteFromShipment.bind(null, id);

  return (
    <form action={deleteRouteFromShipmentWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
