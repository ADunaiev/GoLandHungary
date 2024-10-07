import { RouteFullType, ShipmentRouteUnitTypeFull } from "@/app/lib/definitions";
import Image from "next/image";
import { fetchFilteredCities, fetchFilteredCurrencyRates, fetchFilteredUnits, fetchFilteredVehiclesByTransportType, fetchRouteTransportTypeIdByRouteId } from "@/app/lib/data";

export default async function CurrenciesTable({ query, currentPage } : {
    query: string,
    currentPage: number,
}) {
    const rates = await fetchFilteredCurrencyRates(query, currentPage);

    function getCorrectDate(date: string) {
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        const formattedDate = (new Date(date)).getTime() - offset;
    
        return new Date(formattedDate).toISOString().split('T')[0];
    }

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
                            <p>{rate.short_name}</p>
                            </div>
                            <p className="text-sm text-gray-500">{getCorrectDate(rate.date)}</p>
                        </div>
                        <div className="flex justify-end gap-2">
                            {rate.rate / 100}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Currency
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Rate
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Organisation
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {rates?.map((rate) => (
                    <tr
                      key={ rate.id }
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap px-3 py-3">
                        {getCorrectDate(rate.date)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {rate.short_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {Number(rate.rate / 100).toLocaleString('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {rate.organisation_name}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          {/*<SelectCityFromShipment shipment_id={shipment_id} /> */}
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