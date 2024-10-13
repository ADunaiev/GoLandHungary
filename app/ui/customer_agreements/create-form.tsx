'use client'

import { CityField, CountryField, CustomerAgreement, CustomerField, OrganisationField, ShipmentField, TransportTypeField, UnitTypeField } from "@/app/lib/definitions"
import { CityFormSchema, CityTypeSchema, CurrencyRateFormSchema, CurrencyRateTypeSchema, CustomerAgreementFormSchema, CustomerAgreementType, RouteFormSchema, RouteTypeSchema, UnitFormSchema, UnitTypeSchema } from "@/app/lib/schemas/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createCity, createCurrencyRate, createCustomerAgreement, createRouteFromShipment, createUnit } from "@/app/lib/actions"
import { 
    TruckIcon, 
    BuildingOfficeIcon,
    ChevronRightIcon,
    CalendarDaysIcon,
    CurrencyEuroIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    CircleStackIcon,
    NumberedListIcon,
    ClockIcon,
    UserGroupIcon
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { Button } from '@/app/ui/button'
import { useState } from 'react'
import React from "react"
import { toast, Toaster } from 'sonner'
import { I18nProvider } from "@react-aria/i18n"

export default function CustomerAgreementForm(
    { organisations, customers } :
    { 
        organisations: OrganisationField[],
        customers: CustomerField[],
    }
) {

    const [data, setData] = useState<CustomerAgreementType>();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<CustomerAgreementType>({
        resolver: zodResolver(CustomerAgreementFormSchema)
    });

    const onSubmit = async (data: CustomerAgreementType) => {
        try {
            await createCustomerAgreement(data);
            toast.success('Customer agreement is added!')
        } catch(e) {
            toast.warning('Customer agreement already exists!')
        }
    }

    return (
        <form onSubmit={(e) => {
            handleSubmit(onSubmit)(e).catch((e) => {
                console.log(e);
            })
        }}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                
                {/* Number */}
                <div className="mb-4">
                    <label htmlFor="number" className="mb-2 block text-sm font-medium">
                        Number
                    </label>
                    <div className="relative">
                        <input
                            id="number"
                            type="text"
                            {...register('number')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="number-error"          
                        />
                        <NumberedListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="number-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.number?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.number.message}>
                                {errors.number.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

                {/* Date */}
                <div className="mb-4">
                    <label htmlFor="date" className="mb-2 block text-sm font-medium">
                        Date
                    </label>
                    <div className="relative">
                        <I18nProvider locale='en-GB'>
                            <input
                            id="date"
                            type="date"
                            placeholder='dd-mm-yyyy'
                            {...register('date')}
                            defaultValue={new Date().toISOString().split('T')[0]}
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

                {/* Validity */}
                <div className="mb-4">
                    <label htmlFor="validity" className="mb-2 block text-sm font-medium">
                        Validity
                    </label>
                    <div className="relative">
                        <I18nProvider locale='en-GB'>
                            <input
                            id="validity"
                            type="date"
                            placeholder='dd-mm-yyyy'
                            {...register('validity')}
                            defaultValue={new Date().toISOString().split('T')[0]}
                            aria-describedby="validity-error"
                            className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                            />
                        </I18nProvider>
                        <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="validity-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.validity?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.validity.message}>
                                {errors.validity.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>



            </div>

            <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">

                {/* Organisation */}
                <div className="mb-4">
                    <label htmlFor="organisation" className="mb-2 block text-sm font-medium">
                        Choose organisation
                    </label>
                    <div className="relative">
                        <select
                            id="organisation"
                            {...register('organisation_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue='7d79388c-3c0b-4c30-8deb-c32263509c37'
                            aria-describedby="organisation-error"
                            >
                            {organisations.map((organisation) => (
                                <option 
                                key={organisation.id} 
                                value={organisation.id} >
                                    {organisation.name_eng}
                                </option>
                            ))}
                        </select>
                        <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

                {/* Customer */}
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Choose customer
                    </label>
                    <div className="relative">
                        <select
                            id="customer"
                            {...register('customer_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=''
                            aria-describedby="customer-error"
                            >
                            {customers.map((customer) => (
                                <option 
                                key={customer.id} 
                                value={customer.id} >
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                        <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.customer_id?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.customer_id.message}>
                                {errors.customer_id.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/dashboard/customers/agreements/view`}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                    Cancel
                </Link>
                <Button type="submit">Create Agreement</Button>
            </div>
        </form>
    );
}