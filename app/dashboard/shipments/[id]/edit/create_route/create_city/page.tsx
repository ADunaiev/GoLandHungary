import { fetchCities, fetchCountries, fetchCurrencies, fetchRoutes, fetchServices, fetchShipmentById, fetchShipments, fetchTransportTypes, fetchUnitTypes, fetchVatRates } from '@/app/lib/data';
import CreateCityForm from '@/app/ui/cities/create-form-from-shipment';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'
import CreateRateFormFromShipments from '@/app/ui/rates/create-form-from-shipments';
import CreateRouteFormFromShipments from '@/app/ui/routes/create-form-from-shipment';
import CreateUnitForm from '@/app/ui/units/create-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({ params }:
    { params: { id: string, } }) {
  const shipment_id = params.id;

  const countries = await fetchCountries();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shipment', href: `/dashboard/shipments/${shipment_id}/edit?tab=1` },
          { label: 'Create Route', href: `/dashboard/shipments/${shipment_id}/edit/create_route` },
          {
            label: 'Create City',
            href: `/dashboard/shipments/${shipment_id}/edit/create_route/create_city`,
            active: true,
          },
        ]}
      />
      <CreateCityForm countries={countries} shipment_id={shipment_id} />
    </main>
  );
}