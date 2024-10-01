import { fetchCities, fetchCurrencies, fetchRoutes, fetchServices, fetchShipmentById, fetchShipments, fetchTransportTypes, fetchUnitTypes, fetchVatRates, fetchVehicleTypes } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'
import CreateRateFormFromShipments from '@/app/ui/rates/create-form-from-shipments';
import CreateRouteFormFromShipments from '@/app/ui/routes/create-form-from-shipment';
import CreateUnitForm from '@/app/ui/units/create-form';
import CreateVehicleForm from '@/app/ui/vehicles/create-from';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({ params }:
    { params: { id: string, route_id: string, unit_id: string } }) {
  const shipment_id = params.id;
  const route_id = params.route_id;
  const unit_id = params.unit_id;

  const [transport_types, vehicle_types] = await Promise.all([
    fetchTransportTypes(),
    fetchVehicleTypes(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shipment', href: `/dashboard/shipments/${shipment_id}/edit?tab=2` },
          { label: 'Add Vehicle', href: `/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_vehicle` },
          {
            label: 'Create Vehicle',
            href: `/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_vehicle/create_vehicle`,
            active: true,
          },
        ]}
      />
      <CreateVehicleForm transport_types={transport_types} vehicle_types={vehicle_types} shipment_id={shipment_id} route_id={route_id} unit_id={unit_id} />
    </main>
  );
}