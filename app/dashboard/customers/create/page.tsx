import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { users } from '@/app/lib/placeholder-data'
import bcrypt from 'bcrypt'
import { db } from '@vercel/postgres'
import { fetchCountries, fetchCountriesFull } from '@/app/lib/data';
import { EuVatValidationData, EuVatValidationJsonResponse } from '@/app/lib/definitions';
import { error } from 'console';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page() {

  const countries = await fetchCountriesFull();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <Form countries={countries} />
    </main>
  );
}