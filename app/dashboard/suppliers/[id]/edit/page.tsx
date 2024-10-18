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
    fetchCountriesFull
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CreateRate, CreateRateEditInvoice } from '@/app/ui/rates/buttons';
import { Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import EditRatesTable from '@/app/ui/rates/edit-rates-table';
import CustomerEditForm from '@/app/ui/customers/edit-form';
import CustomersAgreementsTableByCustomer from '@/app/ui/customer_agreements/customer_tabel';
import { fetchSupplierFullById } from '@/app/lib/suppliers/data';
import SupplierEditForm from '@/app/ui/suppliers/edit-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({ params }: { params: { id: string } }) {
    const supplier_id = params.id;

    const [supplier, countries] = await Promise.all([
        fetchSupplierFullById(supplier_id),
        fetchCountriesFull(),
      ])

    if(!supplier) {
        notFound();
    }

    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Suppliers', href: '/dashboard/suppliers' },
            {
                label: 'Edit Supplier',
                href: `/dashboard/suppliers/${supplier_id}/edit`,
                active: true,
            },
            ]}
        />

        <SupplierEditForm supplier={supplier} countries={countries} />
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <h1>Agreements</h1>
        </div>
            {/*<CustomersAgreementsTableByCustomer customer_id={supplier.id} />*/}
        </main>
    );
}