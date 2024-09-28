import EditShipmentForm from '@/app/ui/shipments/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { 
    fetchCustomers, 
    fetchDocumentations, 
    fetchOrganisations,
    fetchSales,
    fetchShipmentFullById,

} from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CreateRate, CreateRateEditInvoice } from '@/app/ui/rates/buttons';
import { Suspense } from 'react';
import { InvoiceRatesTableSkeleton } from '@/app/ui/skeletons';
import EditRatesTable from '@/app/ui/rates/edit-rates-table';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { CalculatorIcon, DocumentDuplicateIcon, InformationCircleIcon, ListBulletIcon, MapIcon } from '@heroicons/react/24/outline';

export const revalidate = 0
export const dynamic = 'force-dynamic'
 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    const [customers, organisations, sales, documentations, shipment] = await Promise.all([
        fetchCustomers(),
        fetchOrganisations(),
        fetchSales(),
        fetchDocumentations(),
        fetchShipmentFullById(id),
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

            <TabGroup>
                <TabList className="flex gap-8 border-b border-gray-200 border-b mb-4">

                <Tab className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
                    data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
                    data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
                    data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                        <InformationCircleIcon className='w-6' />
                        <p className='hidden md:block'>Info</p>
                </Tab>
                <Tab className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
                    data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
                    data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
                    data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                        <MapIcon className='w-6' />
                        <p className='hidden md:block'>Routes</p>
                </Tab>
                <Tab className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
                    data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
                    data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
                    data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                        <ListBulletIcon className='w-6' />
                        <p className='hidden md:block'>Units</p>
                </Tab>
                <Tab className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
                    data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
                    data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
                    data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                        <CalculatorIcon className='w-6' />
                        <p className='hidden md:block'>Rates</p>
                </Tab>
                <Tab className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
                    data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
                    data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
                    data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                        <DocumentDuplicateIcon className='w-6' />
                        <p className='hidden md:block'>Invoices</p>
                </Tab>

                </TabList>
                <TabPanels>
                <TabPanel>
                    <EditShipmentForm customers={customers} organisations={organisations} sales={sales} documentations={documentations} shipment={shipment}/>
                </TabPanel>
                <TabPanel>Routes info</TabPanel>
                <TabPanel>Units info</TabPanel>
                <TabPanel>Rates info</TabPanel>
                <TabPanel>Invoices info</TabPanel>
                </TabPanels>
            </TabGroup>
        </main>
    );
}