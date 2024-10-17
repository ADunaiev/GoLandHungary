'use client';

import { CountryField, CountryType, CustomerField, EuVatValidationData } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AtSymbolIcon,
  PhotoIcon,
  UserIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  ListBulletIcon,
  CurrencyEuroIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCustomer } from '@/app/lib/actions';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { CustomerFormSchema, CustomerTypeSchema } from '@/app/lib/schemas/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';
import useSWR, { Fetcher } from 'swr'

export default function FormByVat({ countries, vat_number }:
  { 
    countries: CountryType[],
    vat_number: string,
  }) {

    const [data, setData] = useState<CustomerTypeSchema>();
    const [companyData, setCompanyData] = useState<EuVatValidationData>();

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<CustomerTypeSchema>({
        resolver: zodResolver(CustomerFormSchema)
    });



    const country_id = watch('country_id')
    const eu_vat_number = watch('vat_number_eu')

    useEffect(() => {
      
    })

    const onSubmit = useDebouncedCallback( async (data: CustomerTypeSchema) => {
        try {
            const response = await createCustomer(data);
            if(response.message = '') {
              toast.success('Customer is added!')
            } else {
              toast.error('There is customer with this code already')
            }
            
        } catch(e) {
            console.error(e)
        }
    }, 300);

    return (
      <form onSubmit={(e) => {
        handleSubmit(onSubmit)(e).catch((e) => {
          console.log(e)
        })
      }} >
        <div key='inputs' className="rounded-md bg-gray-50 p-4 md:p-6">
          
          {/* Customer Name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Enter customer name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  step="0.01"
                  {...register('name_eng')}
                  placeholder="Enter customer name"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="name-error"
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

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
          </div>

          {/* Customer Name Hun */}
          <div className="mb-4">
            <label htmlFor="name_hun" className="mb-2 block text-sm font-medium">
              Enter customer name in hungarian
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name_hun"
                  type="text"
                  step="0.01"
                  {...register('name_hun')}
                  placeholder="Enter customer name in hungarian"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="name-hun-error"
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

              </div>
              <div id="name-hun-error" aria-live="polite" aria-atomic="true">
                  { 
                  errors.name_hun?.message && 
                  (
                      <p className="mt-2 text-sm text-red-500" key={errors.name_hun.message}>
                          {errors.name_hun.message}
                      </p>
                      )                      
                  }
              </div>
            </div>
          </div>

          {/* Customer Address */}
          <div className="mb-4">
            <label htmlFor="address" className="mb-2 block text-sm font-medium">
              Enter customer address
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="address"
                  type="text"
                  step="0.01"
                  {...register('address_eng')}
                  placeholder="Enter customer address"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="address-error"
                />
                <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

              </div>
              <div id="address-error" aria-live="polite" aria-atomic="true">
                  { 
                  errors.address_eng?.message && 
                  (
                      <p className="mt-2 text-sm text-red-500" key={errors.address_eng.message}>
                          {errors.address_eng.message}
                      </p>
                      )                      
                  }
              </div>
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
                <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

          {/* Customer Address Hun */}
          <div className="mb-4">
            <label htmlFor="address_hun" className="mb-2 block text-sm font-medium">
              Enter customer address in hungarian
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="address_hun"
                  type="text"
                  step="0.01"
                  {...register('address_hun')}
                  placeholder="Enter customer address in hungarian"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="address-hun-error"
                />
                <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

              </div>
              <div id="address-hun-error" aria-live="polite" aria-atomic="true">
                  { 
                  errors.address_hun?.message && 
                  (
                      <p className="mt-2 text-sm text-red-500" key={errors.address_hun.message}>
                          {errors.address_hun.message}
                      </p>
                      )                      
                  }
              </div>
            </div>
          </div>

          {/* Customer code */}
          <div className="mb-4">
            <label htmlFor="code" className="mb-2 block text-sm font-medium">
              Enter customer code
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="code"
                  type="text"
                  step="0.01"
                  {...register('code')}
                  placeholder="Enter customer code"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="code-error"
                />
                <ListBulletIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

              </div>
              <div id="code-error" aria-live="polite" aria-atomic="true">
                  { 
                  errors.code?.message && 
                  (
                      <p className="mt-2 text-sm text-red-500" key={errors.code.message}>
                          {errors.code.message}
                      </p>
                      )                      
                  }
              </div>
            </div>
          </div>

          {/* Customer vat number eu */}
          <div className="mb-4">
            <label htmlFor="vat_number" className="mb-2 block text-sm font-medium">
              Enter customer European VAT number
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="vat_number"
                  type="text"
                  step="0.01"
                  {...register('vat_number_eu')}
                  placeholder="Enter customer European VAT number"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="vat-number-error"
                />
                <CurrencyEuroIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

              </div>
              <div id="vat-number-error" aria-live="polite" aria-atomic="true">
                  { 
                  errors.vat_number_eu?.message && 
                  (
                      <p className="mt-2 text-sm text-red-500" key={errors.vat_number_eu.message}>
                          {errors.vat_number_eu.message}
                      </p>
                      )                      
                  }
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Enter customer email
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  step="0.01"
                  {...register('email')}
                  placeholder="Enter customer email"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="email-error"
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

              </div>
              <div id="email-error" aria-live="polite" aria-atomic="true">
                  { 
                  errors.email?.message && 
                  (
                      <p className="mt-2 text-sm text-red-500" key={errors.email.message}>
                          {errors.email.message}
                      </p>
                      )                      
                  }
              </div>
            </div>
          </div>

          {/* Avatar 
          <div className="mb-4">
            <label htmlFor="avatar" className="mb-2 block text-sm font-medium">
              Choose customer avatar
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="avatar"
                  type="file"
                  {...register('image')}
                  placeholder="Enter customer avatar"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="avatar-error"
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="avatar-error" aria-live="polite" aria-atomic="true">
                  { 
                  errors.image?.message && 
                  (
                      <p className="mt-2 text-sm text-red-500" key={String(errors.image.message)}>
                          {String(errors.image.message)}
                      </p>
                      )                      
                  }
              </div>
            </div>
          </div> */}

        </div>
        <div key='buttons' className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/customers"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Create Customer</Button>
        </div>
      </form>
    );
}
