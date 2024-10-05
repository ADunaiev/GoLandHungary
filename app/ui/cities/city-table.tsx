import { RouteFullType, ShipmentRouteUnitTypeFull } from "@/app/lib/definitions";
import Image from "next/image";
import { fetchFilteredCities, fetchFilteredUnits, fetchFilteredVehiclesByTransportType, fetchRouteTransportTypeIdByRouteId } from "@/app/lib/data";
import { ViewCities } from "./buttons";

export default async function CitiesTable({ shipment_id, query, currentPage } : {
    shipment_id: string,
    query: string,
    currentPage: number,
}) {
    const cities = await fetchFilteredCities(query, currentPage);

    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {cities?.map((city) => (
                  <div
                    key={city.id + 'i'}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <div className="mb-2 flex items-center">
                            <p>{city.name_eng}</p>
                            </div>
                            <p className="text-sm text-gray-500">{city.country_name_eng}</p>
                        </div>
                        <div className="flex justify-end gap-2">
                            {/* <ViewCities shipment_id={shipment_id} /> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-3 py-5 font-medium">
                      City
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Country
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {cities?.map((city) => (
                    <tr
                      key={ city.id }
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap px-3 py-3">
                        {city.name_eng}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {city.country_name_eng}
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