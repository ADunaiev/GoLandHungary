import { fetchCitiesPages, fetchCurrencyRatesPages, fetchRouteTransportTypeIdByRouteId, fetchShipmentsFullType, fetchShipmentsPages, fetchUnitsPages, fetchVehiclesByTransportTypePages } from "@/app/lib/data";
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
import { CreateCurrencyRate } from "@/app/ui/currencies/buttons";
import CurrenciesTable from "@/app/ui/currencies/currencies-table";

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    },
  }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchCurrencyRatesPages(query);
  
    return (
      <div className="w-full">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Invoices', href: `/dashboard/invoices` },
            {
              label: 'Currencies rates',
              href: `/dashboard/invoices/currencies_rates`,
              active: true,
            },
          ]}
        />

        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search rates..." />
          <CreateCurrencyRate />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <CurrenciesTable query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }