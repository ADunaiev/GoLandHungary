import { RateTable, RouteFullType, ShipmentRouteUnitTypeFull } from "@/app/lib/definitions";
import Image from "next/image";
import { DeleteUnitFromShipmentRoute } from "@/app/ui/units/buttons";
import { AddVehicle } from "../vehicles/buttons";
import { init } from "next/dist/compiled/webpack/webpack";
import { AddDriver } from "../drivers/buttons";
import { DeleteRateFromShipment } from "./buttons";

export default async function RouteRatesTable({ rates, shipment_id, route_id } : {
    rates: RateTable[],
    shipment_id: string,
    route_id: string,
}) {

    return (
        <div className="mb-4 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {rates?.map((rate) => {
                  if(rate.route_id === route_id) {
                    return (
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
                            <DeleteRateFromShipment shipment_id={shipment_id} rate_id={rate.id} />
                          </div>
                        </div>
                      </div>
                    );
                  }

              })}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <tbody className="bg-white">
                  {rates?.map((rate) => {
                    if(rate.route_id === route_id) {
                      return (
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
                                <DeleteRateFromShipment shipment_id={shipment_id} rate_id={rate.id} />
                            </div>
                            </td>
                      </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

}