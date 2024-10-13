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
    fetchAgreements,
    fetchCustomerById,
    fetchCountries,
    fetchCustomerFullById,
    fetchCustomerAgreementById
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CreateRate, CreateRateEditInvoice } from '@/app/ui/rates/buttons';
import { Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import EditRatesTable from '@/app/ui/rates/edit-rates-table';
import CustomerEditForm from '@/app/ui/customers/edit-form';
import EditCustomerAgreementForm from '@/app/ui/customer_agreements/edit-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({ params }: 
    { params: { 
        agreement_id: string,
    } }) {
    const agreement_id = params.agreement_id;

    const [organisations, customers, customer_agreement] = await Promise.all([
        fetchOrganisations(),
        fetchCustomers(),
        fetchCustomerAgreementById(agreement_id),
      ])

    if(!customer_agreement) {
        notFound();
    }

    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Customers', href: '/dashboard/customers' },
            { label: 'Agreements', href: '/dashboard/customers/agreements/view' },
            {
                label: 'Edit Agreement',
                href: `/dashboard/customers/agreements/${agreement_id}/edit`,
                active: true,
            },
            ]}
        />

        <EditCustomerAgreementForm organisations={organisations} customers={customers} customer_agreement={customer_agreement}/>
        </main>
    );
}