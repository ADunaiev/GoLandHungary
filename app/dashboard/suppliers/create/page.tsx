import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { users } from '@/app/lib/placeholder-data'
import bcrypt from 'bcrypt'
import { db } from '@vercel/postgres'
import { fetchCountries, fetchCountriesFull } from '@/app/lib/data';
import { EuVatValidationData, EuVatValidationJsonResponse } from '@/app/lib/definitions';
import { error } from 'console';
import SupplierCreateForm from '@/app/ui/suppliers/create-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page() {

  const countries = await fetchCountriesFull();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Suppliers', href: '/dashboard/suppliers' },
          {
            label: 'Create Supplier',
            href: '/dashboard/suppliers/create',
            active: true,
          },
        ]}
      />
      <SupplierCreateForm countries={countries} />
    </main>
  );
}