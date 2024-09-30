import { fetchShipmentsFullType, fetchShipmentsPages, fetchUnitsPages } from "@/app/lib/data";
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

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({
    params,
    searchParams,
  }: {
    params: {
        id: string,
        route_id: string,
    },
    searchParams?: {
      query?: string;
      page?: string;
    },
  }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchUnitsPages(query);
  
    return (
      <div className="w-full">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Shipment', href: `/dashboard/shipments/${params.id}/edit?tab=2` },
            {
              label: 'Add Units',
              href: `/dashboard/shipments/${params.id}/edit/${params.route_id}/add_unit`,
              active: true,
            },
          ]}
        />

        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search units..." />
          <CreateUnit shipment_id={params.id} route_id={params.route_id} />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <UnitsTable query={query} currentPage={currentPage} shipment_id={params.id} route_id={params.route_id} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }