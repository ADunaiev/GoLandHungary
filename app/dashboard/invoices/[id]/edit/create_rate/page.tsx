import { fetchCurrencies, fetchInvoiceById, fetchInvoiceFullById, fetchRoutes, fetchServices, fetchShipments, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'

export default async function Page({ params }:{ params: { id: string } }) {
  const invoice_id = params.id;
  const invoice = await fetchInvoiceFullById(invoice_id);

  const [services, currencies, vat_rates, routes, shipments] = await Promise.all([
    fetchServices(),
    fetchCurrencies(),
    fetchVatRates(),
    fetchRoutes(),
    fetchShipments(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Edit Invoice', href: `/dashboard/invoices/${invoice_id}/edit` },
          {
            label: 'Create Rate',
            href: `/dashboard/invoices/${invoice_id}/edit/create_rate`,
            active: true,
          },
        ]}
      />
      <Form services={services} currencies={currencies} vat_rates={vat_rates} routes={routes} shipments={shipments} invoice_number={invoice.number} isCreateInvoice={false}/>
    </main>
  );
}