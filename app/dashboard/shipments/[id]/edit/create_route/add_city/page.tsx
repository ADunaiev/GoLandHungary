import { fetchCitiesPages, fetchRouteTransportTypeIdByRouteId, fetchShipmentsFullType, fetchShipmentsPages, fetchUnitsPages, fetchVehiclesByTransportTypePages } from "@/app/lib/data";
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
import { CreateCityFromShipment } from "@/app/ui/cities/buttons";
import CitiesTable from "@/app/ui/cities/city-table";

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({
    params,
    searchParams,
  }: {
    params: {
        id: string,
    },
    searchParams?: {
      query?: string;
      page?: string;
    },
  }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchCitiesPages(query);
  
    return (
      <div className="w-full">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Shipment', href: `/dashboard/shipments/${params.id}/edit?tab=1` },
            { label: 'Route', href: `/dashboard/shipments/${params.id}/edit/create_route` },
            {
              label: 'Cities',
              href: `/dashboard/shipments/${params.id}/edit/create_route/add_city`,
              active: true,
            },
          ]}
        />

        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search cities..." />
          <CreateCityFromShipment shipment_id={params.id} />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <CitiesTable query={query} currentPage={currentPage} shipment_id={params.id} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }