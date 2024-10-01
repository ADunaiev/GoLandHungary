import { fetchCities, fetchCurrencies, fetchRoutes, fetchServices, fetchShipmentById, fetchShipments, fetchTransportTypes, fetchUnitTypes, fetchVatRates, fetchVehicleTypes } from '@/app/lib/data';
import CreateDriverForm from '@/app/ui/drivers/create-form';
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

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shipment', href: `/dashboard/shipments/${shipment_id}/edit?tab=2` },
          { label: 'Add Driver', href: `/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_driver` },
          {
            label: 'Create Driver',
            href: `/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_driver/create_driver`,
            active: true,
          },
        ]}
      />
      <CreateDriverForm shipment_id={shipment_id} route_id={route_id} unit_id={unit_id} />
    </main>
  );
}