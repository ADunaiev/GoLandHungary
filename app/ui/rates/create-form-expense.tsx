'use client'

import { CurrencyField, RouteField, ServiceField, ShipmentField, VatField } from "@/app/lib/definitions"
import { ExpenseRateSchema, ExpenseRateType, InvoiceRateFormSchema } from "@/app/lib/schemas/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createExpenseRate, createInvoiceRate } from "@/app/lib/actions"
import { 
    CurrencyEuroIcon, 
    TruckIcon, 
    CircleStackIcon, 
    ChevronUpDownIcon,
    ReceiptPercentIcon,
    BanknotesIcon,
    ForwardIcon,
    ClipboardDocumentListIcon
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { Button } from '@/app/ui/button'
import { useState } from 'react'
import React from "react"
import { useDebouncedCallback } from "use-debounce"



export default function ExpenseRateForm({
    services,
    currencies,
    vat_rates,
    routes,
    expense_number,
    isCreateExpense,
} : {
    services: ServiceField[],
    currencies: CurrencyField[],
    vat_rates: VatField[],
    routes: RouteField[],
    expense_number: string,
    isCreateExpense: boolean,
}) {
    const createExpenseRateFromCreateExpense = createExpenseRate.bind(null, isCreateExpense)

    const [data, setData] = useState<ExpenseRateType>();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<ExpenseRateType>({
        resolver: zodResolver(ExpenseRateSchema)
    });

    function getNetAmount(rate_without_vat: number, quantity: number) {
        return  Math.trunc(rate_without_vat * quantity * 100) / 100      
    }

    function getVatPercent(vat: string) {
        return Number(vat_rates.find(rate => rate.id === vat)?.rate) / 100
    }

    function isCurrencyHUF(currency_id: string) {
        const currency = currencies.find(currency => currency.id === currency_id)

        if(currency?.short_name === 'HUF') {
            return true
        } else {
            return false
        }
    }

    function getVatAmount(
        rate_without_vat: number,
        quantity: number,
        vat_id: string,
        currency_id: string
    ) {
        const netAmount = getNetAmount(rate_without_vat, quantity)
        const vatPercent = getVatPercent(vat_id)

        if(isCurrencyHUF(currency_id)) {
            return Math.round(netAmount * vatPercent / 100) 
        } else {
            return Math.round(netAmount * vatPercent) / 100
        }

        
    }

    function showCorrectAmount(amount: number, currency_id: string) {
        if(isCurrencyHUF(currency_id)) {
            return amount.toLocaleString('en-GB', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            })
        } else {
            return amount.toLocaleString('en-GB', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        }
    }

    const onSubmit = useDebouncedCallback( async (data:ExpenseRateType) => {
        try {
            await createExpenseRateFromCreateExpense(data);
        } catch(e) {
            console.log(e);
        }
    }, 300);

    const rate_without_vat = watch('rate');
    const quantity = watch('quantity');
    const vat_rate_id = watch('vat_rate_id', '0');
    const currency_id = watch('currency_id')

    return (
        <form onSubmit={(e) => {
            handleSubmit(onSubmit)(e).catch((e) => {
                console.log(e);
            })
        }}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* Service */}
                <div className="mb-4">
                    <label htmlFor="service" className="mb-2 block text-sm font-medium">
                        Choose service
                    </label>
                    <div className="relative">
                        <select
                            id="service"
                            {...register('service_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="service-error"
                            >
                            <option key="service" value="" disabled>
                                Select a service
                            </option>
                            {services.map((service) => (
                                <option 
                                key={service.id} 
                                value={service.id} >
                                    {service.name_eng}
                                </option>
                            ))}
                        </select>
                        <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="service-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.service_id?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.service_id.message}>
                                {errors.service_id.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

                {/* Route */}
                <div className="mb-4">
                    <label htmlFor="route" className="mb-2 block text-sm font-medium">
                        Choose route
                    </label>
                    <div className="relative">
                        <select
                            id="route"
                            {...register('route_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            >
                            <option key="route" value="" disabled>
                                Select a route
                            </option>
                            {routes.map((route) => (
                                <option 
                                key={route.id} 
                                value={route.id} >
                                    {route.start_end}
                                </option>
                            ))}
                        </select>
                        <ForwardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

            </div>

            <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* Rate w/o VAT */}
                <div className="mb-4">
                    <label htmlFor="rate_wo_vat" className="mb-2 block text-sm font-medium">
                        Rate without VAT
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                        <input
                            id="rate_wo_vat"
                            type="number"
                            key="rate_wo_vat"
                            defaultValue={0}
                            {
                            ...register('rate')
                            }
                            step="0.01"
                            placeholder="Enter amount"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="amount-wo-vat-error"
                        />
                        <CircleStackIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

                        </div>
                        <div id="rate-error" aria-live="polite" aria-atomic="true">
                        {
                            errors.rate?.message &&
                            (
                            <p className="mt-2 text-sm text-red-500" key={errors.rate.message}>
                                {errors.rate.message}
                            </p>
                            )
                        }
                        </div>
                    </div>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                    <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
                        Quantity
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                        <input
                            id="quantity"
                            type="number"
                            key="quantity"
                            {
                            ...register('quantity')
                            }
                            step="1"
                            defaultValue={1}
                            placeholder="Enter quantity"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="quantity-error"
                        />
                        <ChevronUpDownIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

                        </div>
                        <div id="quantity-error" aria-live="polite" aria-atomic="true">
                        {
                            errors.quantity?.message &&
                            (
                            <p className="mt-2 text-sm text-red-500" key={errors.quantity.message}>
                                {errors.quantity.message}
                            </p>
                            )
                        }
                        </div>
                    </div>
                </div>

                {/* Net amount */}
                <div className="mb-4">
                    <label htmlFor="net_amount" className="mb-2 block text-sm font-medium">
                        Net amount
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input 
                                id="net_amount" 
                                key="net_amount"  
                                disabled     
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                value={
                                    showCorrectAmount(
                                        getNetAmount(rate_without_vat, quantity),
                                        currency_id
                                    )
                                }  
                            />
                            <CircleStackIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Rate Currency */}
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Rate currency
                    </label>
                    <div className="relative">
                        <select
                            id="currency"
                            {...register('currency_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="currency-error"
                            >
                            <option key="currency" value="" disabled>
                                Select a currency
                            </option>
                            {currencies.map((currency) => (
                                <option 
                                key={currency.id} 
                                value={currency.id} >
                                    {currency.short_name}
                                </option>
                            ))}
                        </select>
                        <CurrencyEuroIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="currency-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.currency_id?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.currency_id.message}>
                                {errors.currency_id.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

            </div>

            <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* Vat rate */}
                <div className="mb-4">
                    <label htmlFor="vat" className="mb-2 block text-sm font-medium">
                        Choose vat 
                    </label>
                    <div className="relative">
                        <select
                            id="vat"
                            {...register('vat_rate_id')}
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="vat-error"
                            >
                            <option key="vat" value="" disabled>
                                Select a vat
                            </option>
                            {vat_rates.map((vat_rate) => (
                                <option 
                                key={vat_rate.id} 
                                value={vat_rate.id} >
                                    {vat_rate.name_eng}
                                </option>
                            ))}
                        </select>
                        <ReceiptPercentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="vat-error" aria-live="polite" aria-atomic="true">
                        { 
                        errors.vat_rate_id?.message && 
                        (
                            <p className="mt-2 text-sm text-red-500" key={errors.vat_rate_id.message}>
                                {errors.vat_rate_id.message}
                            </p>
                            )                      
                        }
                    </div>
                </div>

                {/* Vat percent */}
                <div className="mb-4">
                    <label htmlFor="vat_rate" className="mb-2 block text-sm font-medium">
                        Vat rate, %
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input 
                                id="vat_rate" 
                                disabled
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                value=
                                {  
                                    String(getVatPercent(vat_rate_id))
                                }                  
                            />
                            <CircleStackIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Vat amount */}
                <div className="mb-4">
                    <label htmlFor="vat_amount" className="mb-2 block text-sm font-medium">
                        Vat amount
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input 
                                id="vat_amount"
                                disabled
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                value={
                                    showCorrectAmount(
                                        getVatAmount(rate_without_vat, quantity, vat_rate_id, currency_id),
                                        currency_id
                                    )
                                }                  
                            />
                            <CircleStackIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Gross amount */}
                <div className="mb-4">
                    <label htmlFor="gross_amount" className="mb-2 block text-sm font-medium">
                        Gross amount
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input 
                                id="gross_amount"
                                disabled 
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                value=
                                {
                                    showCorrectAmount(
                                        (getNetAmount(rate_without_vat, quantity) + 
                                        getVatAmount(rate_without_vat, quantity, vat_rate_id, currency_id)),
                                        currency_id
                                    )
                                }                  
                            />
                            <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/expenses/create"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                    Cancel
                </Link>
                <Button type="submit">Create Rate</Button>
            </div>
        </form>
    );
}