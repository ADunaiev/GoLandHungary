'use client'

import { ArrowPathIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteExpenseRate, deleteInvoiceRate, deleteInvoiceRateEditInvoice, deleteRateFromShipment, removeRateFromShipmentEditInvoice, removeRateFromShipmentInvoice, restoreRatesInShipmentInvoice } from '@/app/lib/actions';
import { toast } from 'sonner';


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

export function CreateExpenseRate() {
  return (
    <Link
      href={`/dashboard/expenses/create/create_rate`}
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

export function CreateRateFromShipment({ id }:{
  id: string }) {
    return (
      <Link
        href={`/dashboard/shipments/${id}/edit/create_rate`}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">Create Rate</span>{' '}
        <PlusIcon className="h-5 md:m1-4" />
      </Link>
    );
}

export function CreateRateFromShipmentWithRoute({ shipment_id, route_id }:{
  shipment_id: string,
  route_id: string,
}) {
    return (
      <Link
        href={`/dashboard/shipments/${shipment_id}/edit/${route_id}/create_rate`}
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

export function UpdateExpenseRate({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/expenses/create/${id}/edit_rate`}
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

export function UpdateRateFromShipment({ shipment_id, rate_id }: 
  { shipment_id: string, rate_id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${shipment_id}/edit/rates/${rate_id}/edit`}
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

export function DeleteExpenseRate ({ id }: { id: string }) {
  const deleteRateWithId = deleteExpenseRate.bind(null, id);

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

export function RemoveRateFromShipmentInvoice({ shipment_id, rate_id } :
  { shipment_id: string, rate_id: string }) {

    const removeRateFromShipmentInvoiceWithId = removeRateFromShipmentInvoice.bind(null, shipment_id, rate_id);

    return (
      <form action={removeRateFromShipmentInvoiceWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    );

}

export function RemoveRateFromShipmentEditInvoice({ shipment_id, invoice_id, rate_id } :
  { shipment_id: string, invoice_id: string, rate_id: string }) {

    const removeRateFromShipmentEditInvoiceWithId = removeRateFromShipmentEditInvoice.bind(null, shipment_id, invoice_id, rate_id);

    return (
      <form action={removeRateFromShipmentEditInvoiceWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    );

}

export function RestoreRatesInShipmentInvoice({ shipment_id } :
  { shipment_id: string }) {

    const restoreRatesInShipmentInvoiceWithId = restoreRatesInShipmentInvoice.bind(null, shipment_id);

    return (
      <form action={restoreRatesInShipmentInvoiceWithId}>
        <button className="rounded-md border p-2 justify-end hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <ArrowPathIcon className="w-5" />
        </button>
      </form>
    );

}

export function DeleteRateFromShipment ({ shipment_id, rate_id }: 
  { shipment_id: string, rate_id: string }
) {
  const deleteRateFromShipmentWithId = deleteRateFromShipment.bind(null, shipment_id, rate_id);

  const handleSubmit = async () => {     
      try {
        const response = await deleteRateFromShipmentWithId();
        toast(response.message)
      } catch(e) {
        console.log(e);
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