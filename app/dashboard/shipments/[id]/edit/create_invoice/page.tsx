import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { cache, Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import RatesTable from '@/app/ui/rates/rates-table';
import { CreateRate, RestoreRatesInShipmentInvoice } from '@/app/ui/rates/buttons';
import { fetchCustomers, fetchCurrencies, fetchAgreementsByCusomerIdAndOrganisationId, fetchOrganisations, fetchInvoiceDraft, fetchInvoiceRatesByInvoiceNumber, fetchCurrenciesRates, fetchShipmentById, fetchShipmentFullById, fetchRatesByShipmentId, fetchCustomerById, fetchOrganisationById, fetchRoutesByShipmentId, fetchUnitsByShipmentId, fetchRatesByInvoiceNumber, setInvoiceNumberToShipmentRatesWithoutInvoices, fetchShipmentRatesForInvoice } from '@/app/lib/data';
import { CustomerField, OrganisationField } from '@/app/lib/definitions';
import CreateInvoiceFromShipmentForm from '@/app/ui/invoices/create-form-from-shipment';
import RatesTableShipment from '@/app/ui/rates/rates-table-shipments';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page({params } : {
    params: {
        id: string,
    }
}) {

  const shipment_id = params.id;
  const shipment = await fetchShipmentFullById(shipment_id);

  /*
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60 * 1000;
  const formattedTodayTime = today.getTime() - offset;
  const formattedToday = new Date(formattedTodayTime);
  */

  const [currencies, invoice, agreements, currencies_rates] = await Promise.all([
    fetchCurrencies(),
    fetchInvoiceDraft(),
    fetchAgreementsByCusomerIdAndOrganisationId(shipment.customer_id, shipment.organisation_id),
    fetchCurrenciesRates(),
  ])

  // await setInvoiceNumberToShipmentRatesWithoutInvoices(invoice.number, shipment_id);
  const rates = await fetchShipmentRatesForInvoice(shipment_id);
  const routes = await fetchRoutesByShipmentId(shipment.id);
  const units = await fetchUnitsByShipmentId(shipment.id)
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shipment', href: `/dashboard/shipments/${shipment_id}/edit?tab=4` },
          {
            label: 'Create Invoice',
            href: `/dashboard/shipments/${shipment.id}/edit/create_invoice`,
            active: true,
          },
        ]}
      />

      {/* Rate Table */}
      <Suspense fallback={<InvoiceRatesTableSkeleton/>}>
          <RatesTableShipment shipment_id={shipment_id} rates={rates}/>
      </Suspense>

      <CreateInvoiceFromShipmentForm currencies={currencies} units={units} routes={routes} agreements={agreements} rates={rates} invoice={invoice} currencies_rates={currencies_rates} shipment={shipment}/>

    </main>
  );
}