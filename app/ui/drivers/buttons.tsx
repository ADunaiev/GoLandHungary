import { addDriverToShipmentRouteUnit } from '@/app/lib/actions';
import { ArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'

export function CreateDriver({ shipment_id, route_id, unit_id } : 
  { shipment_id: string, route_id: string, unit_id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_driver/create_driver`}
      className="flex h-7 items-center rounded-lg bg-blue-600 px-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusIcon className="h-5 md:ml-0" />
    </Link>
  );
}

export function AddDriver({shipment_id, route_id, unit_id} : 
    { shipment_id: string, route_id: string, unit_id: string }) {
    return (
      <Link
        href={`/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_driver`}
        className="flex h-7 items-center rounded-lg bg-blue-600 px-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {/* <PlusIcon className="h-5 md:ml-0" /> */}
        <p className="h-5 md:ml-0">add driver</p>
      </Link>
    );
}

export function SelectDriver({shipment_id, route_id, unit_id, driver_id} : 
  { shipment_id: string, route_id: string, unit_id: string , driver_id: string }) {
  const addDriverToSRU = addDriverToShipmentRouteUnit.bind(null, shipment_id, route_id, unit_id, driver_id);
  
  return (
    <form action={addDriverToSRU}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Select</span>
          <ArrowDownIcon className="w-5" />
      </button>
    </form>
  );
}