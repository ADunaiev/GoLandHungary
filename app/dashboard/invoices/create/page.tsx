import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import RatesTable from '@/app/ui/rates/rates-table';
import { CreateRate } from '@/app/ui/rates/buttons';
import { fetchCustomers, fetchCurrencies, fetchAgreementsByCusomerIdAndOrganisationId, fetchOrganisations, fetchInvoiceDraft, fetchInvoiceRatesByInvoiceNumber, fetchCurrenciesRates } from '@/app/lib/data';

export default async function Page() {
  const [customers, currencies, agreements, organisations, invoice, currencies_rates] = await Promise.all([
    fetchCustomers(),
    fetchCurrencies(),
    fetchAgreementsByCusomerIdAndOrganisationId('', ''),
    fetchOrganisations(),
    fetchInvoiceDraft(),
    fetchCurrenciesRates(),
  ])

  const rates = await fetchInvoiceRatesByInvoiceNumber(invoice.number);
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />

      {/* Rate Table */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateRate invoice_number={invoice.number}/>
      </div>
      <Suspense fallback={<InvoiceRatesTableSkeleton/>}>
          <RatesTable rates={rates}/>
      </Suspense>

      <Form customers={customers} currencies={currencies} agreements={agreements} organisations={organisations} rates={rates} invoice={invoice} currencies_rates={currencies_rates}/>

    </main>
  );
}