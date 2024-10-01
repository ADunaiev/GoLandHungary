import { RouteFullType, ShipmentRouteUnitTypeFull } from "@/app/lib/definitions";
import Image from "next/image";
import { SelectDriver } from "./buttons";
import { fetchFilteredDrivers, fetchFilteredUnits, fetchFilteredVehiclesByTransportType, fetchRouteTransportTypeIdByRouteId } from "@/app/lib/data";
import { SelectVehicle } from "../vehicles/buttons";

export default async function DriversTable({ shipment_id, route_id, unit_id,  query, currentPage } : {
    shipment_id: string,
    route_id: string,
    unit_id: string,
    query: string,
    currentPage: number,
}) {
    const drivers = await fetchFilteredDrivers(query, currentPage);

    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {drivers?.map((driver) => (
                  <div
                    key={driver.id + 'i'}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <div className="mb-2 flex items-center">
                            <p>{driver.name_eng}</p>
                            </div>
                            <p className="text-sm text-gray-500">{driver.phone}</p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <SelectDriver shipment_id={shipment_id} route_id={route_id}  unit_id={unit_id} driver_id={driver.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Phone
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {drivers?.map((driver) => (
                    <tr
                      key={ driver.id }
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap px-3 py-3">
                        {driver.name_eng}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {driver.phone}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <SelectDriver shipment_id={shipment_id} route_id={route_id} unit_id={unit_id} driver_id={driver.id} />
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