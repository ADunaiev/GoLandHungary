import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchCurrencies, fetchAgreementsByCusomerIdAndOrganisationId, fetchOrganisations } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
  const currencies = await fetchCurrencies();
  const agreements = await fetchAgreementsByCusomerIdAndOrganisationId('', '');
  const organisations = await fetchOrganisations();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} currencies={currencies} agreements={agreements} organisations={organisations}/>
    </main>
  );
}