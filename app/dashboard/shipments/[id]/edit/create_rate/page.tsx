import { fetchCurrencies, fetchRoutes, fetchRoutesByShipmentId, fetchRoutesFieldsByShipmentId, fetchServices, fetchShipmentById, fetchShipments, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'
import CreateRateFormFromShipments from '@/app/ui/rates/create-form-from-shipments';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({ params }:{ params: { id: string } }) {
  const shipment_id = params.id;

  const [services, currencies, vat_rates, routes, shipment] = await Promise.all([
    fetchServices(),
    fetchCurrencies(),
    fetchVatRates(),
    fetchRoutesFieldsByShipmentId(shipment_id),
    fetchShipmentById(shipment_id),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shipment', href: `/dashboard/shipments/${shipment_id}/edit?tab=3` },
          {
            label: 'Create Rate',
            href: `/dashboard/shipments/${shipment_id}/edit/create_rate`,
            active: true,
          },
        ]}
      />
      <CreateRateFormFromShipments services={services} currencies={currencies} vat_rates={vat_rates} routes={routes} shipment={shipment}/>
    </main>
  );
}