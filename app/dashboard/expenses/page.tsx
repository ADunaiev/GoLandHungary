import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredInvoices, fetchInvoicesPages } from '@/app/lib/data';
import InvoicesTableData from '@/app/ui/invoices/table';
import { ViewCurrenciesRates } from '@/app/ui/currencies/buttons';
import { fetchFilteredSupplierInvoices, fetchSupplierInvoicesPages } from '@/app/lib/supplier_invoices/data';
import { CreateSupplierInvoice } from '@/app/ui/supplier_invoices/buttons';
import ExpensesTableData from '@/app/ui/supplier_invoices/table';

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
  const totalPages = await fetchSupplierInvoicesPages(query);

  const expenses = await fetchFilteredSupplierInvoices(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Expenses</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search expenses..." />
        <CreateSupplierInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <ExpensesTableData query={query} currentPage={currentPage} expenses={expenses}/>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}