import { RouteFullType, ShipmentRouteUnitTypeFull } from "@/app/lib/definitions";
import Image from "next/image";
import { DeleteUnitFromShipmentRoute } from "@/app/ui/units/buttons";

export default async function RouteUnitsTable({ units, shipment_id, route_id } : {
    units: ShipmentRouteUnitTypeFull[],
    shipment_id: string,
    route_id: string,
}) {

    function getCorrectDate(date: string) {
      const today = new Date();
      const offset = today.getTimezoneOffset() * 60000;
      const formattedDate = (new Date(date)).getTime() - offset;

      return new Date(formattedDate).toISOString().split('T')[0];
    }


    return (
        <div className="mb-4 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {units?.map((unit) => {
                  if(unit.route_id === route_id) {
                    return (
                      <div
                      key={unit.id + 'i'}
                      className="mb-2 w-full rounded-md bg-white p-4"
                    >
                      <div className="flex items-center justify-between border-b pb-4">
                          <div>
                              <div className="mb-2 flex items-center">
                                <p>{unit.number}</p>
                              </div>
                              <p className="text-sm text-gray-500">{unit.unit_type_name}</p>
                          </div>
                          <div className="flex justify-end gap-2">
                              <DeleteUnitFromShipmentRoute shipment_id={shipment_id} route_id={route_id} unit_id={unit.id}/>
                        </div>
  
                      </div>
                      <div className="flex mt-2 items-center justify-between border-b pb-4">
                          <div>
                              <div className="mb-2 flex items-center">
                                <p>{unit.vehicle_number}</p>
                              </div>
                              <p className="text-sm text-gray-500">{unit.vehicle_type_name}</p>
                          </div>
                          <div className="flex-col justify-end gap-2 text-sm">
                              <div className="">
                                <p>
                                  {
                                    getCorrectDate(unit.start_date) === '1970-01-01' ?
                                    '' :
                                    getCorrectDate(unit.start_date)
                                  }
                                </p>
                              </div>
                              <p>
                                {
                                  getCorrectDate(unit.end_date) === '1970-01-01' ?
                                  '' :
                                  getCorrectDate(unit.end_date)
                                }
                              </p>
                        </div>
  
                      </div>
                    </div>
                    );
                  }

              })}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <tbody className="bg-white">
                  {units?.map((unit) => {
                    if(unit.route_id === route_id) {
                      return (
                      <tr
                        key={ unit.id }
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                      >
                        <td className="whitespace-nowrap px-3 py-3">
                          {unit.number}
                          <p className="text-xs">{unit.unit_type_name}</p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {unit.vehicle_number}
                          <p className="text-xs">{unit.vehicle_type_name}</p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {
                            getCorrectDate(unit.start_date) === '1970-01-01' ?
                            '' :
                            getCorrectDate(unit.start_date)
                          }
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {
                            getCorrectDate(unit.end_date) === '1970-01-01' ?
                            '' :
                            getCorrectDate(unit.end_date)
                          }
                        </td>
                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                          <div className="flex justify-end gap-3">
                            <DeleteUnitFromShipmentRoute shipment_id={shipment_id} route_id={route_id} unit_id={unit.id}/>
                          </div>
                        </td>
                      </tr>);
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

}