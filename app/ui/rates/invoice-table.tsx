
import { CurrencyRateField, InvoiceRateDbData, RateTable } from "@/app/lib/definitions";
import { formatAmount, formatAmountCurrency } from "@/app/lib/utils";
import { UpdateRate, DeleteRate } from '@/app/ui/rates/buttons'

export default function InvoiceTable({ 
  rates, 
  currencies_rates, 
  invoice_date, 
  organisation_id, 
  invoice_currency_id,
  invoice_rates,
} : { 
  rates: RateTable[],
  currencies_rates: CurrencyRateField[],
  invoice_date: Date,
  organisation_id: string,
  invoice_currency_id: string,
  invoice_rates: InvoiceRateDbData[],
}) {
    function getCurrencyRate(cur_date: Date, org_id: string, cur_id: string) {
        let temp = Number(
        currencies_rates
          .filter(cr => Date.parse(cur_date.toLocaleString()) > Date.parse(cr.date))
          .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
          .find(
            cr => 
              cr.currency_id == cur_id && 
              cr.organisation_id == org_id 
          )?.rate);
        
        if(!temp) { temp = 100; }

        return temp;
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
                      <p className="text-xl font-medium">{ 
                          (
                            (Math.round(rate.rate * getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / getCurrencyRate(invoice_date, organisation_id, invoice_currency_id)) * rate.quantity / 100) + 
                            (Math.round((Math.round(rate.rate * getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / getCurrencyRate(invoice_date, organisation_id, invoice_currency_id)) * rate.quantity) / 100 *
                            rate.vat_rate_rate) / 10000)
                          ).toLocaleString('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                          }
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-lg font-medium">
                          {
                            (rate.rate * getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / getCurrencyRate(invoice_date, organisation_id, invoice_currency_id) / 100)
                            .toLocaleString('en-GB', {minimumFractionDigits:2, maximumFractionDigits: 2}) 
                            + ' * ' + rate.quantity + ' = ' 
                            + (Math.round(rate.rate * getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / getCurrencyRate(invoice_date, organisation_id, invoice_currency_id)) * rate.quantity / 100)
                            .toLocaleString('en-GB', {minimumFractionDigits:2, maximumFractionDigits: 2})
                          }
                        </p>
                        <p>{
                            'Vat: ' + rate.vat_rate_name + ', amount: ' + 
                            (Math.round((Math.round(rate.rate * getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / getCurrencyRate(invoice_date, organisation_id, invoice_currency_id)) * rate.quantity) / 100 *
                            rate.vat_rate_rate) / 10000).toLocaleString('en-GB', { minimumFractionDigits:2, maximumFractionDigits:2 })
                            }
                        </p>
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
                      Cur rate
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
                        <p className="text-xs text-gray-500">{rate.start_point_name + " - " + rate.end_point_name}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {
                          /* rate.start_point_name + "-" + rate.end_point_name */
                          typeof(invoice_date) !== 'string' && invoice_rates != null ?
                          Number(invoice_rates.find(r => r.rate_id === rate.id)?.currency_rate) /100:
                          getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / 100
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        { 
                          (
                            typeof(invoice_date) !== 'string' && invoice_rates != null ?
                            Number(invoice_rates.find(r => r.rate_id === rate.id)?.net_unit) / 100 :
                            rate.rate * getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / getCurrencyRate(invoice_date, organisation_id, invoice_currency_id) / 100
                          ).toLocaleString('en-GB', {minimumFractionDigits:2, maximumFractionDigits: 2})
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {rate.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        { 
                          (
                            typeof(invoice_date) !== 'string' && invoice_rates != null ?
                            Number(invoice_rates.find(r => r.rate_id === rate.id)?.net_line) / 100 :
                            Math.round(rate.rate * getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / getCurrencyRate(invoice_date, organisation_id, invoice_currency_id)) * rate.quantity / 100
                          )
                            .toLocaleString('en-GB', {minimumFractionDigits:2, maximumFractionDigits: 2})
                          }
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {rate.vat_rate_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {
                          (
                            typeof(invoice_date) !== 'string' && invoice_rates != null ?
                            Number(invoice_rates.find(r => r.rate_id === rate.id)?.vat_value) / 100 :
                            Math.round((Math.round(rate.rate * getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / getCurrencyRate(invoice_date, organisation_id, invoice_currency_id)) * rate.quantity) / 100 *
                          rate.vat_rate_rate) / 10000
                        ).toLocaleString('en-GB', { minimumFractionDigits:2, maximumFractionDigits:2 })
                        }
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {
                          (
                            typeof(invoice_date) !== 'string' && invoice_rates != null ?
                            Number(invoice_rates.find(r => r.rate_id === rate.id)?.gross_value) / 100 :
                            (Math.round(rate.rate * getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / getCurrencyRate(invoice_date, organisation_id, invoice_currency_id)) * rate.quantity / 100) + 
                            (Math.round((Math.round(rate.rate * getCurrencyRate(invoice_date, organisation_id, rate.currency_id) / getCurrencyRate(invoice_date, organisation_id, invoice_currency_id)) * rate.quantity) / 100 *
                            rate.vat_rate_rate) / 10000)
                          ).toLocaleString('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                        }
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