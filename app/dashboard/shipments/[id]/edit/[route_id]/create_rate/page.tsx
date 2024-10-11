import { fetchCurrencies, fetchRouteById, fetchRoutes, fetchRoutesByShipmentId, fetchRoutesFieldsByShipmentId, fetchServices, fetchServicesFull, fetchShipmentById, fetchShipments, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'
import CreateRateFormFromShipments from '@/app/ui/rates/create-form-from-shipments';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({ params }:{ params: { id: string, route_id: string, } }) {
  const shipment_id = params.id;
  const route_id = params.route_id;

  const [services, currencies, vat_rates, route, shipment] = await Promise.all([
    fetchServicesFull(),
    fetchCurrencies(),
    fetchVatRates(),
    fetchRouteById(route_id),
    fetchShipmentById(shipment_id),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shipment', href: `/dashboard/shipments/${shipment_id}/edit?tab=3` },
          {
            label: 'Create Rate',
            href: `/dashboard/shipments/${shipment_id}/edit/${route_id}/create_rate`,
            active: true,
          },
        ]}
      />
      <CreateRateFormFromShipments services={services} currencies={currencies} vat_rates={vat_rates} route={route} shipment={shipment}/>
    </main>
  );
}