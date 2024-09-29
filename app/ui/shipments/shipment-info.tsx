import { ShipmentTypeFull } from "@/app/lib/definitions";
import { lusitana } from "../fonts";
import { clsx } from 'clsx'

export default async function ShipmentInfoPanel({shipment} : { 
    shipment: ShipmentTypeFull 
}) {
    return (
        <div className="rounded-md text-sm bg-gray-50 p-4 md:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div className="">
                <span>Number: </span>
                <span className={clsx(lusitana.className, 'text-base')}>{shipment.number }</span>
            </div>

            <div className="">
                <span>Date: </span>
                <span className={clsx(lusitana.className, 'text-base')}>{new Date(shipment.date).toISOString().split('T')[0] }</span>
            </div>

            <div className="col-span-2">
                <span>Customer: </span>
                <span className={clsx(lusitana.className, 'text-base')}>{shipment.customer_name_eng }</span>
            </div>

            <div className="col-span-2">
                <span>Organisation: </span>
                <span className={clsx(lusitana.className, 'text-base')}>{shipment.organisation_name_eng }</span>
            </div>

            <div className="">
                <span>Sale: </span>
                <span className={clsx(lusitana.className, 'text-base')}>{shipment.sales_name_eng }</span>
            </div>

            <div className="">
                <span>Docs: </span>
                <span className={clsx(lusitana.className, 'text-base')}>{shipment.documentation_name_eng }</span>
            </div>

        </div>

    );
    
}