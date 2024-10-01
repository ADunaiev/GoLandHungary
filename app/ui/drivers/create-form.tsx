'use client'

import { CityField, ShipmentField, TransportTypeField, UnitTypeField, VehicleTypeField } from "@/app/lib/definitions"
import { DriverFormSchema, DriverTypeSchema, RouteFormSchema, RouteTypeSchema, UnitFormSchema, UnitTypeSchema, VehicleFormSchema, VehicleTypeSchema } from "@/app/lib/schemas/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createDriver, createRouteFromShipment, createUnit, createVehicle } from "@/app/lib/actions"
import { 
    TruckIcon, 
    BuildingOfficeIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { Button } from '@/app/ui/button'
import { useState } from 'react'
import React from "react"

export default function CreateDriverForm({
    shipment_id,
    route_id,
    unit_id,
} : {
    shipment_id: string,
    route_id: string,
    unit_id: string,
}) {

    const createDriverFromShipment = createDriver.bind(null, shipment_id, route_id, unit_id);

    const [data, setData] = useState<DriverTypeSchema>();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<DriverTypeSchema>({
        resolver: zodResolver(DriverFormSchema)
    });

    const onSubmit = async (data:DriverTypeSchema) => {
        try {
            await createDriverFromShipment(data);
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
            <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* Name */}
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
                
                {/* Phone */}
                <div className="mb-4">
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                        Enter phone
                    </label>
                    <div className="relative">
                        <input
                            id="phone"
                            type="text"
                            {...register('phone')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="phone-error"          
                        />
                        <ChevronRightIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="phone-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.phone?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.phone.message}>
                                {errors.phone.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_vehicle`}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                    Cancel
                </Link>
                <Button type="submit">Create Vehicle</Button>
            </div>
        </form>
    );
}