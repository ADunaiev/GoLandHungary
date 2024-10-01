import Link from 'next/link'
import { ArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { addVehicleToShipmentRouteUnit } from '@/app/lib/actions';

export function CreateVehicle({ shipment_id, route_id, unit_id } : 
  { shipment_id: string, route_id: string, unit_id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_vehicle/create_vehicle`}
      className="flex h-7 items-center rounded-lg bg-blue-600 px-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusIcon className="h-5 md:ml-0" />
    </Link>
  );
}

export function AddVehicle({shipment_id, route_id, unit_id} : 
  { shipment_id: string, route_id: string, unit_id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_vehicle`}
      className="flex h-7 items-center rounded-lg bg-blue-600 px-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      {/* <PlusIcon className="h-5 md:ml-0" /> */}
      <p>add vehicle</p>
    </Link>
  );
}

export function SelectVehicle({shipment_id, route_id, unit_id, vehicle_id} : 
  { shipment_id: string, route_id: string, unit_id: string , vehicle_id: string }) {
  const addVehicleToSRU = addVehicleToShipmentRouteUnit.bind(null, shipment_id, route_id, unit_id, vehicle_id);
  
  return (
    <form action={addVehicleToSRU}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Select</span>
          <ArrowDownIcon className="w-5" />
      </button>
    </form>
  );
}