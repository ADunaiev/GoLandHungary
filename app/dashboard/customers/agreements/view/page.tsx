import { fetchCitiesPages, fetchCurrencyRatesPages, fetchCustomersAgreementsPages, fetchRouteTransportTypeIdByRouteId, fetchShipmentsFullType, fetchShipmentsPages, fetchUnitsPages, fetchVehiclesByTransportTypePages } from "@/app/lib/data";
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
import { CreateCustomerAgreement } from "@/app/ui/customer_agreements/buttons";
import CustomersAgreementsTable from "@/app/ui/customer_agreements/table";

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
    const totalPages = await fetchCustomersAgreementsPages(query);
  
    return (
      <div className="w-full">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Customers', href: `/dashboard/customers` },
            {
              label: 'Agreements',
              href: `/dashboard/customers/agreements/view`,
              active: true,
            },
          ]}
        />

        <div key='top_elements' className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search key='search_element' placeholder="Search agreements..." />
          <CreateCustomerAgreement key='create_agreement_btn' />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <CustomersAgreementsTable query={query} currentPage={currentPage} />
        </Suspense>
        <div key='main_table' className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }