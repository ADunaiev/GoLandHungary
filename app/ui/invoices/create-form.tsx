'use client';

import { CustomerField, CurrencyField, CustomerAgreementField, OrganisationField, RateTable, InvoiceTypeFull, CurrencyRateField, CustomerAgreement } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice, State } from '@/app/lib/actions';
import { useState } from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { RawCreateParams, z } from 'zod';
import { InvoiceFormSchema, ShipmentType } from '@/app/lib/schemas/schema';
import { I18nProvider } from '@react-aria/i18n';
import React from 'react';
import InvoiceTable from '../rates/invoice-table';
import { CreateShipment } from '../shipments/buttons';
import { CreateInvoice } from './buttons';

type InvoiceType = z.infer<typeof InvoiceFormSchema>;

export default function Form({ 
  customers,
  currencies,
  agreements,
  organisations,
  rates,
  invoice,
  currencies_rates
}: { 
  customers: CustomerField[],
  currencies: CurrencyField[],
  agreements: CustomerAgreement[],
  organisations: OrganisationField[],
  rates: RateTable[],
  invoice: InvoiceTypeFull,
  currencies_rates: CurrencyRateField[],
}) {
  
  const [data, setData] = useState<InvoiceType>();
  const [invoiceTableData, setInvoiceTableData] = useState<RateTable[]>(rates); 

  function getCurrencyRate(cur_date: Date, org_id: string, cur_id: string) {
     let temp = Number(
      currencies_rates
        .filter(cr => Date.parse(cur_date.toLocaleString()) > Date.parse(cr.date))
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .find(
          cr => 
            cr.currency_id == cur_id && 
            cr.organisation_id == org_id 
        )?.rate);
      
      if(!temp) { temp = 100; }

      return temp;
  }

  function getAmountWoVat(
    rates: RateTable[], 
    inv_date: Date,
    org_id: string,
    inv_currency_id: string
  ) {
    let sum = 0;

    rates.map(rate => {
      sum += (Math.round( rate.rate
        / getCurrencyRate(inv_date, org_id, inv_currency_id)
        * getCurrencyRate(inv_date, org_id, rate.currency_id)
      ) / 100 * rate.quantity);
    })

    return sum;
  }

  function getVatAmount(
    rates: RateTable[], 
    inv_date: Date,
    org_id: string,
    inv_currency_id: string
  ) {
    let sum = 0;

    rates.map(rate => {
      sum += 
        Math.round(
          Math.round( rate.rate
          / getCurrencyRate(inv_date, org_id, inv_currency_id)
          * getCurrencyRate(inv_date, org_id, rate.currency_id)
          ) * rate.quantity
          * rate.vat_rate_rate / 10000
        ) / 100;
      
    })

    return sum;
  }

  function getCorrectDate(date: string) {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const formattedDate = (new Date(date)).getTime() - offset;

    return new Date(formattedDate).toISOString().split('T')[0];
  }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {errors}
  } = useForm<InvoiceType>({
      resolver: zodResolver(InvoiceFormSchema)
  });

  

  const currency_id = watch('currency_id');
  const organisation_id = watch('organisation_id');
  const customer_id = watch('customerId');
  const invoice_date = watch('date') || '2024-09-10';

  /* Don't forget to delete 
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    )
    return () => subscription.unsubscribe()
  }, [watch]);
  till here */

  const onSubmit = async (data: InvoiceType) => {
    try{
      await createInvoice(data)
    } catch (e) {
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
            Invoice number
          </label>
          <div className="relative">
            <input
                  id="number"
                  step="0.01"
                  {...register('number')}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="number-error"
                  defaultValue={invoice.number}
                />
            <ClipboardDocumentCheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

        {/* Performance Date */}
        <div className="mb-4">
          <label htmlFor="performance_date" className="mb-2 block text-sm font-medium">
            Performance date
          </label>
          <div className="relative">
              <I18nProvider locale='en-GB'>
                <input
                  id="performance_date"
                  type="date"
                  placeholder='dd-mm-yyyy'
                  {...register('performance_date')}
                  defaultValue={new Date().toISOString().split('T')[0]}
                  aria-describedby="performance-date-error"
                  className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                />
              </I18nProvider>
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="performance-date-error" aria-live="polite" aria-atomic="true">
            { 
              errors.performance_date?.message && 
              (
                  <p className="mt-2 text-sm text-red-500" key={errors.performance_date.message}>
                    {errors.performance_date.message}
                  </p>
                )                      
              }
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
            Invoice date
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

        {/* Payment Date */}
        <div className="mb-4">
          <label htmlFor="payment_date" className="mb-2 block text-sm font-medium">
            Payment date
          </label>
          <div className="relative">
              <I18nProvider locale='en-GB'>
                <input
                  id="payment_date"
                  type="date"
                  placeholder='dd-mm-yyyy'
                  {...register('payment_date')}
                  defaultValue={new Date().toISOString().split('T')[0]}
                  aria-describedby="payment-date-error"
                  className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                />
              </I18nProvider>
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="payment-date-error" aria-live="polite" aria-atomic="true">
            { 
              errors.payment_date?.message && 
              (
                  <p className="mt-2 text-sm text-red-500" key={errors.payment_date.message}>
                    {errors.payment_date.message}
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
              defaultValue=""
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
              defaultValue=""
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

        {/* Agreement */}
        <div className="mb-4">
          <label htmlFor="agreement" className="mb-2 block text-sm font-medium">
            Choose agreement
          </label>
          <div className="relative">
            <select
              id="agreement"
              {...register('agreement_id')}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="agreement-error"
            >
              <option value="" disabled>
                Select an agreement
              </option>
              {agreements.map((agreement) => {
                if(
                    agreement.organisation_id === organisation_id && 
                    agreement.customer_id === customer_id
                ) {
                    return (
                    <option 
                      key={agreement.id} 
                      value={agreement.id} >
                        {agreement.number + ' - ' + getCorrectDate(agreement.date)}
                    </option>)
                }
              })}
            </select>
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="agreement-error" aria-live="polite" aria-atomic="true">
            { 
              errors.agreement_id?.message && 
              (
                  <p className="mt-2 text-sm text-red-500" key={errors.agreement_id.message}>
                    {errors.agreement_id.message}
                  </p>
                )                      
              }
          </div>
        </div>


        {/* Currency */}
        <div className="mb-4">
          <label htmlFor="currency" className="mb-2 block text-sm font-medium">
            Choose currency
          </label>
          <div className="relative">
            <select
              id="currency"
              {...register('currency_id')}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="currency-error"
            >
              <option value="" disabled>
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

        {/* Currency rate */}
        <div className="mb-4">
          <label htmlFor="currency_rate" className="mb-2 block text-sm font-medium">
            Currency rate
          </label>
          <div className="relative">
            <input 
              id="currency_rate"
              type="number"
              disabled
              value={
                  getCurrencyRate(invoice_date, organisation_id, currency_id) /100 || 1
              }
              step="0.01"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="currency-rate-error"
            />
            <CurrencyEuroIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

      </div>

      <InvoiceTable rates={rates} currencies_rates={currencies_rates} invoice_date={invoice_date} organisation_id={organisation_id} invoice_currency_id={currency_id} invoice_rates={[]}/>

      <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grip-">

        {/* Amount w/o VAT */}
        <div className="mb-4 col-start-2">
          <label htmlFor="amount_wo_vat" className="mb-2 block text-sm font-medium">
            Amount w/o VAT
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount_wo_vat"
                type="text"
                disabled
                value={
                  getAmountWoVat(rates, invoice_date, organisation_id, currency_id)
                    .toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }
                step="0.01"
                placeholder="Enter amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-wo-vat-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>
        </div>

        {/* VAT */}
        <div className="mb-4">
          <label htmlFor="vat" className="mb-2 block text-sm font-medium">
            VAT amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="vat"
                type="text"
                disabled
                value={
                  getVatAmount(rates, invoice_date, organisation_id, currency_id)
                    .toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }
                step="0.01"
                placeholder="Enter amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="vat-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Amount with VAT
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                type="text"
                disabled
                value={
                  (
                  getAmountWoVat(rates, invoice_date, organisation_id, currency_id) +
                  getVatAmount(rates, invoice_date, organisation_id, currency_id)
                  ).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }
                step="0.01"
                placeholder="Enter amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>
        </div>

      </div>

      <div className="rounded-md bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {/* Remarks */}
        <div className="mb-4">
          <label htmlFor="remark" className="mb-2 block text-sm font-medium">
            Remarks
          </label>
          <div className="relative">
            <textarea
                  id="remarks"
                  placeholder=''
                  {...register('remarks')}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="remarks-error"
                />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">

            <div className="flex gap-4">

              <div className="flex items-center">
                <input
                  id="pending"
                  {...register('status')}
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="paid"
                  {...register('status')}
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
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
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}
