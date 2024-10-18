import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchExpencesCardData, fetchTransportCardData } from '@/app/lib/data';
import Image from 'next/image';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card key={'Collected'} title="Collected" value={totalPaidInvoices} type="collected" />
      <Card key={'Pending'} title="Pending" value={totalPendingInvoices} type="pending" />
      <Card key={'TotalInvoices'} title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        key={'TotalCustomers'}
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

export async function ExpencesCardWrapper() {
  const {
    numberOfInvoices,
    numberOfSuppliers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchExpencesCardData();

  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card key={'Collected'} title="Paid" value={totalPaidInvoices} type="collected" />
      <Card key={'Pending'} title="Pending" value={totalPendingInvoices} type="pending" />
      <Card key={'TotalInvoices'} title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        key={'TotalSuppliers'}
        title="Total Suppliers"
        value={numberOfSuppliers}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}

const imageMap = {
  avia: '/transport-types/pallet_air.png',
  auto: '/transport-types/tent_auto.png',
  rail: '/transport-types/wagon_railway.png',
  sea:  '/transport-types/bulk.png',
};

export function TransportCard({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type: 'auto' | 'avia' | 'rail' | 'sea';
}) {
  const image = imageMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {image ? <Image height={28} width={28} src={image} alt='transport' /> : null}
        <h3 className="mt-1 ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}

export async function TransportCardWrapper() {
  const {
    numberOfAuto,
    numberOfAvia,
    numberOfRail,
    numberOfSea,
  } = await fetchTransportCardData();

  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <TransportCard key={'Auto'} title="Auto" value={numberOfAuto} type="auto" />
      <TransportCard key={'Avia'} title="Avia" value={numberOfAvia} type="avia" />
      <TransportCard key={'Rail'} title="Rail" value={numberOfRail} type="rail" />
      <TransportCard key={'Sea'} title="Sea" value={numberOfSea} type="sea" />
    </>
  );
}