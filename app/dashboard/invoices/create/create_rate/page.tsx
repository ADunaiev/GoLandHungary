import { fetchCurrencies, fetchRoutes, fetchServices, fetchShipments, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'

export default async function Page() {
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
            href: '/dashboard/invoices/create/create_rate',
            active: true,
          },
        ]}
      />
      <Form services={services} currencies={currencies} vat_rates={vat_rates} routes={routes} shipments={shipments}/>
    </main>
  );
}