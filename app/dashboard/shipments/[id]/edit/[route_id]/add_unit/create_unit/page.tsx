import { fetchCities, fetchCurrencies, fetchRoutes, fetchServices, fetchShipmentById, fetchShipments, fetchTransportTypes, fetchUnitTypes, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'
import CreateRateFormFromShipments from '@/app/ui/rates/create-form-from-shipments';
import CreateRouteFormFromShipments from '@/app/ui/routes/create-form-from-shipment';
import CreateUnitForm from '@/app/ui/units/create-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({ params }:
    { params: { id: string, route_id: string } }) {
  const shipment_id = params.id;
  const route_id = params.route_id;

  const unit_types = await fetchUnitTypes();

  const [cities, transport_types, shipment] = await Promise.all([
    fetchCities(),
    fetchTransportTypes(),
    fetchShipmentById(shipment_id),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shipment', href: `/dashboard/shipments/${shipment_id}/edit?tab=2` },
          { label: 'Add Units', href: `/dashboard/shipments/${shipment_id}/edit/${route_id}/add_unit` },
          {
            label: 'Create Unit',
            href: `/dashboard/shipments/${shipment_id}/edit/${route_id}/add_unit/create_unit`,
            active: true,
          },
        ]}
      />
      <CreateUnitForm unit_types={unit_types} shipment_id={shipment_id} route_id={route_id}/>
    </main>
  );
}