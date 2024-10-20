import { RateTable, RouteFullType, ShipmentRouteUnitTypeFull } from "@/app/lib/definitions";
import Image from "next/image";
import { clsx } from 'clsx'
import { lusitana } from "../fonts";
import { RateTypeForShipment } from "@/app/lib/schemas/schema";
import { CreateRate, CreateRateFromShipment, CreateRateFromShipmentWithRoute } from "./buttons";
import RouteRatesTable from "./route-rates-table";


export default async function ShipmentRoutesRatesTable(
    { routes, rates, shipment_id } : {
    routes: RouteFullType[],
    rates: RateTable[],
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
                       <CreateRateFromShipmentWithRoute shipment_id={shipment_id} route_id={route.id} /> 
                    </div>

                </div>
                <RouteRatesTable rates={rates} shipment_id={shipment_id} route_id={route.id} />
              </div>
            ))}
          </div>
              {routes?.map((route) => (
                <div className="hidden min-w-full text-gray-900 md:inline">
                  <div
                    key={route.id + 'i'}
                    className="mb-1 w-full rounded-md bg-white p-1"
                  >
                      <div className="flex justify-between items-center border-b pb-1">
                        <div>
                            <div className="mb-2 flex items-center">
                              <Image
                                src={route.image_url}
                                width={42}
                                height={42}
                                alt='transport_image'
                                className="mr-2"
                              /> 
                              <p className={clsx(lusitana.className, 'text-base font-bold')}>{route.start_city_name + ' - ' + route.end_city_name}</p>
                            </div>     
                        </div>

                        <div className="flex justify-end gap-2 mr-5">
                          <CreateRateFromShipmentWithRoute shipment_id={shipment_id} route_id={route.id} /> 
                        </div>
                    </div>
                  </div>
                  <RouteRatesTable rates={rates} shipment_id={shipment_id} route_id={route.id} />
                </div>
              ))}
        </div>
      </div>
    </div>

      );

}