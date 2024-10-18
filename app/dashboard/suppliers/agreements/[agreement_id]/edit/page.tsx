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
import { fetchSuppliers } from '@/app/lib/suppliers/data';
import { fetchSupplierAgreementById } from '@/app/lib/supplier_agreements/data';
import EditSupplierAgreementForm from '@/app/ui/supplier_agreements/edit-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({ params }: 
    { params: { 
        agreement_id: string,
    } }) {
    const agreement_id = params.agreement_id;

    const [organisations, suppliers, supplier_agreement] = await Promise.all([
        fetchOrganisations(),
        fetchSuppliers(),
        fetchSupplierAgreementById(agreement_id),
      ])

    if(!supplier_agreement) {
        notFound();
    }

    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Suppliers', href: '/dashboard/suppliers' },
            { label: 'Agreements', href: '/dashboard/suppliers/agreements' },
            {
                label: 'Edit Agreement',
                href: `/dashboard/suppliers/agreements/${agreement_id}/edit`,
                active: true,
            },
            ]}
        />

            <EditSupplierAgreementForm organisations={organisations} suppliers={suppliers} supplier_agreement={supplier_agreement}/> 
        </main>
    );
}