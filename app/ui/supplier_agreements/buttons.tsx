'use client'

import { ClipboardDocumentIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCustomer, deleteCustomerAgreement, deleteInvoice, deleteSupplerAgreement } from '@/app/lib/actions';
import { toast } from 'sonner';

export function CreateSupplierAgreement() {
  return (
    <Link
      href="/dashboard/suppliers/agreements/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Agreement</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateSupplierAgreement({ id } : { id: string }) {
  return (
    <Link
      href={`/dashboard/suppliers/agreements/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteSupplierAgreement({ id }: { id: string }) {
  const deleteSupplierAgreementWithId = deleteSupplerAgreement.bind(null, id);

  const handleSubmit = async () => {
    try {
      const response = await deleteSupplierAgreementWithId();
      toast(response.message);
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <form action={handleSubmit}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function ViewSupplierAgreements() {
  return (
    <Link
      href={`/dashboard/suppliers/agreements`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Agreements</span>
      <ClipboardDocumentIcon className="h-5 md:ml-4" />
    </Link>
  );
}