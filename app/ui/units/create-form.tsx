'use client'

import { CityField, ShipmentField, TransportTypeField, UnitTypeField } from "@/app/lib/definitions"
import { RouteFormSchema, RouteTypeSchema, UnitFormSchema, UnitTypeSchema } from "@/app/lib/schemas/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createRouteFromShipment, createUnit } from "@/app/lib/actions"
import { 
    TruckIcon, 
    BuildingOfficeIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { Button } from '@/app/ui/button'
import { useState } from 'react'
import React from "react"

export default function CreateUnitForm({
    unit_types,
    shipment_id,
    route_id,
} : {
    unit_types: UnitTypeField[],
    shipment_id: string,
    route_id: string,
}) {

    const createUnitFromShipment = createUnit.bind(null, shipment_id, route_id);

    const [data, setData] = useState<UnitTypeSchema>();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<UnitTypeSchema>({
        resolver: zodResolver(UnitFormSchema)
    });

    const onSubmit = async (data:UnitTypeSchema) => {
        try {
            await createUnitFromShipment(data);
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

                {/* Unit number */}
                <div className="mb-4">
                    <label htmlFor="number" className="mb-2 block text-sm font-medium">
                        Enter number
                    </label>
                    <div className="relative">
                        <input
                            id="number"
                            type="text"
                            {...register('number')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="number-error"          
                        />
                        <ChevronRightIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

                {/* Unit type */}
                <div className="mb-4">
                    <label htmlFor="unit-type" className="mb-2 block text-sm font-medium">
                        Choose unit type
                    </label>
                    <div className="relative">
                        <select
                            id="unit_type"
                            {...register('unit_type_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="unit-type-error"
                            >
                            <option key="start-city" value="" disabled>
                                Select a type
                            </option>
                            {unit_types.map((type) => (
                                <option 
                                key={type.id} 
                                value={type.id} >
                                    {type.name_eng}
                                </option>
                            ))}
                        </select>
                        <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="unit-type-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.unit_type_id?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.unit_type_id.message}>
                                {errors.unit_type_id.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/dashboard/shipments/${shipment_id}/edit/${route_id}/add_unit`}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                    Cancel
                </Link>
                <Button type="submit">Create Unit</Button>
            </div>
        </form>
    );
}