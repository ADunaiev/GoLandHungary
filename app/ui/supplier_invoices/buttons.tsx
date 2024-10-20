
import { PencilIcon, PlusIcon, PrinterIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice, deleteInvoiceRate, deleteSupplierInvoice } from '@/app/lib/actions';
import { fetchInvoiceByNumber, fetchInvoiceDraft, setInvoiceNumberToShipmentRatesWithoutInvoices } from '@/app/lib/data';


export function CreateSupplierInvoice() {
  return (
    <Link
      href="/dashboard/expenses/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Expense</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateSupplierInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/expenses/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteSupplierInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteSupplierInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
