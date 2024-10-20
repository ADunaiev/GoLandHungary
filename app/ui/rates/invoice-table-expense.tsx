'use client'

import { CurrencyRateField, ExpenseRateTable, InvoiceRateDbData, RateTable } from "@/app/lib/definitions";
import { formatAmount, formatAmountCurrency } from "@/app/lib/utils";
import { UpdateRate, DeleteRate, UpdateExpenseRate, DeleteExpenseRate } from '@/app/ui/rates/buttons'

export default function RateTableExpense({ 
  rates,  
} : { 
  rates: ExpenseRateTable[],
}) {
    function getCorrectAmount(amount: number, currency_short_name: string) {
      if(currency_short_name === 'HUF') {
        return amount.toLocaleString('en-GB', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      } else {
        return amount.toLocaleString('en-GB', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      }
    }

    function getTotalNetAmount() {
      let sum = 0;

      rates.map(rate => sum += rate.net_amount)

      return sum /100
    }

    function getTotalVatAmount() {
      let sum = 0;

      rates.map(rate => sum += rate.vat_amount)

      return sum /100
    }

    function getTotalGrossAmount() {
      let sum = 0;

      rates.map(rate => sum += rate.gross_amount)

      return sum /100
    }

    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {rates?.map((rate) => (
                  <div
                    key={rate.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <p>{rate.service_name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{rate.start_point_name + " - " + rate.end_point_name}</p>
                      </div>
                      <p className="text-xl font-medium">
                        { 
                          getCorrectAmount(rate.gross_amount / 100, rate.currency_name)     
                        }
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-lg font-medium">
                          {
                            getCorrectAmount(rate.rate / 100, rate.currency_name)
                            + ' * ' + rate.quantity + ' = ' 
                            + getCorrectAmount(rate.net_amount / 100, rate.currency_name)
                          }
                        </p>
                        <p>
                          {
                            'Vat: ' + rate.vat_rate_name + ', amount: ' + 
                            getCorrectAmount(rate.vat_amount / 100, rate.currency_name)
                          }
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <UpdateExpenseRate id={rate.id} />
                        <DeleteExpenseRate id={rate.id} />
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
                      Net unit
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Quantity
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Net line
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      VAT type
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      VAT value
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Gross value
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {rates?.map((rate) => (
                    <tr
                      key={rate.id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <p>{rate.service_name}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {
                            rate.start_point_name === null ?
                            '' :
                            rate.start_point_name + " - " + rate.end_point_name
                          }</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        { 
                          getCorrectAmount(rate.rate / 100, rate.currency_name)
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {rate.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        { 
                          getCorrectAmount(rate.net_amount / 100, rate.currency_name)
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {rate.vat_rate_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {
                          getCorrectAmount(rate.vat_amount / 100, rate.currency_name)
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {
                          getCorrectAmount(rate.gross_amount / 100, rate.currency_name)
                        }
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateExpenseRate id={rate.id} />
                          <DeleteExpenseRate id={rate.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="rounded-lg text-left text-sm font-normal">
                <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Total
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      {
                        typeof(rates[0]) === 'undefined' ?
                        '' :
                        getCorrectAmount(getTotalNetAmount(), rates[0].currency_name) + ' ' + rates[0].currency_name
                      }
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      {
                        typeof(rates[0]) === 'undefined' ?
                        '' :
                        getCorrectAmount(getTotalVatAmount(), rates[0].currency_name) + ' ' + rates[0].currency_name
                      }
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      {
                        typeof(rates[0]) === 'undefined' ?
                        '' :
                        getCorrectAmount(getTotalGrossAmount(), rates[0].currency_name) + ' ' + rates[0].currency_name
                      }
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      );
}