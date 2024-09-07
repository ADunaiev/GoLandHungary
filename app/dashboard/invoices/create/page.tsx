import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchCurrencies, fetchAgreementsByCusomerIdAndOrganisationId, fetchOrganisations, fetchInvoiceRates, fetchInvoiceNumber } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
  const currencies = await fetchCurrencies();
  const agreements = await fetchAgreementsByCusomerIdAndOrganisationId('', '');
  const organisations = await fetchOrganisations();
  const rates = await fetchInvoiceRates();
  const invoice_number = await fetchInvoiceNumber();
 
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
      <Form customers={customers} currencies={currencies} agreements={agreements} organisations={organisations} rates={rates} invoice_number={invoice_number}/>
    </main>
  );
}