import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { users } from '@/app/lib/placeholder-data'
import bcrypt from 'bcrypt'
import { db } from '@vercel/postgres'
import { fetchCountries, fetchCountriesFull } from '@/app/lib/data';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page() {
  /*add a user function 
  const client = await db.connect();

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (name, email, password, is_sale, is_documentation)
        VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.is_sale}, ${user.is_documentation})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  ); */

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