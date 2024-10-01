import { RouteFullType, ShipmentRouteUnitTypeFull } from "@/app/lib/definitions";
import Image from "next/image";
import { SelectVehicle } from "./buttons";
import { fetchFilteredUnits, fetchFilteredVehiclesByTransportType, fetchRouteTransportTypeIdByRouteId } from "@/app/lib/data";

export default async function VehiclesTable({ shipment_id, route_id, unit_id,  query, currentPage } : {
    shipment_id: string,
    route_id: string,
    unit_id: string,
    query: string,
    currentPage: number,
}) {
    const route_transport_type_id = await fetchRouteTransportTypeIdByRouteId(route_id)
    const vehicles = await fetchFilteredVehiclesByTransportType(query, currentPage, route_transport_type_id);

    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {vehicles?.map((vehicle) => (
                  <div
                    key={vehicle.id + 'i'}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <div className="mb-2 flex items-center">
                            <p>{vehicle.number}</p>
                            </div>
                            <p className="text-sm text-gray-500">{vehicle.vehicle_type_name}</p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <SelectVehicle shipment_id={shipment_id} route_id={route_id}  unit_id={unit_id} vehicle_id={vehicle.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Number
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Transport 
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {vehicles?.map((vehicle) => (
                    <tr
                      key={ vehicle.id }
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap px-3 py-3">
                        {vehicle.number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {vehicle.vehicle_type_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {vehicle.transport_type_name}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <SelectVehicle shipment_id={shipment_id} route_id={route_id} unit_id={unit_id} vehicle_id={vehicle.id} />
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