import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { 
    fetchCustomers, 
    fetchCurrencies, 
    fetchAgreementsByCusomerIdAndOrganisationId, 
    fetchOrganisations,
    fetchCurrenciesRates,
    fetchInvoiceFullById,
    fetchInvoiceRatesByInvoiceId,
    fetchInvoiceRatesByInvoiceNumber,
    fetchAgreements
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CreateRate, CreateRateEditInvoice } from '@/app/ui/rates/buttons';
import { Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import EditRatesTable from '@/app/ui/rates/edit-rates-table';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    const [customers, currencies, agreements, organisations, invoice, currencies_rates] = await Promise.all([
        fetchCustomers(),
        fetchCurrencies(),
        fetchAgreements(),
        fetchOrganisations(),
        fetchInvoiceFullById(id),
        fetchCurrenciesRates(),
      ])

    if(!invoice) {
        notFound();
    }

    const rates = await fetchInvoiceRatesByInvoiceNumber(invoice.number);
    const invoice_rates = await fetchInvoiceRatesByInvoiceId(invoice.id);

    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Invoices', href: '/dashboard/invoices' },
            {
                label: 'Edit Invoice',
                href: `/dashboard/invoices/${id}/edit`,
                active: true,
            },
            ]}
        />

        {/* Rate Table */}
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <CreateRateEditInvoice id={id}/>
        </div>
        <Suspense fallback={<InvoiceRatesTableSkeleton/>}>
            <EditRatesTable rates={rates} invoice_id={id}/>
        </Suspense>

        <Form customers={customers} currencies={currencies} agreements={agreements} organisations={organisations} rates={rates} invoice={invoice} currencies_rates={currencies_rates} invoice_rates={invoice_rates}/>
        </main>
    );
}