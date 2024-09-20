import { RateTable } from "@/app/lib/definitions";
import { formatAmount, formatAmountCurrency } from "@/app/lib/utils";
import { UpdateRate, DeleteRate, UpdateRateEditInvoice, DeleteRateEditInvoice } from '@/app/ui/rates/buttons'

export default async function EditRatesTable({ rates, invoice_id } : { 
  rates: RateTable[],
  invoice_id: string,
}) {
    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {rates?.map((rate) => (
                  <div
                    key={rate.id + 'i'}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <p>{rate.service_name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{rate.start_point_name + " - " + rate.end_point_name}</p>
                      </div>
                      <p>{rate.currency_name}</p>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-xl font-medium">
                          {(rate.rate / 100).toLocaleString('en-GB', {
                            maximumFractionDigits:2,
                            minimumFractionDigits: 2
                          }) + ' * ' + rate.quantity + ' = ' + (rate.rate * rate.quantity / 100)
                            .toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p>{'Vat: ' + rate.vat_rate_name}</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <UpdateRateEditInvoice id={invoice_id} rateId={rate.id} />
                        <DeleteRateEditInvoice id={invoice_id} rateId={rate.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Service
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Route
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Rate
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Quantity
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      VAT type
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {rates?.map((rate) => (
                    <tr
                      key={rate.id + 'i'}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <p>{rate.service_name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {rate.start_point_name + "-" + rate.end_point_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {(rate.rate / 100).toLocaleString('en-GB', {minimumFractionDigits:2, maximumFractionDigits: 2}) + ' ' + rate.currency_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {rate.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {rate.vat_rate_name}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateRateEditInvoice id={invoice_id} rateId={rate.id}/>
                          <DeleteRateEditInvoice id={invoice_id} rateId={rate.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
}