'use client'

import { CityField, ShipmentField, TransportTypeField } from "@/app/lib/definitions"
import { RouteFormSchema, RouteTypeSchema } from "@/app/lib/schemas/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createRouteFromShipment } from "@/app/lib/actions"
import { 
    TruckIcon, 
    BuildingOfficeIcon
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { Button } from '@/app/ui/button'
import { useState } from 'react'
import React from "react"
import { CreateCityFromShipment } from "../cities/buttons"

export default function CreateRouteFormFromShipments({
    cities,
    transport_types,
    shipment,
} : {
    cities: CityField[],
    transport_types: TransportTypeField[],
    shipment: ShipmentField,
}) {
    const createRouteWithShipmentId = createRouteFromShipment.bind(null, shipment.id);

    const [data, setData] = useState<RouteTypeSchema>();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<RouteTypeSchema>({
        resolver: zodResolver(RouteFormSchema)
    });

    /* Don't forget to delete 
    React.useEffect(() => {
        const subscription = watch((value, { name, type }) =>
          console.log(value, name, type)
        )
        return () => subscription.unsubscribe()
      }, [watch]);
     till here */

    const onSubmit = async (data:RouteTypeSchema) => {
        try {
            await createRouteWithShipmentId(data);
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <form onSubmit={(e) => {
            handleSubmit(onSubmit)(e).catch((e) => {
                console.log(e);
            })
        }}>
            <div className="flex">
                <CreateCityFromShipment shipment_id={shipment.id} />
            </div>
            

            <div className="rounded-md bg-gray-50 p-4 mt-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            
                {/* Start city */}
                <div className="mb-4">
                    <label htmlFor="start-city" className="mb-2 block text-sm font-medium">
                        Choose start city
                    </label>
                    <div className="relative">
                        <select
                            id="start-city"
                            {...register('start_city_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="start-city-error"
                            >
                            <option key="start-city" value="" disabled>
                                Select a city
                            </option>
                            {cities.map((city) => (
                                <option 
                                key={city.id} 
                                value={city.id} >
                                    {city.name_eng}
                                </option>
                            ))}
                        </select>
                        <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />                    
                    </div>
                    <div id="start-city-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.start_city_id?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.start_city_id.message}>
                                {errors.start_city_id.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

                {/* End city */}
                <div className="mb-4">
                    <label htmlFor="end-city" className="mb-2 block text-sm font-medium">
                        Choose end city
                    </label>
                    <div className="relative">
                        <select
                            id="end-city"
                            {...register('end_city_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="end-city-error"
                            >
                            <option key="end-city" value="" disabled>
                                Select a city
                            </option>
                            {cities.map((city) => (
                                <option 
                                key={city.id} 
                                value={city.id} >
                                    {city.name_eng}
                                </option>
                            ))}
                        </select>
                        <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="end-city-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.end_city_id?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.end_city_id.message}>
                                {errors.end_city_id.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

                {/* Transport type */}
                <div className="mb-4">
                    <label htmlFor="transport-type" className="mb-2 block text-sm font-medium">
                        Choose transport
                    </label>
                    <div className="relative">
                        <select
                            id="transport-type"
                            {...register('transport_type_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="transport-type-error"
                            >
                            <option key="transport-type" value="" disabled>
                                Select a transport
                            </option>
                            {transport_types.map((type) => (
                                <option 
                                key={type.id} 
                                value={type.id} >
                                    {type.name_eng}
                                </option>
                            ))}
                        </select>
                        <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="transport-type-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.transport_type_id?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.transport_type_id.message}>
                                {errors.transport_type_id.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/dashboard/shipments/${shipment.id}/edit?tab=1`}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                    Cancel
                </Link>
                <Button type="submit">Create Rate</Button>
            </div>
        </form>
    );
}