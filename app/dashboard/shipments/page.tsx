import { fetchShipmentsFullType, fetchShipmentsPages } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { CreateShipment } from "@/app/ui/shipments/buttons";
import { Suspense } from "react";
import ShipmentsTable from "@/app/ui/shipments/table";
import Pagination from "@/app/ui/invoices/pagination";
import InvoicesTableSkeleton from '@/app/ui/skeletons';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchShipmentsPages(query);
  
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Shipments</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search shipments..." />
          <CreateShipment />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <ShipmentsTable query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }