import { RouteFullType } from "@/app/lib/definitions";
import Image from "next/image";
import { DeleteRouteFromShipment } from "./buttons";

export default async function ShipmentRoutesTable({ routes, shipment_id } : {
    routes: RouteFullType[],
    shipment_id: string,
}) {

    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {routes?.map((route) => (
                  <div
                    key={route.id + 'i'}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                        <Image
                          src={route.image_url}
                          width={42}
                          height={42}
                          alt='transport_image'
                        />
                        <div>
                            <div className="mb-2 flex items-center">
                            <p>{route.start_city_name + ' - ' + route.end_city_name}</p>
                            </div>
                            <p className="text-sm text-gray-500">{route.transport_type_name}</p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <DeleteRouteFromShipment shipment_id={shipment_id} route_id={route.id} />
                      </div>

                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Start
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      End
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
                  {routes?.map((route) => (
                    <tr
                      key={ route.id }
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={route.image_url}
                            width={42}
                            height={42}
                            alt='transport_image'
                          />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {route.start_city_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {route.end_city_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {route.transport_type_name}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <DeleteRouteFromShipment shipment_id={shipment_id} route_id={route.id} />
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