'use server';

import { number, z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { DriverFormSchema, DriverTypeSchema, InvoiceFormSchema, InvoiceRateFormSchema, RateFormSchemaForShipment, RateTypeForShipment, RouteFormSchema, RouteTypeSchema, ShipmentFormSchema, ShipmentType, UnitFormSchema, UnitTypeSchema, VehicleFormSchema, VehicleTypeSchema } from './schemas/schema';
import { createShipmentRouteInDb, deleteInvoiceRatesFromDb, fetchCurrenciesRatesByDate, fetchCurrencyRateByDateOrganisationCurrency, fetchDriverIdByNameAndPhone, fetchInvoiceById, fetchInvoiceByNumber, fetchInvoiceFullById, fetchInvoiceNumberByRateId, fetchInvoiceRatesByInvoiceId, fetchManagerialCurrencyIdByOrganisationId, fetchRateById, fetchRouteIdByCitiesAndTransport, fetchShipmentNumber, fetchUnitIdByNumberAndType, fetchVatRateById, fetchVehicleIdByNumberAndTypes, saveInvoiceRatesToDb } from './data';
import ReactPDF from '@react-pdf/renderer';
import InvoiceToPdf from '../ui/invoices/print-form';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
      }),
    date: z.string(),
});

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };

type InvoiceType = z.infer<typeof InvoiceFormSchema>;
type RateType = z.infer<typeof InvoiceRateFormSchema>;

export async function createInvoice(formData: InvoiceType) {

    const validatedFields = InvoiceFormSchema.safeParse({
        customerId: formData.customerId,
        status: formData.status,
        number: formData.number,
        performance_date: formData.performance_date,
        date: formData.date,
        payment_date: formData.payment_date,
        agreement_id: formData.agreement_id,
        currency_id: formData.currency_id,
        organisation_id: formData.organisation_id,
        remarks: formData.remarks,
    });

    if (!validatedFields.success) {
        
        return {
          success: false,
          error: validatedFields.error.format(),
        };
      }

    const { customerId, status, number, performance_date, date, payment_date, agreement_id, currency_id, organisation_id, remarks } = validatedFields.data;
    let amountInCents = 0;
    let amountWoVatInCents = 0; 
    let amountVatInCents = 0;
    const formatedDate = date.toISOString().split('T')[0];
    const formatedPerformanceDate = performance_date.toISOString().split('T')[0];
    const formatedPaymentDate = payment_date.toISOString().split('T')[0];

    let formatedAgreementId;
    if(agreement_id === "") { formatedAgreementId = null } else { formatedAgreementId = agreement_id }
    
    const invoice = await fetchInvoiceByNumber(number);


    await saveInvoiceRatesToDb(number, date, organisation_id, currency_id);
    
    const invoiceRates = await fetchInvoiceRatesByInvoiceId(invoice.id);
    const currencies = await fetchCurrenciesRatesByDate(
        date, organisation_id
    );
    const managerial_currency_rate_id = await fetchManagerialCurrencyIdByOrganisationId(organisation_id);

    const invoice_currency_rate = currencies.find(cr => cr.currency_id === currency_id)?.rate || 1;
    const invoice_managerial_rate = currencies.find(cr => cr.currency_id === managerial_currency_rate_id)?.rate || 100;

    //currencies.map(c => console.log(c.currency_id + " " + c.rate));

    invoiceRates.map(invoiceRate => {
        amountWoVatInCents += invoiceRate.net_line;
        amountVatInCents += invoiceRate.vat_value;
        amountInCents += invoiceRate.gross_value; 
    });

    const amount_managerial_wo_vat = Math.round(amountWoVatInCents * invoice_currency_rate / invoice_managerial_rate);
    const amount_managerial_with_vat = Math.round(amountInCents * invoice_currency_rate / invoice_managerial_rate);

    try{
        await sql`    
            UPDATE invoices 
            SET 
                customer_id = ${customerId}, 
                status = ${status}, 
                performance_date = ${formatedPerformanceDate},
                date = ${formatedDate}, 
                payment_date = ${formatedPaymentDate},
                agreement_id = ${formatedAgreementId}, 
                currency_id = ${currency_id}, 
                organisation_id = ${organisation_id}, 
                remarks = ${remarks},
                amount = ${amountInCents},
                amount_wo_vat = ${amountWoVatInCents},
                vat_amount = ${amountVatInCents},
                currency_rate = ${invoice_currency_rate},
                amount_managerial_wo_vat = ${amount_managerial_wo_vat},
                amount_managerial_with_vat = ${amount_managerial_with_vat}
            WHERE number = ${number}
        `;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.'
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: InvoiceType) {
    
    const validatedFields = InvoiceFormSchema.safeParse({
        customerId: formData.customerId,
        status: formData.status,
        number: formData.number,
        performance_date: formData.performance_date,
        date: formData.date,
        payment_date: formData.payment_date,
        agreement_id: formData.agreement_id,
        currency_id: formData.currency_id,
        organisation_id: formData.organisation_id,
        remarks: formData.remarks,
    });

    if(!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.format(),
          };
    }

    const { customerId, status, number, performance_date, date, payment_date, agreement_id, currency_id, organisation_id, remarks } = validatedFields.data;
    let amountInCents = 0;
    let amountWoVatInCents = 0; 
    let amountVatInCents = 0;
    const formatedDate = date.toISOString().split('T')[0];
    const formatedPerformanceDate = performance_date.toISOString().split('T')[0];
    const formatedPaymentDate = payment_date.toISOString().split('T')[0];

    let formatedAgreementId;
    if(agreement_id === "") { formatedAgreementId = null } else { formatedAgreementId = agreement_id }

    const invoice = await fetchInvoiceByNumber(number);
    await deleteInvoiceRatesFromDb(invoice.id);
    await saveInvoiceRatesToDb(number, date, organisation_id, currency_id);
    const currencies = await fetchCurrenciesRatesByDate(
        date, organisation_id
    );

    const invoiceRates = await fetchInvoiceRatesByInvoiceId(invoice.id);

    const managerial_currency_rate_id = await fetchManagerialCurrencyIdByOrganisationId(organisation_id);

    const invoice_currency_rate = currencies.find(cr => cr.currency_id === currency_id)?.rate || 1;
    const invoice_managerial_rate = currencies.find(cr => cr.currency_id === managerial_currency_rate_id)?.rate || 100;

    invoiceRates.map(r => console.log('rate = ',r.net_unit));

    invoiceRates.map(invoiceRate => {
        amountWoVatInCents += invoiceRate.net_line;
        amountVatInCents += invoiceRate.vat_value;
        amountInCents += invoiceRate.gross_value; 
    });

    const amount_managerial_wo_vat = Math.round(amountWoVatInCents * invoice_currency_rate / invoice_managerial_rate);
    const amount_managerial_with_vat = Math.round(amountInCents * invoice_currency_rate / invoice_managerial_rate);

    try{
        await sql`    
            UPDATE invoices 
            SET 
                customer_id = ${customerId}, 
                status = ${status}, 
                performance_date = ${formatedPerformanceDate},
                date = ${formatedDate}, 
                payment_date = ${formatedPaymentDate},
                agreement_id = ${formatedAgreementId}, 
                currency_id = ${currency_id}, 
                organisation_id = ${organisation_id}, 
                remarks = ${remarks},
                amount = ${amountInCents},
                amount_wo_vat = ${amountWoVatInCents},
                vat_amount = ${amountVatInCents},
                currency_rate = ${invoice_currency_rate},
                amount_managerial_wo_vat = ${amount_managerial_wo_vat},
                amount_managerial_with_vat = ${amount_managerial_with_vat}
            WHERE number = ${number}
        `;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.'
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
    
}

export async function deleteInvoice(id: string) {
    //throw new Error('Failed to delete invoice');

    try {
        await deleteInvoiceRatesFromDb(id);
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted invoice' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice.',
        };
    }
    
    
}


export async function createInvoiceRate(invoice_number: string, isCreateInvoice: boolean , formData: RateType) {
    const validatedFields = InvoiceRateFormSchema.safeParse({
        service_id: formData.service_id,
        shipment_id: formData.shipment_id,
        route_id: formData.route_id,
        rate: formData.rate,
        quantity: formData.quantity,
        currency_id: formData.currency_id,
        vat_rate_id: formData.vat_rate_id,
    });

    if(!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.format(),
        };
    }

    const { service_id, shipment_id, route_id, rate, quantity, currency_id, vat_rate_id}
     = validatedFields.data;

    let shipmentId, routeId;

    if(shipment_id === "") { shipmentId = null } else { shipmentId = shipment_id }
    if(route_id === "") { routeId = null } else { routeId = route_id }

     const rateInCents = rate * 100;
     const vat_rate = await fetchVatRateById(vat_rate_id);
     const netAmountInCents = Math.trunc(rateInCents * quantity);
     const vatAmountInCents = Math.trunc(netAmountInCents * vat_rate.rate / 10000);
     const grossAmountInCents = netAmountInCents + vatAmountInCents;
    
     try {
        await sql`
        INSERT INTO rates (service_id, shipment_id, route_id, rate, quantity, net_amount, currency_id, vat_rate_id, vat_amount, gross_amount, invoice_number) VALUES
        (${service_id}, ${shipmentId}, ${routeId}, ${rateInCents}, ${quantity}, ${netAmountInCents}, ${currency_id}, ${vat_rate_id}, ${vatAmountInCents}, ${grossAmountInCents}, ${invoice_number})
        `;

     } catch (error) {
        console.log(error);
        return {
            message: 'Database error: Failed to Create Rate'
        };
     }

     const invoice = await fetchInvoiceByNumber(invoice_number);

     if(isCreateInvoice) {
        revalidatePath('/dashboard/invoices/create');
        redirect('/dashboard/invoices/create');
     } else {
        revalidatePath(`/dashboard/invoices/${invoice.id}/edit`);
        redirect(`/dashboard/invoices/${invoice.id}/edit`);
     }
}

export async function createRateFromShipment(shipment_id: string, formData: RateTypeForShipment) {
    const validatedFields = RateFormSchemaForShipment.safeParse({
        service_id: formData.service_id,
        route_id: formData.route_id,
        rate: formData.rate,
        quantity: formData.quantity,
        currency_id: formData.currency_id,
        vat_rate_id: formData.vat_rate_id,
    });

    if(!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.format(),
        };
    }

    const { service_id, route_id, rate, quantity, currency_id, vat_rate_id}
     = validatedFields.data;

    let shipmentId, routeId;

    shipmentId = shipment_id;
    if(route_id === "") { routeId = null } else { routeId = route_id }

     const rateInCents = rate * 100;
     const vat_rate = await fetchVatRateById(vat_rate_id);
     const netAmountInCents = Math.trunc(rateInCents * quantity);
     const vatAmountInCents = Math.trunc(netAmountInCents * vat_rate.rate / 10000);
     const grossAmountInCents = netAmountInCents + vatAmountInCents;
    
     try {
        await sql`
        INSERT INTO rates (service_id, shipment_id, route_id, rate, quantity, net_amount, currency_id, vat_rate_id, vat_amount, gross_amount) VALUES
        (${service_id}, ${shipmentId}, ${routeId}, ${rateInCents}, ${quantity}, ${netAmountInCents}, ${currency_id}, ${vat_rate_id}, ${vatAmountInCents}, ${grossAmountInCents})
        `;

     } catch (error) {
        console.log(error);
        return {
            message: 'Database error: Failed to Create Rate from Shipment'
        };
     }

    revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=3`);
    redirect(`/dashboard/shipments/${shipment_id}/edit?tab=3`);

}

export async function updateInvoiceRate(id: string, isCreateInvoice: boolean, formData: RateType) {

    const validatedFields = InvoiceRateFormSchema.safeParse({
        shipment_id: formData.shipment_id,
        service_id: formData.service_id,
        rate: formData.rate,
        currency_id: formData.currency_id,
        vat_rate_id: formData.vat_rate_id,
        route_id: formData.route_id,
        quantity: formData.quantity,
    });

    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to update rate.',
        }
    }

    const {
        shipment_id, 
        service_id, 
        rate, 
        currency_id,
        vat_rate_id,
        route_id,
        quantity 
     } = validatedFields.data;

     const rateInCents = rate * 100;
     const vat_rate = await fetchVatRateById(vat_rate_id);
     const netAmountInCents = Math.trunc(rateInCents * quantity);
     const vatAmountInCents = Math.trunc(netAmountInCents * vat_rate.rate / 10000);
     const grossAmountInCents = netAmountInCents + vatAmountInCents;

     try {
        await sql`
        UPDATE rates
        SET 
            shipment_id = ${shipment_id},
            service_id = ${service_id},
            rate = ${rateInCents},
            currency_id = ${currency_id},
            vat_rate_id = ${vat_rate_id},
            route_id = ${route_id},
            quantity = ${quantity},
            net_amount = ${netAmountInCents},
            vat_amount = ${vatAmountInCents},
            gross_amount = ${grossAmountInCents}
        WHERE id = ${id}
        `;
     } catch(error) {
        return {
            message: 'Database error. Failed to update rate.'
        }
     }

     const invoiceNumber = await fetchInvoiceNumberByRateId(id);
     const invoice_id = (await fetchInvoiceByNumber(invoiceNumber)).id;

     if(isCreateInvoice) {
        revalidatePath('/dashboard/invoices/create');
        redirect('/dashboard/invoices/create')
     } else {
        revalidatePath(`/dashboard/invoices/${invoice_id}/edit`);
        redirect(`/dashboard/invoices/${invoice_id}/edit`);
     }
}

export async function deleteInvoiceRate(id: string) {
    try {
        await sql`DELETE FROM rates WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices/create');
        return { message: 'Deleted rate.'};
    } catch(error) {
        return {
            message: 'Database error. Failed to delete rate.'
        }
    }
}

export async function deleteInvoiceRateEditInvoice(id: string, rateId: string) {
    try {
        await sql`DELETE FROM invoice_rates WHERE rate_id = ${rateId}`;
        await sql`DELETE FROM rates WHERE id = ${rateId}`;
        revalidatePath(`/dashboard/invoices/${id}/edit`);
        return { message: 'Deleted rate.'};
    } catch(error) {
        return {
            message: 'Database error. Failed to delete rate.'
        }
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
}


{/* Customers */}

const CustomerFormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    email: z.string({
        invalid_type_error: 'Please enter valid email.'
    }).email(),
    image_url: z.string({
        invalid_type_error: 'Please enter valid url.'
    }),
});
const CreateCustomer = CustomerFormSchema.omit({id:true});

export type CustomerState = {
    errors?: {
      name?: string[];
      email?: string[];
      image_url?: string[];
    };
    message?: string | null;
  };

export async function createCustomer(prevState: CustomerState, formData: FormData) {
    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Customer.',
        };
      }

    const { name, email, image_url } = validatedFields.data;

    try{
        await sql`
            INSERT INTO customers (name, email, image_url)
            VALUES (${name}, ${email}, ${image_url})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Customer.',
        };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

{/* Shipments */}

export async function createShipment(formData: ShipmentType) {
    const validatedFields = ShipmentFormSchema.safeParse({
        customerId: formData.customerId,
        status: formData.status,
        salesId: formData.salesId,
        documentationId: formData.documentationId,
        date: formData.date,
        organisation_id: formData.organisation_id,
        remarks: formData.remarks,
        customer_reference: formData.customer_reference,
    });

    if (!validatedFields.success) {
        
        return {
          success: false,
          error: validatedFields.error.format(),
        };
      }

    const { customerId, status, salesId, documentationId, date, organisation_id, remarks, customer_reference } = validatedFields.data;

    const formatedDate = date.toISOString().split('T')[0];   
    const number = await fetchShipmentNumber();

    try{
        await sql`    
            INSERT INTO shipments (customer_id, status, date, organisation_id, 
            remarks, number, customer_reference, sale_id, documentation_id) 
            VALUES
            (
                ${customerId}, 
                ${status}, 
                ${formatedDate}, 
                ${organisation_id}, 
                ${remarks},
                ${number},
                ${customer_reference},
                ${salesId},
                ${documentationId}
            )
        `;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Shipment.'
        };
    }

    revalidatePath('/dashboard/shipments');
    redirect('/dashboard/shipments');
}

export async function updateShipment(id: string, formData: ShipmentType) {
    const validatedFields = ShipmentFormSchema.safeParse({
        customerId: formData.customerId,
        status: formData.status,
        date: formData.date,
        organisation_id: formData.organisation_id,
        remarks: formData.remarks,
        salesId: formData.salesId,
        documentationId: formData.documentationId,
        customer_reference: formData.customer_reference,
    });

    if(!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.format(),
          };
    }

    const { customerId, status, date, organisation_id, remarks, salesId, documentationId, customer_reference } = validatedFields.data;

    const formatedDate = date.toISOString().split('T')[0];

    try{
        await sql`    
            UPDATE shipments 
            SET 
                customer_id = ${ customerId }, 
                status = ${ status }, 
                date = ${ formatedDate }, 
                organisation_id = ${ organisation_id }, 
                remarks = ${ remarks },
                sale_id = ${ salesId },
                documentation_id = ${ documentationId },
                customer_reference = ${ customer_reference }
            WHERE id = ${ id }
        `;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Shipment.'
        };
    }

    revalidatePath('/dashboard/shipments');
    redirect('/dashboard/shipments');
}

export async function deleteShipment(id: string) {

    try {
        await sql`DELETE FROM shipments WHERE id = ${id}`;
        revalidatePath('/dashboard/shipments');
        return { message: 'Deleted shipment' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Shipment.',
        };
    }
    
    
}

{/* Routes */}

export async function createRouteFromShipment(shipment_id: string, formData: RouteTypeSchema) {
    
    const validatedFields = RouteFormSchema.safeParse({
        start_city_id: formData.start_city_id,
        end_city_id: formData.end_city_id,
        transport_type_id: formData.transport_type_id,
    });

    if(!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.format(),
        };
    }

    const { start_city_id, end_city_id, transport_type_id }
     = validatedFields.data;

    let route_id = await fetchRouteIdByCitiesAndTransport(
        start_city_id, end_city_id, transport_type_id
    );

    if(route_id === '') {
    
        try {
            await sql`
            INSERT INTO routes (start_city_id, end_city_id, transport_type_id) VALUES
            (${start_city_id}, ${end_city_id}, ${transport_type_id})
            `;

        } catch (error) {
            console.log(error);
            return {
                message: 'Database error: Failed to Create Route from Shipment'
            };
        }

        route_id = await fetchRouteIdByCitiesAndTransport(
            start_city_id, end_city_id, transport_type_id
        );
    }
     
    if (route_id !== '') {
     await createShipmentRouteInDb(shipment_id, route_id);
    }

    revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=1`);
    redirect(`/dashboard/shipments/${shipment_id}/edit?tab=1`);

}

export async function deleteRouteFromShipment(shipment_id: string, route_id: string) {

    try {
        await sql`DELETE FROM shipment_route_units WHERE shipment_id = ${shipment_id} AND route_id = ${route_id}`;
        await sql`DELETE FROM shipment_routes WHERE shipment_id = ${shipment_id} AND route_id = ${route_id}`;
        revalidatePath(`/dashboard/shipments/${shipment_id}}/edit?tab=1`);
        return { message: 'Route deleted from shipment' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Route from Shipment.',
        };
    }   
}

{/* Units */}

export async function createUnit(shipment_id: string, route_id: string, formData: UnitTypeSchema) {
    
    const validatedFields = UnitFormSchema.safeParse({
        number: formData.number,
        unit_type_id: formData.unit_type_id,
    });

    if(!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.format(),
        };
    }

    const { number, unit_type_id }
     = validatedFields.data;

    let unit_id = await fetchUnitIdByNumberAndType(
        number, unit_type_id
    );

    if(unit_id === '') {  
        try {
            await sql`
            INSERT INTO units (number, unit_type_id) VALUES
            (${number}, ${unit_type_id})
            `;

        } catch (error) {
            console.log(error);
            return {
                message: 'Database error: Failed to Create Unit from Shipment.'
            };
        }

        revalidatePath(`/dashboard/shipments/${shipment_id}/edit/${route_id}/add_unit`);
        redirect(`/dashboard/shipments/${shipment_id}/edit/${route_id}/add_unit`);

    } else {
        throw new Error('Unit already exists!')
    }
}

export async function addUnitToShipmentRoute(shipment_id: string, route_id: string, unit_id: string) {

    try {
        await sql`
            INSERT INTO shipment_route_units (shipment_id, route_id, unit_id) VALUES
            (${shipment_id}, ${route_id}, ${unit_id})
            `;
        revalidatePath(`/dashboard/shipments/${shipment_id}/edit/${route_id}/add_unit`);
        return { message: 'Unit added to shipment route units' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Add Unit to from Shipment Route Units.',
        };
    }   
    
}

export async function deleteUnitFromShipmentRoute(
    shipment_id: string,
    route_id: string,
    unit_id: string,
) {

    try {
        await sql`
            DELETE FROM shipment_route_units
            WHERE 
                shipment_id = ${shipment_id} AND
                route_id = ${route_id} AND
                unit_id = ${unit_id}
        `;
        revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=2`);
        return { message: 'Unit deleted from shipment route units.' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Unit from Shipment Route Units.',
        };
    }   
}

{/* Vehicles */}

export async function createVehicle(shipment_id: string, route_id: string, unit_id: string, formData: VehicleTypeSchema) {
    
    const validatedFields = VehicleFormSchema.safeParse({
        number: formData.number,
        vehicle_type_id: formData.vehicle_type_id,
        transport_type_id: formData.transport_type_id
    });

    if(!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.format(),
        };
    }

    const { number, vehicle_type_id, transport_type_id }
     = validatedFields.data;

    let vehicle_id = await fetchVehicleIdByNumberAndTypes(
        number, vehicle_type_id, transport_type_id
    );

    if(vehicle_id === '') {  
        try {
            await sql`
            INSERT INTO vehicles (number, vehicle_type_id, transport_type_id) VALUES
            (${number}, ${vehicle_type_id}, ${transport_type_id})
            `;

        } catch (error) {
            console.log(error);
            return {
                message: 'Database error: Failed to Create Vehicle from Shipment.'
            };
        }

        revalidatePath(`/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_vehicle`);
        redirect(`/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_vehicle`);

    } else {
        throw new Error('Vehicle already exists!')
    }
}

export async function addVehicleToShipmentRouteUnit(
    shipment_id: string, route_id: string, unit_id: string, vehicle_id: string) {

    try {
        await sql`
            UPDATE shipment_route_units SET vehicle_id = ${vehicle_id}
            WHERE 
                shipment_id = ${shipment_id} AND 
                route_id = ${route_id} AND 
                unit_id = ${unit_id}
            `;
        
    } catch (error) {
        return {
            message: 'Database Error: Failed to Add Vehicle to from Shipment Route Units.',
        };
    }  
    
    revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=2`);
    redirect(`/dashboard/shipments/${shipment_id}/edit?tab=2`);
    
}

{/* Drivers */}

export async function createDriver(shipment_id: string, route_id: string, unit_id: string, formData: DriverTypeSchema) {
    
    const validatedFields = DriverFormSchema.safeParse({
        name_eng: formData.name_eng,
        phone: formData.phone,
    });

    if(!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.format(),
        };
    }

    const { name_eng, phone }
     = validatedFields.data;

    let driver_id = await fetchDriverIdByNameAndPhone(
        name_eng, phone
    );

    if(driver_id === '') {  
        try {
            await sql`
            INSERT INTO drivers (name_eng, phone) VALUES
            (${name_eng}, ${phone})
            `;

        } catch (error) {
            console.log(error);
            return {
                message: 'Database error: Failed to Create Driver from Shipment.'
            };
        }

        revalidatePath(`/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_driver`);
        redirect(`/dashboard/shipments/${shipment_id}/edit/${route_id}/${unit_id}/add_driver`);

    } else {
        throw new Error('Driver already exists!')
    }
}

export async function addDriverToShipmentRouteUnit(
    shipment_id: string, route_id: string, unit_id: string, driver_id: string) {

    try {
        await sql`
            UPDATE shipment_route_units SET driver_id = ${driver_id}
            WHERE 
                shipment_id = ${shipment_id} AND 
                route_id = ${route_id} AND 
                unit_id = ${unit_id}
            `;
        
    } catch (error) {
        return {
            message: 'Database Error: Failed to Add Driver to from Shipment Route Units.',
        };
    }  
    
    revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=2`);
    redirect(`/dashboard/shipments/${shipment_id}/edit?tab=2`);
    
}