import { RouteFullType, ShipmentRouteUnitTypeFull } from "@/app/lib/definitions";
import Image from "next/image";
import { fetchFilteredCustomersAgreements, fetchFilteredDrivers, fetchFilteredUnits, fetchFilteredVehiclesByTransportType, fetchRouteTransportTypeIdByRouteId } from "@/app/lib/data";
import { SelectVehicle } from "../vehicles/buttons";
import { getCorrectDate } from "@/app/lib/utils";
import { DeleteSupplierAgreement, UpdateSupplierAgreement } from "./buttons";
import { fetchFilteredSuppliersAgreements } from "@/app/lib/supplier_agreements/data";

export default async function SuppliersAgreementsTable({ query, currentPage } : {
    query: string,
    currentPage: number,
}) {
    const agreements = await fetchFilteredSuppliersAgreements(query, currentPage);

    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div key='mobile-view' className="md:hidden">
                {agreements?.map((agreement) => (
                  <div
                    key={agreement.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                        <div key='number_and_date'>
                            <div key='mob_agreement_number' className="mb-2 flex items-center">
                              <p className="text-lg">{agreement.number + ' dd. ' + getCorrectDate(agreement.date)}</p>
                            </div>
                            <div>        
                              <p key='mob_agreement_validity' className="text-sm text-gray-500">{'Validity: ' + getCorrectDate(agreement.validity)}</p>
                            </div>
                        </div>
                        <div key='buttons' className="flex justify-end gap-2">
                          <UpdateSupplierAgreement key='mob_update_btn' id={agreement.id} />
                          <DeleteSupplierAgreement key='mob_delete_btn' id={agreement.id} />
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="">
                          {agreement.supplier_name}
                        </p>
                        <p className="text-sm">{agreement.organisation_name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table key='md-view' className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Number
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Supplier
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Organisation
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Validity
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {agreements?.map((agreement) => (
                    <tr
                      key={ agreement.id }
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td key='agreement_number' className="whitespace-nowrap px-3 py-3">
                        {agreement.number}
                      </td>
                      <td key='agreement_date' className="whitespace-nowrap px-3 py-3">
                        {getCorrectDate(agreement.date)}
                      </td>
                      <td key='agreement_customer' className="whitespace-nowrap px-3 py-3">
                        {agreement.supplier_name}
                      </td>
                      <td key='agreement_organisation' className="whitespace-nowrap px-3 py-3">
                        {agreement.organisation_name}
                      </td>
                      <td key='agreement_validity' className="whitespace-nowrap px-3 py-3">
                        {getCorrectDate(agreement.validity)}
                      </td>
                      <td key='agreement_buttons_md' className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateSupplierAgreement key='update_btn' id={agreement.id} />
                          <DeleteSupplierAgreement key='delete_btn' id={agreement.id} />
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