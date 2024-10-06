import { fetchCurrencies, fetchRoutes, fetchServices, fetchShipments, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({ params }:{ params: { id: string } }) {
  const invoice_number = params.id;

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
          { label: 'Invoice', href: '/dashboard/invoices/create' },
          {
            label: 'Create Rate',
            href: `/dashboard/invoices/create/${invoice_number}/create_rate`,
            active: true,
          },
        ]}
      />
      <Form services={services} currencies={currencies} vat_rates={vat_rates} routes={routes} shipments={shipments} invoice_number={invoice_number} isCreateInvoice={true}/>
    </main>
  );
}