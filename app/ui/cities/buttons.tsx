import { ArrowDownIcon, BuildingOffice2Icon, BuildingOfficeIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateCityFromShipment({ shipment_id }: {
  shipment_id: string
}) {
    return (
      <Link
        href={`/dashboard/shipments/${shipment_id}/edit/create_route/create_city`}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="block">Create City</span>
        <PlusIcon className="h-5 ml-4" />
      </Link>
    );
}

export function ViewCities({ shipment_id }: {
  shipment_id: string
}) {
    return (
      <Link
        href={`/dashboard/shipments/${shipment_id}/edit/create_route/add_city`}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="block">View Cities</span>
        <BuildingOffice2Icon className="h-5 ml-4" />
      </Link>
    );
}