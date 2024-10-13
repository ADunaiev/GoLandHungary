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
    fetchCustomerFullById
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CreateRate, CreateRateEditInvoice } from '@/app/ui/rates/buttons';
import { Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import EditRatesTable from '@/app/ui/rates/edit-rates-table';
import CustomerEditForm from '@/app/ui/customers/edit-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({ params }: { params: { id: string } }) {
    const customer_id = params.id;

    const [customer, countries] = await Promise.all([
        fetchCustomerFullById(customer_id),
        fetchCountries(),
      ])

    if(!customer) {
        notFound();
    }

    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Customers', href: '/dashboard/customers' },
            {
                label: 'Edit Customer',
                href: `/dashboard/customers/${customer_id}/edit`,
                active: true,
            },
            ]}
        />

        <CustomerEditForm customer={customer} countries={countries} />
        </main>
    );
}