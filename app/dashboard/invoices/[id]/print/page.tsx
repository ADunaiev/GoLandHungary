import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { 
    fetchCustomerFullById, 
    fetchCurrencyFullById, 
    fetchAgreementById, 
    fetchOrganisationFullById,
    fetchCurrencyRateById,
    fetchInvoiceFullById,
    fetchInvoiceRatesByInvoiceId,
    fetchRatesByInvoiceNumber,
    fetchInvoiceRatesByInvoiceNumber,
    fetchBankAccountsByCurrencyIdAndOrganisationId
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CreateRate, CreateRateEditInvoice } from '@/app/ui/rates/buttons';
import { Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import EditRatesTable from '@/app/ui/rates/edit-rates-table';
import PrintInvoice from '@/app/ui/invoices/print-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    const invoice = await fetchInvoiceFullById(id);

    const [customer, currency, agreement, organisation, bank_account] = await Promise.all([
        fetchCustomerFullById(invoice.customer_id),
        fetchCurrencyFullById(invoice.currency_id),
        fetchAgreementById(invoice.agreement_id),
        fetchOrganisationFullById(invoice.organisation_id),
        fetchBankAccountsByCurrencyIdAndOrganisationId(invoice.currency_id, invoice.organisation_id),
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
                label: 'Print Invoice',
                href: `/dashboard/invoices/${id}/print`,
                active: true,
            },
            ]}
        />

        <PrintInvoice rates={rates} customer={customer} currency={currency} agreement={agreement} organisation={organisation} invoice={invoice} invoice_rates={invoice_rates} bank_account={bank_account}/>
        </main>
    );
}