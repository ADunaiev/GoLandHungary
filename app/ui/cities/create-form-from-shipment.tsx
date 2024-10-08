'use client'

import { CityField, CountryField, ShipmentField, TransportTypeField, UnitTypeField } from "@/app/lib/definitions"
import { CityFormSchema, CityTypeSchema, RouteFormSchema, RouteTypeSchema, UnitFormSchema, UnitTypeSchema } from "@/app/lib/schemas/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createCity, createRouteFromShipment, createUnit } from "@/app/lib/actions"
import { 
    TruckIcon, 
    BuildingOfficeIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { Button } from '@/app/ui/button'
import { useState } from 'react'
import React from "react"
import { toast, Toaster } from 'sonner'
import { useDebouncedCallback } from "use-debounce"

export default function CreateCityForm({
    countries,
    shipment_id
} : {
    countries: CountryField[],
    shipment_id: string,
}) {
    const createCityFromShipment = createCity.bind(null, shipment_id);

    const [data, setData] = useState<CityTypeSchema>();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<CityTypeSchema>({
        resolver: zodResolver(CityFormSchema)
    });

    const onSubmit = useDebouncedCallback( async (data:CityTypeSchema) => {
        try {
            await createCityFromShipment(data);
            toast.success('City is created!')
        } catch(e) {
            toast.warning('City already exists!')
        }
    }, 300);

    return (
        <form onSubmit={(e) => {
            handleSubmit(onSubmit)(e).catch((e) => {
                console.log(e);
            })
        }}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                
                {/* City name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Enter name
                    </label>
                    <div className="relative">
                        <input
                            id="name"
                            type="text"
                            {...register('name_eng')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="name-error"          
                        />
                        <ChevronRightIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.name_eng?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.name_eng.message}>
                                {errors.name_eng.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

                {/* Country */}
                <div className="mb-4">
                    <label htmlFor="country" className="mb-2 block text-sm font-medium">
                        Choose country
                    </label>
                    <div className="relative">
                        <select
                            id="country"
                            {...register('country_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="country-error"
                            >
                            <option key="country" value="" disabled>
                                Select country
                            </option>
                            {countries.map((country) => (
                                <option 
                                key={country.id} 
                                value={country.id} >
                                    {country.name_eng}
                                </option>
                            ))}
                        </select>
                        <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="country-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.country_id?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.country_id.message}>
                                {errors.country_id.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/dashboard/shipments/${shipment_id}/edit/create_route`}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                    Cancel
                </Link>
                <Button type="submit">Create City</Button>
            </div>
        </form>
    );
}