import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/customers/table';
import { lusitana } from '@/app/ui/fonts';
import { TableRowSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { CreateCustomer } from '@/app/ui/customers/buttons';
import { fetchCountries, fetchCustomersPages } from '@/app/lib/data';
import { ViewCustomerAgreements } from '@/app/ui/customer_agreements/buttons';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({
  searchParams,
}: {
    searchParams?: {
      query?: string;
      page?: string;
    }
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCustomersPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
        <ViewCustomerAgreements />
      </div>
      <Suspense key={query} fallback={<TableRowSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}