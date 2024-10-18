'use client';

import { CountryField, CountryType, CustomerField, EuVatValidationData, SupplierFull } from '@/app/lib/definitions';
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
import { createCustomer, updateSupplier } from '@/app/lib/actions';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { CustomerFormSchema, CustomerTypeSchema, SupplierFormSchema, SupplierTypeSchema } from '@/app/lib/schemas/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';
import useSWR, { Fetcher } from 'swr'
import { CreateSupplier } from './buttons';
import { createSupplier } from '@/app/lib/actions';

export default function SupplierEditForm({ countries, supplier }:
  { countries: CountryType[],
    supplier: SupplierFull,
   }) {

    const updateSupplierWithId = updateSupplier.bind(null, supplier.id)

    const [data, setData] = useState<SupplierTypeSchema>();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<SupplierTypeSchema>({
        resolver: zodResolver(SupplierFormSchema)
    });

    const country_id = watch('country_id')

    const onSubmit = useDebouncedCallback( async (data: SupplierTypeSchema) => {
        try {
            const response = await updateSupplierWithId(data);
            if(response.message = '') {
              toast.success('Supplier is updated!')
            } else {
              toast.error('There is supplier with this code already')
            }
            
        } catch(e) {
            console.log(String(e))
        }
    }, 300);

    return (
      <form onSubmit={(e) => {
        handleSubmit(onSubmit)(e).catch((e) => {
          console.log(e)
        })
      }} >
        <div key='inputs' className="rounded-md bg-gray-50 p-4 md:p-6">
          
          {/* Supplier Name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Enter supplier name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  step="0.01"
                  {...register('name_eng')}
                  defaultValue={supplier.name_eng}
                  placeholder="Enter supplier name"
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

          {/* Supplier Name Hun */}
          <div className="mb-4">
            <label htmlFor="name_hun" className="mb-2 block text-sm font-medium">
              Enter supplier name in hungarian
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name_hun"
                  type="text"
                  step="0.01"
                  {...register('name_hun')}
                  defaultValue={supplier.name_hun}
                  placeholder="Enter supplier name in hungarian"
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

          {/* Supplier Address */}
          <div className="mb-4">
            <label htmlFor="address" className="mb-2 block text-sm font-medium">
              Enter supplier address
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="address"
                  type="text"
                  step="0.01"
                  {...register('address_eng')}
                  defaultValue={supplier.address_eng}
                  placeholder="Enter supplier address"
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
                    defaultValue={supplier.country_id}
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

          {/* Supplier Address Hun */}
          <div className="mb-4">
            <label htmlFor="address_hun" className="mb-2 block text-sm font-medium">
              Enter supplier address in hungarian
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="address_hun"
                  type="text"
                  step="0.01"
                  {...register('address_hun')}
                  defaultValue={supplier.address_hun}
                  placeholder="Enter supplier address in hungarian"
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

          {/* Supplier code */}
          <div className="mb-4">
            <label htmlFor="code" className="mb-2 block text-sm font-medium">
              Enter supplier code
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="code"
                  type="text"
                  {...register('code')}
                  defaultValue={supplier.code}
                  placeholder="Enter supplier code"
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

          {/* Supplier vat number eu */}
          <div className="flex mb-4">
            <div>
              <label htmlFor="vat_number" className="mb-2 block text-sm font-medium">
                Enter supplier European VAT number
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="vat_number"
                    type="text"
                    {...register('eu_vat_number')}
                    defaultValue={supplier.eu_vat_number}
                    placeholder="Enter supplier European VAT number"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="vat-number-error"
                  />
                  <CurrencyEuroIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

                </div>
                <div id="vat-number-error" aria-live="polite" aria-atomic="true">
                    { 
                    errors.eu_vat_number?.message && 
                    (
                        <p className="mt-2 text-sm text-red-500" key={errors.eu_vat_number.message}>
                            {errors.eu_vat_number.message}
                        </p>
                        )                      
                    }
                </div>
              </div>
            </div>
        
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Enter supplier email
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  step="0.01"
                  {...register('email')}
                  defaultValue={supplier.email}
                  placeholder="Enter supplier email"
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

        </div>
        <div key='buttons' className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/suppliers"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Update Supplier</Button>
        </div>
      </form>
    );
}
