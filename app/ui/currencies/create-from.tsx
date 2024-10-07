'use client'

import { CityField, CountryField, OrganisationField, ShipmentField, TransportTypeField, UnitTypeField } from "@/app/lib/definitions"
import { CityFormSchema, CityTypeSchema, CurrencyRateFormSchema, CurrencyRateTypeSchema, RouteFormSchema, RouteTypeSchema, UnitFormSchema, UnitTypeSchema } from "@/app/lib/schemas/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createCity, createCurrencyRate, createRouteFromShipment, createUnit } from "@/app/lib/actions"
import { 
    TruckIcon, 
    BuildingOfficeIcon,
    ChevronRightIcon,
    CalendarDaysIcon,
    CurrencyEuroIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    CircleStackIcon
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { Button } from '@/app/ui/button'
import { useState } from 'react'
import React from "react"
import { toast, Toaster } from 'sonner'
import { I18nProvider } from "@react-aria/i18n"

export default function CreateCurrencyRateForm(
    { organisations } :
    { organisations: OrganisationField[], }
) {

    const [data, setData] = useState<CurrencyRateTypeSchema>();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<CurrencyRateTypeSchema>({
        resolver: zodResolver(CurrencyRateFormSchema)
    });

    const onSubmit = async (data:CurrencyRateTypeSchema) => {
        try {
            await createCurrencyRate(data);
            toast.success('Currecy rate is added!')
        } catch(e) {
            toast.warning('Currencies rate already exists!')
        }
    }

    return (
        <form onSubmit={(e) => {
            handleSubmit(onSubmit)(e).catch((e) => {
                console.log(e);
            })
        }}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                
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

            </div>

            <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* EUR Rate */}
                <div className="mb-4">
                    <label htmlFor="eur-rate" className="mb-2 block text-sm font-medium">
                        EUR
                    </label>
                    <div className="relative">
                        <input
                            id="eur-rate"
                            type="number"
                            {...register('eur_rate')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            step="0.01"
                            aria-describedby="eur-rate-error"          
                        />
                        <CurrencyEuroIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="eur-rate-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.eur_rate?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.eur_rate.message}>
                                {errors.eur_rate.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

                {/* USD Rate */}
                <div className="mb-4">
                    <label htmlFor="usd-rate" className="mb-2 block text-sm font-medium">
                        USD
                    </label>
                    <div className="relative">
                        <input
                            id="usd-rate"
                            type="number"
                            {...register('usd_rate')}
                            step="0.01"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="usd-rate-error"          
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="usd-rate-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.usd_rate?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.usd_rate.message}>
                                {errors.usd_rate.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

                {/* UAH Rate */}
                <div className="mb-4">
                    <label htmlFor="uah-rate" className="mb-2 block text-sm font-medium">
                        UAH
                    </label>
                    <div className="relative">
                        <input
                            id="uah-rate"
                            type="number"
                            {...register('uah_rate')}
                            step="0.01"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="uah-rate-error"          
                        />
                        <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="uah-rate-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.uah_rate?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.uah_rate.message}>
                                {errors.uah_rate.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

                {/* HUF Rate */}
                <div className="mb-4">
                    <label htmlFor="huf-rate" className="mb-2 block text-sm font-medium">
                        HUF
                    </label>
                    <div className="relative">
                        <input
                            id="huf-rate"
                            type="number"
                            {...register('huf_rate')}
                            step="0.01"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue="1"
                            aria-describedby="huf-rate-error"          
                        />
                        <CircleStackIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="huf-rate-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.huf_rate?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.huf_rate.message}>
                                {errors.huf_rate.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/dashboard/invoices/currencies_rates/view`}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                    Cancel
                </Link>
                <Button type="submit">Create Rate</Button>
            </div>
        </form>
    );
}