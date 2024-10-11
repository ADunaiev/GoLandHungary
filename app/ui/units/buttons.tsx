'use client'

import { ArrowDownIcon, ChevronDoubleDownIcon, ChevronDownIcon, PencilIcon, PlusIcon, PrinterIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteShipment, deleteInvoiceRate, addUnitToShipmentRoute, deleteUnitFromShipmentRoute, addUnitToAllShipmentRoutes } from '@/app/lib/actions';
import { toast } from 'sonner';

export function CreateUnit({shipment_id, route_id} : { shipment_id: string, route_id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${shipment_id}/edit/${route_id}/add_unit/create_unit`}
      className="flex h-7 items-center rounded-lg bg-blue-600 px-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusIcon className="h-5 md:ml-0" />
    </Link>
  );
}

export function AddUnit({shipment_id, route_id} : { shipment_id: string, route_id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${shipment_id}/edit/${route_id}/add_unit`}
      className="flex h-7 items-center rounded-lg bg-blue-600 px-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusIcon className="h-5 md:ml-0" />
    </Link>
  );
}

export function SelectUnit({shipment_id, route_id, unit_id} : 
  { shipment_id: string, route_id: string, unit_id: string }) {
  const addUnitToSRU = addUnitToShipmentRoute.bind(null, shipment_id, route_id, unit_id);
  
  const handleSubmit = async () => {
      
      try {
        const response = await addUnitToSRU();
        toast(response.message)
      } catch(e) {
        toast.error('Something was wrong');
      }
  }

  return (
    <form action={handleSubmit}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Select</span>
          <ChevronDownIcon className="w-5" />
      </button>
    </form>
  );
}

export function SelectUnitInAllRoutes({shipment_id, route_id, unit_id} : 
  { shipment_id: string, route_id: string, unit_id: string }) {
  const addUnitToAllSRU = addUnitToAllShipmentRoutes.bind(null, shipment_id, route_id, unit_id);
  
  const handleSubmit = async () => {
      
      try {
        const response = await addUnitToAllSRU();
        toast(response.message)
      } catch(e) {
        toast.error('Something was wrong');
      }
  }

  return (
    <form action={handleSubmit}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Select</span>
          <ChevronDoubleDownIcon className="w-5" />
      </button>
    </form>
  );
}

export function UpdateUnit({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteUnitFromShipmentRoute({ shipment_id, route_id, unit_id } : 
  { shipment_id: string, route_id: string, unit_id: string }) {
  const deleteSRULine = deleteUnitFromShipmentRoute.bind(null, shipment_id, route_id, unit_id);

  return (
    <form action={deleteSRULine}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}