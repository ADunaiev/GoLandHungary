import { fetchCurrencies, fetchRateById, fetchRoutes, fetchRoutesByShipmentId, fetchRoutesFieldsByShipmentId, fetchServices, fetchShipmentById, fetchShipments, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'
import CreateRateFormFromShipments from '@/app/ui/rates/create-form-from-shipments';
import EditRateFormFromShipment from '@/app/ui/rates/edit-form-from-shipment';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({ params }:
    { params: { id: string, rate_id: string } 
}) {
  const shipment_id = params.id;
  const rate_id = params.rate_id;
  const rate = await fetchRateById(rate_id)

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
            label: 'Edit Rate',
            href: `/dashboard/shipments/${shipment_id}/edit/rates/${rate_id}/edit`,
            active: true,
          },
        ]}
      />
      <EditRateFormFromShipment rate={rate} services={services} currencies={currencies} vat_rates={vat_rates} routes={routes} shipment={shipment}/>
    </main>
  );
}