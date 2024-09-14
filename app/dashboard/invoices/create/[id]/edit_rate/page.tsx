import { fetchCurrencies, fetchRateById, fetchRoutes, fetchServices, fetchShipments, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import EditRateForm from '@/app/ui/rates/edit-form';

export default async function Page({ params }:{ params: { id: string } }) {
  const rate_id = params.id;
  const rate = await fetchRateById(rate_id);

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
            label: 'Edit Rate',
            href: `/dashboard/invoices/create/${rate_id}/edit_rate`,
            active: true,
          },
        ]}
      />
      <EditRateForm services={services} currencies={currencies} vat_rates={vat_rates} routes={routes} shipments={shipments} rate={rate}/>
    </main>
  );
}