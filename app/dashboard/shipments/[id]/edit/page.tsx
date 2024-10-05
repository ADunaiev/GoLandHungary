import EditShipmentForm from '@/app/ui/shipments/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { 
    fetchCustomers, 
    fetchDocumentations, 
    fetchInvoicesByShipmentId, 
    fetchOrganisations,
    fetchRatesByShipmentId,
    fetchRoutesByShipmentId,
    fetchSales,
    fetchShipmentFullById,
    fetchUnitsByShipmentId
} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CreateRate, CreateRateEditInvoice, CreateRateFromShipment } from '@/app/ui/rates/buttons';
import { Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import EditRatesTable from '@/app/ui/rates/edit-rates-table';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { CalculatorIcon, DocumentDuplicateIcon, InformationCircleIcon, ListBulletIcon, MapIcon } from '@heroicons/react/24/outline';
import RatesTable from '@/app/ui/rates/rates-table';
import { CreateRouteFromShipment } from '@/app/ui/routes/buttons';
import ShipmentRoutesTable from '@/app/ui/routes/routes-table';
import ShipmentInfoPanel from '@/app/ui/shipments/shipment-info';
import ShipmentRoutesUnitsTable from '@/app/ui/units/routes-units-table';
import InvoicesTableData from '@/app/ui/invoices/table';
import CreateInvoiceFromShipmentForm from '@/app/ui/invoices/create-form-from-shipment';
import { CreateInvoiceFromShipment } from '@/app/ui/invoices/buttons';
import InvoicesTableShipment from '@/app/ui/invoices/invoices-table-shipment';
import RatesTableShipmentTab from '@/app/ui/rates/rates-table-shipment-tab';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({ params, searchParams }: { 
    params: { id: string },
    searchParams?: { tab?: string }
}) {
    const id = params.id;
    const tabIndex = Number(searchParams?.tab) || 0;

    const [customers, organisations, sales, documentations, shipment, rates, routes, units, invoices] = await Promise.all([
        fetchCustomers(),
        fetchOrganisations(),
        fetchSales(),
        fetchDocumentations(),
        fetchShipmentFullById(id),
        fetchRatesByShipmentId(id),
        fetchRoutesByShipmentId(id),
        fetchUnitsByShipmentId(id),
        fetchInvoicesByShipmentId(id),
    ]);

    if(!shipment) {
        notFound();
    }

    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Shipments', href: '/dashboard/shipments' },
            {
                label: 'Edit Shipment',
                href: `/dashboard/shipments/${id}/edit`,
                active: true,
            },
            ]}
        />

        <ShipmentInfoPanel shipment={shipment} />

        <TabGroup defaultIndex={tabIndex}>
            <TabList className="flex gap-8 border-b border-gray-200 border-b mb-4">

                <Tab key='info_tab' className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
                    data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
                    data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
                    data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                        <InformationCircleIcon className='w-6' />
                        <p className='hidden md:block'>Info</p>
                </Tab>
                <Tab key='routes_tab' className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
                    data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
                    data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
                    data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                        <MapIcon className='w-6' />
                        <p className='hidden md:block'>Routes</p>
                </Tab>
                <Tab key='units_tab' className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
                    data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
                    data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
                    data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                        <ListBulletIcon className='w-6' />
                        <p className='hidden md:block'>Units</p>
                </Tab>
                <Tab key='rates_tab' className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
                    data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
                    data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
                    data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                        <CalculatorIcon className='w-6' />
                        <p className='hidden md:block'>Rates</p>
                </Tab>
                <Tab key='invoices_tab' className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
                    data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
                    data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
                    data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                        <DocumentDuplicateIcon className='w-6' />
                        <p className='hidden md:block'>Invoices</p>
                </Tab>

            </TabList>
            <TabPanels>
                <TabPanel key='info-tab-panel'>
                    <EditShipmentForm customers={customers} organisations={organisations} sales={sales} documentations={documentations} shipment={shipment}/>
                </TabPanel>
                <TabPanel key='routes-tab-panel'>
                    {/* Route Tab */}
                    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                        <CreateRouteFromShipment shipment_id={id}/>
                    </div>
                    <Suspense fallback={<InvoiceRatesTableSkeleton/>}>
                        <ShipmentRoutesTable routes={routes} shipment_id={id}/>
                    </Suspense>
                </TabPanel>
                <TabPanel key='units-tab-panel'>
                    {/* Units tab */}
                    <ShipmentRoutesUnitsTable routes={routes} units={units} shipment_id={id}/>
                </TabPanel>
                <TabPanel key='rates-tab-panel'>
                    {/* Rate Tab */}
                    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                        <CreateRateFromShipment id={id}/>
                    </div>
                    <Suspense fallback={<InvoiceRatesTableSkeleton/>}>
                        <RatesTableShipmentTab shipment_id={id} rates={rates}/>
                    </Suspense>
                </TabPanel>
                <TabPanel key='invoices-tab-panel'>
                    {/* Invoice Tab */}
                    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                        <CreateInvoiceFromShipment shipment_id={id} />
                    </div>
                    <Suspense fallback={<InvoiceRatesTableSkeleton />}>
                        <InvoicesTableShipment query='' currentPage={1} invoices={invoices} shipment_id={id}/>
                    </Suspense>
                </TabPanel>
            </TabPanels>
        </TabGroup>
        </main>
    );
}