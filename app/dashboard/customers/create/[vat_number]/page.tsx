import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { users } from '@/app/lib/placeholder-data'
import bcrypt from 'bcrypt'
import { db } from '@vercel/postgres'
import { fetchCountries, fetchCountriesFull } from '@/app/lib/data';
import { EuVatValidationData, EuVatValidationJsonResponse } from '@/app/lib/definitions';
import { error } from 'console';
import FormByVat from '@/app/ui/customers/create-form-by-vat';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({ params }: {
    params: {
        vat_number: string,
    }
}) {

    const vatNumber = params.vat_number
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
            <FormByVat vat_number={vatNumber} countries={countries} />
        </main>
    );
}