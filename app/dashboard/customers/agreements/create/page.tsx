import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { users } from '@/app/lib/placeholder-data'
import bcrypt from 'bcrypt'
import { db } from '@vercel/postgres'
import { fetchCountries, fetchCountriesFull, fetchCustomers, fetchOrganisations } from '@/app/lib/data';
import CustomerAgreementForm from '@/app/ui/customer_agreements/create-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page() {

  const [organisations, customers] = await Promise.all([
    fetchOrganisations(),
    fetchCustomers(),
  ]) 

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          { label: 'Agreements', href: '/dashboard/customers/agreements/view' },
          {
            label: 'Create Agreement',
            href: '/dashboard/customers/agreements/create',
            active: true,
          },
        ]}
      />
      <CustomerAgreementForm organisations={organisations} customers={customers} />
    </main>
  );
}