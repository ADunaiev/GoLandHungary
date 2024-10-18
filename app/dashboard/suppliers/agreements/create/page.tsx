import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { users } from '@/app/lib/placeholder-data'
import bcrypt from 'bcrypt'
import { db } from '@vercel/postgres'
import { fetchCountries, fetchCountriesFull, fetchCustomers, fetchOrganisations } from '@/app/lib/data';
import CustomerAgreementForm from '@/app/ui/customer_agreements/create-form';
import { fetchSuppliers } from '@/app/lib/suppliers/data';
import SupplierAgreementForm from '@/app/ui/supplier_agreements/create-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page() {

  const [organisations, suppliers] = await Promise.all([
    fetchOrganisations(),
    fetchSuppliers(),
  ]) 

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Suppliers', href: '/dashboard/suppliers' },
          { label: 'Agreements', href: '/dashboard/suppliers/agreements' },
          {
            label: 'Create Agreement',
            href: '/dashboard/suppliers/agreements/create',
            active: true,
          },
        ]}
      />
        <SupplierAgreementForm organisations={organisations} suppliers={suppliers} /> 
    </main>
  );
}