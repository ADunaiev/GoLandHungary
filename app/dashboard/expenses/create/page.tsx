import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { cache, Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import RatesTable from '@/app/ui/rates/rates-table';
import { CreateExpenseRate, CreateRate } from '@/app/ui/rates/buttons';
import { fetchCustomers, fetchCurrencies, fetchAgreementsByCusomerIdAndOrganisationId, fetchOrganisations, fetchInvoiceDraft, fetchInvoiceRatesByInvoiceNumber, fetchCurrenciesRates, fetchRatesTabelByInvoiceNumber, fetchAgreements, fetchRatesTableByExpenseNumber } from '@/app/lib/data';
import { fetchSuppliers } from '@/app/lib/suppliers/data';
import { fetchSupplierAgreements } from '@/app/lib/supplier_agreements/data';
import ExpenseCreateForm from '@/app/ui/supplier_invoices/create-form';
import RateTableExpense from '@/app/ui/rates/invoice-table-expense';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page() {
  const [
    suppliers, 
    currencies, 
    supplier_agreements, 
    organisations, 
    currencies_rates,
    rates,
  ] = await Promise.all([
    fetchSuppliers(),
    fetchCurrencies(),
    fetchSupplierAgreements(),
    fetchOrganisations(),
    fetchCurrenciesRates(),
    fetchRatesTableByExpenseNumber('new_expense')
  ])
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Expenses', href: '/dashboard/expenses' },
          {
            label: 'Create Expense',
            href: '/dashboard/expenses/create',
            active: true,
          },
        ]}
      />

      {/* Rate Table */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateExpenseRate />
      </div>
      <Suspense fallback={<InvoiceRatesTableSkeleton/>}>
          <RateTableExpense rates={rates}/>
      </Suspense> 

    <ExpenseCreateForm suppliers={suppliers} currencies={currencies} agreements={supplier_agreements} 
       organisations={organisations} currencies_rates={currencies_rates}/>

    </main>
  );
}