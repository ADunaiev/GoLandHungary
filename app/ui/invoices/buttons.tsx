import { PencilIcon, PlusIcon, PrinterIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice, deleteInvoiceRate } from '@/app/lib/actions';
import { fetchInvoiceByNumber, fetchInvoiceDraft, setInvoiceNumberToShipmentRatesWithoutInvoices } from '@/app/lib/data';


export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export async function CreateInvoiceFromShipment({shipment_id} : 
  { shipment_id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${shipment_id}/edit/create_invoice`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function UpdateInvoiceFromShipment({ shipment_id, invoice_id }: 
  { shipment_id: string, invoice_id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${shipment_id}/edit/invoices/${invoice_id}/edit_invoice`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function DeleteInvoiceFromShipment({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function PrintInvoice({ id } : { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/print`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PrinterIcon className="w-5" />
    </Link>
  );
}

export function PrintInvoiceFromShipment({ id, invoice_id } : 
  { id: string, invoice_id: string }) {
  return (
    <Link
      href={`/dashboard/shipments/${id}/edit/invoices/${invoice_id}/print_invoice`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PrinterIcon className="w-5" />
    </Link>
  );
}

