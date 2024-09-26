import { fetchFilteredShipments } from "@/app/lib/data";
import ShipmentStatus from "./status";
import { formatDateToLocal } from "@/app/lib/utils";
import { DeleteShipment, UpdateShipment } from "./buttons";

export default async function ShipmentsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const shipments = await fetchFilteredShipments(query, currentPage);

  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {shipments?.map((shipment) => (
              <div
                key={shipment.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center truncate ...">
                      <p>{shipment.customer_name_eng}</p>
                    </div>
                    <p className="text-sm text-gray-500">{shipment.number}</p>
                  </div>
                  <ShipmentStatus status={shipment.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {shipment.remarks}
                    </p>
                    <p>{formatDateToLocal(shipment.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateShipment id={shipment.id} />
                    <DeleteShipment id={shipment.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Number
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Remarks
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Sales
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Docs
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {shipments?.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3 truncate ...">
                      <p>{shipment.customer_name_eng}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {shipment.number}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {new Date((new Date(shipment.date)).getTime() - offset).toISOString().split('T')[0]}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {shipment.remarks}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {shipment.sales_name_eng}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {shipment.documentation_name_eng}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <ShipmentStatus status={shipment.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateShipment id={shipment.id} />
                      <DeleteShipment id={shipment.id} />
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
