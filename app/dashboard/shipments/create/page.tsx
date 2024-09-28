import { fetchCustomers, fetchDocumentations, fetchOrganisations, fetchSales, fetchShipmentNumber, } from '@/app/lib/data' 
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/shipments/create-form'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react'
import clsx from 'clsx'
import { Bars3Icon, BanknotesIcon, MapIcon, DocumentDuplicateIcon, InformationCircleIcon, ListBulletIcon, CalculatorIcon } from '@heroicons/react/24/outline'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page() {
  const [customers, organisations, sales, documentations, shipment_number] = await Promise.all([
    fetchCustomers(),
    fetchOrganisations(),
    fetchSales(),
    fetchDocumentations(),
    fetchShipmentNumber(),
  ])

  const shipmentTabs = [ 
    { name: 'General'}, 
    { name: 'Routes'},
    { name: 'Units'},
    { name: 'Invoices'},
  ]

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Shipments', href: '/dashboard/shipments' },
          {
            label: 'Create Shipment',
            href: '/dashboard/shipments/create',
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
          <Tab disabled className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
              data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
              data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
              data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                <MapIcon className='w-6' />
                <p className='hidden md:block'>Routes</p>
          </Tab>
          <Tab disabled className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
              data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
              data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
              data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                <ListBulletIcon className='w-6' />
                <p className='hidden md:block'>Units</p>
          </Tab>
          <Tab disabled className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
              data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
              data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
              data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                <CalculatorIcon className='w-6' />
                <p className='hidden md:block'>Rates</p>
          </Tab>
          <Tab disabled className='flex gap-2 py-2 text-sm/6 font-semibold text-gray-500 focus:outline-none 
              data-[selected]:text-blue-600 data-[selected]:border-b-2 data-[selected]:border-blue-600 
              data-[selected]:data-[hover]:text-blue-600 data-[selected]:data-[hover]:border-b-2 data-[selected]:data-[hover]:border-blue-600 
              data-[hover]:text-gray-700 data-[hover]:border-b-2 data-[hover]:border-gray-400'>
                <DocumentDuplicateIcon className='w-6' />
                <p className='hidden md:block'>Invoices</p>
          </Tab>

        </TabList>
        <TabPanels>
          <TabPanel>
            <Form customers={customers} organisations={organisations} sales={sales} documentations={documentations} shipment_number={shipment_number}/>
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