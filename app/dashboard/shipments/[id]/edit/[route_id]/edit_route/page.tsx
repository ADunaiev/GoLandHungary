import { fetchCities, fetchCurrencies, fetchRouteById, fetchRoutes, fetchServices, fetchShipmentById, fetchShipments, fetchTransportTypes, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'
import CreateRateFormFromShipments from '@/app/ui/rates/create-form-from-shipments';
import CreateRouteFormFromShipments from '@/app/ui/routes/create-form-from-shipment';
import EditRouteFormFromShipments from '@/app/ui/routes/edit-form-from-shipment';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({ params }:{ params: { id: string, route_id: string } }) {
  const shipment_id = params.id;
  const route_id = params.route_id;

  const [cities, transport_types, shipment, route] = await Promise.all([
    fetchCities(),
    fetchTransportTypes(),
    fetchShipmentById(shipment_id),
    fetchRouteById(route_id),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shipment', href: `/dashboard/shipments/${shipment_id}/edit?tab=1` },
          {
            label: 'Edit Route',
            href: `/dashboard/shipments/${shipment_id}/edit/${route_id}/edit_route`,
            active: true,
          },
        ]}
      />
      <EditRouteFormFromShipments cities={cities} transport_types={transport_types} shipment_id={shipment_id} route={route}/>
    </main>
  );
}