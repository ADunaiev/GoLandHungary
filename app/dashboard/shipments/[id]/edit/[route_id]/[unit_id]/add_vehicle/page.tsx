import { fetchRouteTransportTypeIdByRouteId, fetchShipmentsFullType, fetchShipmentsPages, fetchUnitsPages, fetchVehiclesByTransportTypePages } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { CreateShipment } from "@/app/ui/shipments/buttons";
import { Suspense } from "react";
import ShipmentsTable from "@/app/ui/shipments/table";
import Pagination from "@/app/ui/invoices/pagination";
import InvoicesTableSkeleton from '@/app/ui/skeletons';
import { CreateUnit } from "@/app/ui/units/buttons";
import UnitsTable from "@/app/ui/units/units_table_full";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { CreateVehicle } from "@/app/ui/vehicles/buttons";
import VehiclesTable from "@/app/ui/vehicles/vehicles-table-full";

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({
    params,
    searchParams,
  }: {
    params: {
        id: string,
        route_id: string,
        unit_id: string,
    },
    searchParams?: {
      query?: string;
      page?: string;
    },
  }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const transport_type_id = await fetchRouteTransportTypeIdByRouteId(params.route_id);
    const totalPages = await fetchVehiclesByTransportTypePages(query, transport_type_id);
  
    return (
      <div className="w-full">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Shipment', href: `/dashboard/shipments/${params.id}/edit?tab=2` },
            {
              label: 'Add Vehicle',
              href: `/dashboard/shipments/${params.id}/edit/${params.route_id}/${params.unit_id}/add_vehicle`,
              active: true,
            },
          ]}
        />

        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search vehicles..." />
          <CreateVehicle shipment_id={params.id} route_id={params.route_id} unit_id={params.unit_id} />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <VehiclesTable query={query} currentPage={currentPage} shipment_id={params.id} route_id={params.route_id} unit_id={params.unit_id}/>
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }