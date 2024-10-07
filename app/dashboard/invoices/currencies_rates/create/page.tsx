import { fetchCities, fetchCountries, fetchCurrencies, fetchOrganisations, fetchRoutes, fetchServices, fetchShipmentById, fetchShipments, fetchTransportTypes, fetchUnitTypes, fetchVatRates } from '@/app/lib/data';
import CreateCityForm from '@/app/ui/cities/create-form-from-shipment';
import CreateCurrencyRateForm from '@/app/ui/currencies/create-from';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'
import CreateRateFormFromShipments from '@/app/ui/rates/create-form-from-shipments';
import CreateRouteFormFromShipments from '@/app/ui/routes/create-form-from-shipment';
import CreateUnitForm from '@/app/ui/units/create-form';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page() {

  const organisations = await fetchOrganisations();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: `/dashboard/invoices` },
          { label: 'Currencies', href: `/dashboard/invoices/currencies_rates/view` },
          {
            label: 'Create Rate',
            href: `/dashboard/invoices/currencies_rates/create`,
            active: true,
          },
        ]}
      />
      <CreateCurrencyRateForm organisations={organisations} />
    </main>
  );
}