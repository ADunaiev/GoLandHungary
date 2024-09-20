import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice, deleteInvoiceRate, deleteInvoiceRateEditInvoice } from '@/app/lib/actions';


export function CreateRate({invoice_number}: 
  {invoice_number: string}) {
  return (
    <Link
      href={`/dashboard/invoices/create/${invoice_number}/create_rate`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Rate</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  )
}

export function CreateRateEditInvoice({ id }:{
  id: string }) {
    return (
      <Link
        href={`/dashboard/invoices/${id}/edit/create_rate`}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">Create Rate</span>{' '}
        <PlusIcon className="h-5 md:m1-4" />
      </Link>
    );
}

export function UpdateRate({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/create/${id}/edit_rate`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function UpdateRateEditInvoice({ id, rateId }:{ id: string, rateId: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit/${rateId}/edit_rate`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteRate ({ id }: { id: string }) {
  const deleteRateWithId = deleteInvoiceRate.bind(null, id);

  return (
    <form action={deleteRateWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function DeleteRateEditInvoice ({ id, rateId }: { id: string, rateId: string }) {
  const deleteRateWithId = deleteInvoiceRateEditInvoice.bind(null, id, rateId);

  return (
    <form action={deleteRateWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}