import { fetchCities, fetchCurrencies, fetchRoutes, fetchServices, fetchShipmentById, fetchShipments, fetchTransportTypes, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'
import CreateRateFormFromShipments from '@/app/ui/rates/create-form-from-shipments';
import CreateRouteFormFromShipments from '@/app/ui/routes/create-form-from-shipment';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({ params }:{ params: { id: string } }) {
  const shipment_id = params.id;

  const [cities, transport_types, shipment] = await Promise.all([
    fetchCities(),
    fetchTransportTypes(),
    fetchShipmentById(shipment_id),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shipment', href: `/dashboard/shipments/${shipment_id}/edit?tab=1` },
          {
            label: 'Create Route',
            href: `/dashboard/shipments/${shipment_id}/edit/create_route`,
            active: true,
          },
        ]}
      />
      <CreateRouteFormFromShipments cities={cities} transport_types={transport_types} shipment={shipment}/>
    </main>
  );
}