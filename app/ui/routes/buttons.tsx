'use client'

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice, deleteInvoiceRate, deleteInvoiceRateEditInvoice, deleteRouteFromShipment } from '@/app/lib/actions';
import { toast } from 'sonner';


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

export function UpdateRouteFromShipment({ shipment_id, route_id }:
  { shipment_id: string, route_id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${shipment_id}/edit/${route_id}/edit_route`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteRouteFromShipment ({ shipment_id, route_id }: { shipment_id: string, route_id: string }) {
  const deleteRouteFromShipmentWithId = deleteRouteFromShipment.bind(null, shipment_id, route_id);

  const handleSubmit = async () => {     
      try {
        const response = await deleteRouteFromShipmentWithId();
        toast(response.message)
      } catch(e) {
        console.log(e);
      }
  }

  return (
    <form action={handleSubmit}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
