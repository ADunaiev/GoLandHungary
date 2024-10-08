'use client';

import { CustomerField, ShipmentTypeFull, UserField,  } from '@/app/lib/definitions';
import {
    ArrowRightIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  HomeIcon,
  TagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateInvoice, State, updateShipment } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { 
  CurrencyField, 
  CustomerAgreementField, 
  OrganisationField, 
  RateTable,
  InvoiceTypeFull,
  CurrencyRateField, 
} from '@/app/lib/definitions';
import { InvoiceType, ShipmentFormSchema, ShipmentType } from '@/app/lib/schemas/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InvoiceFormSchema } from '@/app/lib/schemas/schema';
import { I18nProvider } from '@react-aria/i18n';
import InvoiceTable from '@/app/ui/rates/invoice-table';
import { UpdateShipment } from './buttons';

export default function EditShipmentForm ({ 
  customers,
  organisations,
  sales,
  documentations,
  shipment,

}: { 
  customers: CustomerField[],
  organisations: OrganisationField[],
  sales: UserField[],
  documentations: UserField[],
  shipment: ShipmentTypeFull
}) {
  const [data, setData] = useState<ShipmentType>();

  const updateShipmentWithId = updateShipment.bind(null, shipment.id);

  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  const formattedDate = (new Date(shipment.date)).getTime() - offset;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {errors}
  } = useForm<ShipmentType>({
      resolver: zodResolver(ShipmentFormSchema),
  });

  const onSubmit = async(data: ShipmentType) => {
    try {
      await updateShipmentWithId(data);
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <form onSubmit={(e) => {
      handleSubmit(
        onSubmit
      )(e).catch((e) => {
        console.log(e);
      })
    }}>

    <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {/* Number */}
        <div className="mb-4">
            <label htmlFor="number" className="mb-2 block text-sm font-medium">
                Shipment number
            </label>
            <div className="relative">
                <input
                    id="number"
                    step="0.01"
                    disabled
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="number-error"
                    defaultValue={shipment.number}
                    />
                <ClipboardDocumentCheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
        </div>

        {/* Date */}
        <div className="mb-4">
            <label htmlFor="date" className="mb-2 block text-sm font-medium">
                Shipment date
            </label>
            <div className="relative">
                <I18nProvider locale='en-GB'>
                    <input
                    id="date"
                    type="date"
                    disabled
                    placeholder='dd-mm-yyyy'
                    {...register('date')}
                    defaultValue={new Date(formattedDate).toISOString().split('T')[0]}
                    aria-describedby="date-error"
                    className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                    />
                </I18nProvider>
                <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="date-error" aria-live="polite" aria-atomic="true">
                { 
                errors.date?.message && 
                (
                    <p className="mt-2 text-sm text-red-500" key={errors.date.message}>
                        {errors.date.message}
                    </p>
                    )                      
                }
            </div>
        </div>

        {/* Customer Name */}
        <div className="mb-4">
            <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                Choose customer
            </label>
            <div className="relative">
                <select
                id="customer"
                {...register('customerId')}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={shipment.customer_id}
                aria-describedby="customer-error"
                >
                <option value="" disabled>
                    Select a customer
                </option>
                {customers.map((customer) => (
                    <option 
                    key={customer.id} 
                    value={customer.id} >
                        {customer.name}
                    </option>
                ))}
                </select>
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
                { 
                errors.customerId?.message && 
                (
                    <p className="mt-2 text-sm text-red-500" key={errors.customerId.message}>
                        {errors.customerId.message}
                    </p>
                    )                      
                }
            </div>
        </div>

        {/* Organisation */}
        <div className="mb-4">
            <label htmlFor="organisation" className="mb-2 block text-sm font-medium">
                Organisation
            </label>
            <div className="relative">
                <select
                id="organisation"
                {...register('organisation_id')}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={shipment.organisation_id}
                aria-describedby="organisation-error"
                >
                <option value="" disabled>
                    Select an organisation
                </option>
                {organisations.map((organisation) => (
                    <option 
                    key={organisation.id} 
                    value={organisation.id} >
                        {organisation.name_eng}
                    </option>
                ))}
                </select>
                <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="organisation-error" aria-live="polite" aria-atomic="true">
                { 
                errors.organisation_id?.message && 
                (
                    <p className="mt-2 text-sm text-red-500" key={errors.organisation_id.message}>
                        {errors.organisation_id.message}
                    </p>
                    )                      
                }
            </div>
        </div>

        {/* Sales Name */}
        <div className="mb-4">
            <label htmlFor="sales" className="mb-2 block text-sm font-medium">
                Choose sales
            </label>
            <div className="relative">
                <select
                id="sales"
                {...register('salesId')}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={shipment.sales_id}
                aria-describedby="sales-error"
                >
                <option value="" disabled>
                    Select a sales
                </option>
                {sales.map((user) => (
                    <option 
                    key={user.id} 
                    value={user.id} >
                        {user.name}
                    </option>
                ))}
                </select>
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="sales-error" aria-live="polite" aria-atomic="true">
                { 
                errors.salesId?.message && 
                (
                    <p className="mt-2 text-sm text-red-500" key={errors.salesId.message}>
                        {errors.salesId.message}
                    </p>
                    )                      
                }
            </div>
        </div>

        {/* Documetation Name */}
        <div className="mb-4">
            <label htmlFor="documentation" className="mb-2 block text-sm font-medium">
                Choose docs
            </label>
            <div className="relative">
                <select
                id="documentation"
                {...register('documentationId')}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={shipment.documentation_id}
                aria-describedby="documentation-error"
                >
                <option value="" disabled>
                    Select a documentation
                </option>
                {documentations.map((user) => (
                    <option 
                    key={user.id} 
                    value={user.id} >
                        {user.name}
                    </option>
                ))}
                </select>
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="documentation-error" aria-live="polite" aria-atomic="true">
                { 
                errors.documentationId?.message && 
                (
                    <p className="mt-2 text-sm text-red-500" key={errors.documentationId.message}>
                        {errors.documentationId.message}
                    </p>
                    )                      
                }
            </div>
        </div>

    </div>

<div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">

    {/* Remarks */}
    <div className="mb-4">
        <label htmlFor="remarks" className="mb-2 block text-sm font-medium">
            Remarks
        </label>
        <div className="relative">
            <textarea
                id="remarks"
                placeholder=''
                {...register('remarks')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="remarks-error"
                defaultValue={shipment.remarks}
                />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
    </div>

    {/* Customer reference */}
    <div className="mb-4">
        <label htmlFor="customer-reference" className="mb-2 block text-sm font-medium">
            Customer reference
        </label>
        <div className="relative">
            <textarea
                id="customer-reference"
                placeholder=''
                {...register('customer_reference')}
                defaultValue={shipment.customer_reference}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="remarks-error"
                />
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
    </div>

    {/* Shipment Status */}
    <fieldset>
        <legend className="mb-2 block text-sm font-medium">
            Set the shipment status
        </legend>
        <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">

            <div className="flex gap-4">

            <div className="flex items-center">
                <input
                    id="in_process"
                    {...register('status')}
                    type="radio"
                    value="in_process"
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    aria-describedby="status-error"
                    defaultChecked={shipment.status === 'in_process'}
                />
                <label
                    htmlFor="in_process"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                    In_process <ArrowRightIcon className="h-4 w-4" />
                </label>
            </div>

            <div className="flex items-center">
                <input
                    id="delivered"
                    {...register('status')}
                    type="radio"
                    value="delivered"
                    defaultChecked={shipment.status === 'delivered'}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                    htmlFor="delivered"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                    Delivered <CheckIcon className="h-4 w-4" />
                </label>
            </div>

            </div>

        </div>
        <div id="status-error" aria-live="polite" aria-atomic="true">
            {
            errors.status?.message &&
            (
                <p className="mt-2 text-sm text-red-500" key={errors.status.message}>
                {errors.status.message}
                </p>
            )
            }
        </div>
        </fieldset>
        </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/shipments"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Shipment</Button>
      </div>

    </form>
  );
}
