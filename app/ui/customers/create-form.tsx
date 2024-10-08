'use client';

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AtSymbolIcon,
  PhotoIcon,
  UserIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCustomer } from '@/app/lib/actions';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { CustomerFormSchema, CustomerTypeSchema } from '@/app/lib/schemas/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

export default function Form() {

  const [data, setData] = useState<CustomerTypeSchema>();
  const {
      register,
      handleSubmit,
      watch,
      formState: {errors}
  } = useForm<CustomerTypeSchema>({
      resolver: zodResolver(CustomerFormSchema)
  });

  const onSubmit = useDebouncedCallback( async (data:CustomerTypeSchema) => {
      try {
          await createCustomer(data);
          toast.success('Customer is added!')
      } catch(e) {
          toast.warning('Customer already exists!')
      }
  }, 300);

  return (
    <form onSubmit={(e) => {
      handleSubmit(onSubmit)(e).catch((e) => {
        console.log(e)
      })
    }} >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
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

      </div>
      <div className="mt-6 flex justify-end gap-4">
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
