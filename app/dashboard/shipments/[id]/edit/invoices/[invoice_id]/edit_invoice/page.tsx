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
    fetchCustomerFullById,
    fetchOrganisationFullById,
    fetchOrganisationById,
    fetchCustomerById
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CreateRate, CreateRateEditInvoice } from '@/app/ui/rates/buttons';
import { Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import EditRatesTable from '@/app/ui/rates/edit-rates-table';
import InvoiceEditFormFromShipment from '@/app/ui/invoices/edit-form-from-shipment';
import RatesTableShipment from '@/app/ui/rates/rates-table-shipments';
import RatesTableShipmentEditInvoice from '@/app/ui/rates/rates-table-edit-invoice';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({ params }: 
    { params: { id: string, invoice_id: string } }
) {
    const shipment_id = params.id;
    const invoice_id = params.invoice_id;

    const invoice = await fetchInvoiceFullById(invoice_id);

    const [customer, currencies, agreements, organisation, currencies_rates] = await Promise.all([
        fetchCustomerById(invoice.customer_id),
        fetchCurrencies(),
        fetchAgreementsByCusomerIdAndOrganisationId(invoice.customer_id, invoice.organisation_id),
        fetchOrganisationById(invoice.organisation_id),
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
            { 
                label: 'Shipment', 
                href: `/dashboard/shipments/${shipment_id}/edit?tab=4` 
            },
            {
                label: 'Edit Invoice',
                href: `/dashboard/shipments/${shipment_id}/edit/invoices/${invoice_id}/edit_invoice`,
                active: true,
            },
            ]}
        />

        {/* Rate Table */}
        <Suspense fallback={<InvoiceRatesTableSkeleton/>}>
            <RatesTableShipmentEditInvoice rates={rates} shipment_id={shipment_id} invoice_id={invoice_id} />
        </Suspense>

        <InvoiceEditFormFromShipment customer={customer} currencies={currencies} agreements={agreements} organisation={organisation} rates={rates} invoice={invoice} currencies_rates={currencies_rates} invoice_rates={invoice_rates} shipment_id={shipment_id}/>
        </main>
    );
}