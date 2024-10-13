'use server';

import { number, z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { CityFormSchema, CityTypeSchema, CurrencyRateFormSchema, CurrencyRateTypeSchema, CustomerFormSchema, CustomerTypeSchema, DriverFormSchema, DriverTypeSchema, InvoiceFormSchema, InvoiceRateFormSchema, RateFormSchemaForShipment, RateTypeForShipment, RateTypeWithoutRoute, RateTypeWithoutRouteSchema, RouteFormSchema, RouteTypeSchema, ShipmentFormSchema, ShipmentType, UnitFormSchema, UnitTypeSchema, VehicleFormSchema, VehicleTypeSchema } from './schemas/schema';
import { clearIsInvoiceMarkInShipmentRates, clearRatesFromInvoiceNumber, createShipmentRouteInDb, deleteInvoiceRatesFromDb, fetchCityIdByNameAndCountry, fetchCurrenciesRatesByDate, fetchCurrencyIdByShortName, fetchCurrencyRateByDateOrganisationCurrency, fetchCurrencyRateIdByDate, fetchDriverIdByNameAndPhone, fetchInvoiceById, fetchInvoiceByNumber, fetchInvoiceFullById, fetchInvoiceNumberByRateId, fetchInvoiceRatesByInvoiceId, fetchInvoiceTotalAmounts, fetchManagerialCurrencyIdByOrganisationId, fetchRateById, fetchRouteIdByCitiesAndTransport, fetchRoutesByShipmentId, fetchShipmentNumber, fetchUnitIdByNumberAndType, fetchVatRateById, fetchVehicleIdByNumberAndTypes, isCustomerExistsInCustomerAgreements, isCustomerExistsInInvoices, isCustomerExistsInShipments, isRateExistsInShipmentInvoices, isRouteExistsInShipmentRates, isRouteExistsInSRU, isShipmentExistsInRoutes, isShipmentRouteExists, isShipmentRouteUnitExists, saveInvoiceRatesToDb, saveShipmentInvoiceRatesToDb, updateRateWithInvoiceNumber } from './data';
import ReactPDF from '@react-pdf/renderer';
import InvoiceToPdf from '../ui/invoices/print-form';
import { toast } from 'sonner'
import { rejects } from 'assert';
import { put } from '@vercel/blob'
import fs from 'node:fs/promises'

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

{/* Invoices */}

export async function createInvoice(invoice_number: string, formData: InvoiceType) {

    const validatedFields = InvoiceFormSchema.safeParse({
        customerId: formData.customerId,
        status: formData.status,
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

    const { customerId, status, performance_date, date, payment_date, agreement_id, currency_id, organisation_id, remarks } = validatedFields.data;
    const number = invoice_number;
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

export async function createInvoiceFromShipment(shipment_id: string, invoice_number: string, formData: InvoiceType) {

    const validatedFields = InvoiceFormSchema.safeParse({
        customerId: formData.customerId,
        status: formData.status,
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

    const { customerId, status, performance_date, date, payment_date, agreement_id, currency_id, organisation_id, remarks } = validatedFields.data;
    const number = invoice_number;

    let amountInCents = 0;
    let amountWoVatInCents = 0; 
    let amountVatInCents = 0;
    const formatedDate = date.toISOString().split('T')[0];
    const formatedPerformanceDate = performance_date.toISOString().split('T')[0];
    const formatedPaymentDate = payment_date.toISOString().split('T')[0];

    let formatedAgreementId;
    if(agreement_id === "") { formatedAgreementId = null } else { formatedAgreementId = agreement_id }
    
    const invoice = await fetchInvoiceByNumber(number);

    const ratesCount = await saveShipmentInvoiceRatesToDb(invoice, date, organisation_id, currency_id, shipment_id);
    
    const currencies = await fetchCurrenciesRatesByDate(
        date, organisation_id
    );
    const managerial_currency_rate_id = await fetchManagerialCurrencyIdByOrganisationId(organisation_id);

    const invoice_currency_rate = currencies.find(cr => cr.currency_id === currency_id)?.rate || 1;
    const invoice_managerial_rate = currencies.find(cr => cr.currency_id === managerial_currency_rate_id)?.rate || 100;

    const invoiceRates = await fetchInvoiceRatesByInvoiceId(invoice.id);
    console.log('invoice_rates length = ', invoiceRates.length);

    invoiceRates.map(async (invoice_rate) => {
        await updateRateWithInvoiceNumber(invoice_rate.rate_id, number);
    });

    const totals = await fetchInvoiceTotalAmounts(
        date, invoiceRates, invoice_currency_rate, invoice_managerial_rate); 

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
                amount = ${totals.amount},
                amount_wo_vat = ${totals.amount_wo_vat},
                vat_amount = ${totals.vat_amount},
                currency_rate = ${invoice_currency_rate},
                amount_managerial_wo_vat = ${totals.amount_managerial_wo_vat},
                amount_managerial_with_vat = ${totals.amount_managerial_with_vat}
            WHERE number = ${number}
        `;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.'
        };
    }

    await clearIsInvoiceMarkInShipmentRates(shipment_id);

    revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=4`);
    redirect(`/dashboard/shipments/${shipment_id}/edit?tab=4`);
}

export async function updateInvoice(id: string, formData: InvoiceType) {
    
    const validatedFields = InvoiceFormSchema.safeParse({
        customerId: formData.customerId,
        status: formData.status,
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

    const { customerId, status, performance_date, date, payment_date, agreement_id, currency_id, organisation_id, remarks } = validatedFields.data;
    const invoice = await fetchInvoiceFullById(id);
    const number = invoice.number

    let amountInCents = 0;
    let amountWoVatInCents = 0; 
    let amountVatInCents = 0;
    const formatedDate = date.toISOString().split('T')[0];
    const formatedPerformanceDate = performance_date.toISOString().split('T')[0];
    const formatedPaymentDate = payment_date.toISOString().split('T')[0];

    let formatedAgreementId;
    if(agreement_id === "") { formatedAgreementId = null } else { formatedAgreementId = agreement_id }


    await deleteInvoiceRatesFromDb(invoice.id);
    await saveInvoiceRatesToDb(number, date, organisation_id, currency_id);
    const currencies = await fetchCurrenciesRatesByDate(
        date, organisation_id
    );

    const invoiceRates = await fetchInvoiceRatesByInvoiceId(invoice.id);

    const managerial_currency_rate_id = await fetchManagerialCurrencyIdByOrganisationId(organisation_id);

    const invoice_currency_rate = currencies.find(cr => cr.currency_id === currency_id)?.rate || 1;
    const invoice_managerial_rate = currencies.find(cr => cr.currency_id === managerial_currency_rate_id)?.rate || 100;

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
            message: 'Database Error: Failed to Update Invoice.'
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
    
}

export async function updateInvoiceFromShipment(shipment_id: string, invoice_id: string, formData: InvoiceType) {
    
    const validatedFields = InvoiceFormSchema.safeParse({
        customerId: formData.customerId,
        status: formData.status,
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

    const { customerId, status, performance_date, date, payment_date, agreement_id, currency_id, organisation_id, remarks } = validatedFields.data;
    const invoice = await fetchInvoiceFullById(invoice_id)
    const number = invoice.number

    let amountInCents = 0;
    let amountWoVatInCents = 0; 
    let amountVatInCents = 0;
    const formatedDate = date.toISOString().split('T')[0];
    const formatedPerformanceDate = performance_date.toISOString().split('T')[0];
    const formatedPaymentDate = payment_date.toISOString().split('T')[0];

    let formatedAgreementId;
    if(agreement_id === "") { formatedAgreementId = null } else { formatedAgreementId = agreement_id }

    await deleteInvoiceRatesFromDb(invoice.id);
    await saveShipmentInvoiceRatesToDb(invoice, date, organisation_id, currency_id, shipment_id);
    const currencies = await fetchCurrenciesRatesByDate(
        date, organisation_id
    );

    const invoiceRates = await fetchInvoiceRatesByInvoiceId(invoice.id);

    invoiceRates.map(async(ir) => {
        await updateRateWithInvoiceNumber(ir.rate_id, number);
    });

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

    revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=4`);
    redirect(`/dashboard/shipments/${shipment_id}/edit?tab=4`);
    
}

export async function deleteInvoice(id: string) {
    //throw new Error('Failed to delete invoice');

    try {
        const invoice = await fetchInvoiceFullById(id)
        await deleteInvoiceRatesFromDb(id);
        await clearRatesFromInvoiceNumber(invoice.number)
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted invoice' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice.',
        };
    }
    
    
}

export async function deleteInvoiceFromShipment(shipment_id: string, invoice_id: string) {

    try {
        const invoice = await fetchInvoiceFullById(invoice_id)

        await deleteInvoiceRatesFromDb(invoice_id);
        await clearRatesFromInvoiceNumber(invoice.number)
        await sql`DELETE FROM invoices WHERE id = ${invoice_id}}`;
        revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=4`);
        return { message: 'Deleted invoice' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice From Shipment.',
        };
    }
    
    
}

{/* Rates */}

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

export async function createRateFromShipment(shipment_id: string, route_id: string, formData: RateTypeWithoutRoute) {
    const validatedFields = RateTypeWithoutRouteSchema.safeParse({
        service_id: formData.service_id,
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

    const { service_id, rate, quantity, currency_id, vat_rate_id}
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

export async function updateRateFromShipment(id: string, rate_id: string, formData: RateType) {

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

     const isRateInInvoice = await isRateExistsInShipmentInvoices(shipment_id, rate_id)

     if(isRateInInvoice) {
        return { message: 'There is invoice with this rate!'}
     } else {
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
            WHERE id = ${rate_id}
            `;
         } catch(error) {
            return {
                message: 'Database error. Failed to update rate.'
            }
         }
     }



    revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=3`);
    redirect(`/dashboard/shipments/${shipment_id}/edit?tab=3`)
    return { message: 'Rate is updated successfully.'}
}

export async function deleteInvoiceRate(id: string) {
    try {
        const rate = await fetchRateById(id);

        console.log('shipment_id = ', rate.shipment_id)

        if(rate.shipment_id === '') {
            await sql`DELETE FROM rates WHERE id = ${id}`;
        } else {
            await sql`UPDATE rates SET invoice_number = null WHERE shipment_id = ${rate.shipment_id} AND id = ${id}`;  
        }
        
        revalidatePath('/dashboard/invoices/create');
        return { message: 'Deleted rate.'};
    } catch(error) {
        return {
            message: 'Database error. Failed to delete rate.'
        }
    }
}

export async function removeRateFromShipmentInvoice(shipment_id: string, rate_id: string) {
    try {
        await sql`UPDATE rates SET is_invoice = false WHERE shipment_id = ${shipment_id} AND id = ${rate_id}`;
        revalidatePath(`/dashboard/shipments/${shipment_id}/edit/create_invoice`);
        return { message: 'Removed rate.'};
    } catch(error) {
        return {
            message: 'Database error. Failed to remove rate from shipment invoice.'
        }
    }
}

export async function removeRateFromShipmentEditInvoice(
    shipment_id: string, invoice_id: string, rate_id: string
) {
    try {
        await sql`DELETE FROM invoice_rates WHERE rate_id = ${rate_id}`;
        await sql`UPDATE rates SET is_invoice = false WHERE shipment_id = ${shipment_id} AND id = ${rate_id}`;
        revalidatePath(`/dashboard/shipments/${shipment_id}/edit/invoices/${invoice_id}/edit_invoice`);
        return { message: 'Removed rate.'};
    } catch(error) {
        return {
            message: 'Database error. Failed to remove rate from shipment invoice.'
        }
    }
}

export async function restoreRatesInShipmentInvoice(shipment_id: string) {
    try {
        await sql`
            UPDATE rates 
            SET is_invoice = true 
            WHERE shipment_id =  ${shipment_id}`;
        revalidatePath(`/dashboard/shipments/${shipment_id}/edit/create_invoice`);
        return { message: 'Restored rates.'};
    } catch(error) {
        return {
            message: 'Database error. Failed to restore rates in shipment invoice.'
        }
    }
}

export async function deleteInvoiceRateEditInvoice(id: string, rateId: string) {
    try {
        await sql`DELETE FROM invoice_rates WHERE rate_id = ${rateId}`;

        const rate = await fetchRateById(rateId);

        console.log('shipment_id = ', rate.shipment_id)

        if(rate.shipment_id === '') {
            await sql`DELETE FROM rates WHERE id = ${rateId}`;
        } else {
            await sql`UPDATE rates SET invoice_number = null WHERE shipment_id = ${rate.shipment_id} AND id = ${rateId}`;  
        }

        revalidatePath(`/dashboard/invoices/${id}/edit`);
        return { message: 'Deleted rate.'};
    } catch(error) {
        return {
            message: 'Database error. Failed to delete rate.'
        }
    }
}

export async function deleteRateFromShipment(shipment_id: string, rate_id: string) {

    try {

        const isRateInInvoice = await isRateExistsInShipmentInvoices(shipment_id, rate_id);


        if (isRateInInvoice) {
            console.log('There is invoice with this Rate!')
            return { message: 'There is invoice with this Rate!' }
        } else {
            await sql`DELETE FROM rates WHERE shipment_id = ${shipment_id} AND id = ${rate_id}`;
            revalidatePath(`/dashboard/shipments/${shipment_id}}/edit?tab=3`);
            return { message: 'Rate deleted from shipment' };
        }

    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Rate from Shipment.',
        };
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

export async function createCustomer(formData: CustomerTypeSchema) {

    const validatedFields = CustomerFormSchema.safeParse({
        name_eng: formData.name_eng,
        email: formData.email,
        name_hun: formData.name_hun,
        code: formData.code,
        country_id: formData.country_id,
        address_eng: formData.address_eng,
        address_hun: formData.address_hun,
        vat_number_eu: formData.vat_number_eu,
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Customer.',
        };
      }

    const { name_eng, email, name_hun, code, country_id, address_eng, address_hun, vat_number_eu } = validatedFields.data;

    const filePath = '/customers/no_avatar.png'
    /*
    let filePath;

    if(image != null) {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        filePath = `/customers/${Date.now()}_${name_eng}`
        await fs.writeFile(filePath, buffer) 
    } else {
        filePath = '/customers/no_avatar.png'
    } */

    try{
        await sql`
            INSERT INTO customers 
            ( name, email, code, address_eng, 
             address_hun, name_hun, vat_number_eu, country_id, image_url)
            VALUES (${name_eng}, ${email}, ${code}, 
            ${address_eng}, ${address_hun}, ${name_hun}, 
            ${vat_number_eu}, ${country_id}, ${filePath})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Customer.',
        };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function updateCustomer(id: string, formData: CustomerTypeSchema) {

    const validatedFields = CustomerFormSchema.safeParse({
        name_eng: formData.name_eng,
        email: formData.email,
        name_hun: formData.name_hun,
        code: formData.code,
        country_id: formData.country_id,
        address_eng: formData.address_eng,
        address_hun: formData.address_hun,
        vat_number_eu: formData.vat_number_eu,
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Customer.',
        };
      }

    const { name_eng, email, name_hun, code, country_id, address_eng, address_hun, vat_number_eu } = validatedFields.data;

    try{
        await sql`
            UPDATE customers
            SET  
                name = ${name_eng}, 
                email = ${email}, 
                code = ${code}, 
                address_eng = ${address_eng}, 
                address_hun = ${address_hun}, 
                name_hun = ${name_hun}, 
                vat_number_eu = ${vat_number_eu}, 
                country_id = ${country_id}
            WHERE id = ${id}
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Customer.',
        };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function deleteCustomer(customer_id: string) {

    try {

        const isCustomerInShipments = await isCustomerExistsInShipments(customer_id);
        const isCustomerInInvoices = await isCustomerExistsInInvoices(customer_id);
        const isCustomerInAgreements = await isCustomerExistsInCustomerAgreements(customer_id);

        if (isCustomerInShipments) {
            return { message: 'There is shipment with this Customer!' }
        } else if(isCustomerInInvoices) {
            return { message: 'There is invoice with this Customer!' }
        } else if(isCustomerInAgreements) {
            return { message: 'There is agreement with this Customer!' }
        }
        else {
            await sql`DELETE FROM customers WHERE id = ${customer_id}`;
            revalidatePath(`/dashboard/customers/`);
            return { message: 'Customer deleted!' };
        }

    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Customer.',
        };
    }   
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

        const isShipmentInRoutes = await isShipmentExistsInRoutes(id);
        
        if(isShipmentInRoutes) {
            return { message: 'There is route with this shipment!'}
        } else {
            await sql`DELETE FROM shipments WHERE id = ${id}`;
            revalidatePath('/dashboard/shipments');
            return { message: 'Deleted shipment' };
        }
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
                success: false,
                error: 'Database error: Failed to Create Route from Shipment'
            };
        }

        route_id = await fetchRouteIdByCitiesAndTransport(
            start_city_id, end_city_id, transport_type_id
        );
    }

    if(await isShipmentRouteExists(shipment_id, route_id)) {
        throw new Error('This route already exists')
    } else {
        if (route_id !== '') {
            await createShipmentRouteInDb(shipment_id, route_id);
        }
    }
     
    revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=1`);
    redirect(`/dashboard/shipments/${shipment_id}/edit?tab=1`);
}

export async function updateRouteFromShipment(shipment_id: string, route_id: string, formData: RouteTypeSchema) {
    
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

    let check_route_id = await fetchRouteIdByCitiesAndTransport(
        start_city_id, end_city_id, transport_type_id
    );

    try {
        await sql`
        UPDATE routes 
        SET
            start_city_id = ${start_city_id}, 
            end_city_id = ${end_city_id}, 
            transport_type_id = ${transport_type_id}
        WHERE id = ${route_id}
        `;

    } catch (error) {
        console.log(error);
        return {
            message: 'Database error: Failed to Update Route from Shipment'
        };
    }


    revalidatePath(`/dashboard/shipments/${shipment_id}/edit?tab=1`);
    redirect(`/dashboard/shipments/${shipment_id}/edit?tab=1`);

}

export async function deleteRouteFromShipment(shipment_id: string, route_id: string) {

    try {

        const isRouteInSRU = await isRouteExistsInSRU(shipment_id, route_id);
        const isRouteInRates = await isRouteExistsInShipmentRates(shipment_id, route_id);

        if (isRouteInSRU) {
            console.log('There is units with this Route!')
            return { message: 'There is units with this Route!' }
        } else if(isRouteInRates) {
            console.log('There is rates with this Route!')
            return { message: 'There is rates with this Route!' }
        } else {
            await sql`DELETE FROM shipment_routes WHERE shipment_id = ${shipment_id} AND route_id = ${route_id}`;
            revalidatePath(`/dashboard/shipments/${shipment_id}}/edit?tab=1`);
            return { message: 'Route deleted from shipment' };
        }

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
        if(await isShipmentRouteUnitExists(shipment_id, route_id, unit_id)) {
            return { message: 'This unit is already selected'}
        } else {
            await sql`
            INSERT INTO shipment_route_units (shipment_id, route_id, unit_id) VALUES
            (${shipment_id}, ${route_id}, ${unit_id})
            `;
            revalidatePath(`/dashboard/shipments/${shipment_id}/edit/${route_id}/add_unit`);
            return { message: 'Unit added to shipment route units' };
        }
    } catch (error) {
        return {
            message: 'Database Error: Failed to Add Unit to from Shipment Route Units.',
        };
    }   
    
}

export async function addUnitToAllShipmentRoutes(shipment_id: string, route_id: string, unit_id: string) {

    const shipmentRoutes = await fetchRoutesByShipmentId(shipment_id)

    shipmentRoutes.map(async(route) => {
        try {
            if(await isShipmentRouteUnitExists(shipment_id, route.id, unit_id)) {
                return { message: 'This unit is already selected'}
            } else {
                await sql`
                INSERT INTO shipment_route_units (shipment_id, route_id, unit_id) VALUES
                (${shipment_id}, ${route.id}, ${unit_id})
                `;
            }
        } catch (error) {
            return {
                message: 'Database Error: Failed to Add Unit to from Shipment Route Units.',
            };
        }   
    })

    revalidatePath(`/dashboard/shipments/${shipment_id}/edit/${route_id}/add_unit`);
    return { message: 'Unit added to all shipment routes' };
 
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

{/* Cities */}

export async function createCity(shipment_id: string, formData: CityTypeSchema) {
    
    const validatedFields = CityFormSchema.safeParse({
        name_eng: formData.name_eng,
        country_id: formData.country_id,
    });

    if(!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.format(),
        };
    }

    const { name_eng, country_id }
     = validatedFields.data;

    let city_id = await fetchCityIdByNameAndCountry(
        name_eng, country_id
    );

    if(city_id === '') {  
        try {
            await sql`
            INSERT INTO cities (name_eng, country_id) VALUES
            (${name_eng}, ${country_id})
            `;

        } catch (error) {
            console.log(error);
            return {
                message: 'Database error: Failed to Create City from Shipment.'
            };
        }

    } else {
        throw new Error('City already exists!')
    }

    revalidatePath(`/dashboard/shipments/${shipment_id}/edit/create_route`);
    redirect(`/dashboard/shipments/${shipment_id}/edit/create_route`);
}

{/* Currency Rates */}

export async function createCurrencyRate(formData: CurrencyRateTypeSchema) {
    
    const validatedFields = CurrencyRateFormSchema.safeParse({
        date: formData.date,
        eur_rate: formData.eur_rate,
        usd_rate: formData.usd_rate,
        uah_rate: formData.uah_rate,
        huf_rate: formData.huf_rate,
        organisation_id: formData.organisation_id,
    });

    if(!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.format(),
        };
    }

    const { date, eur_rate, usd_rate, uah_rate, huf_rate, organisation_id }
     = validatedFields.data;

    let currency_rate_id = await fetchCurrencyRateIdByDate(date);

    const formattedDate = date.toISOString().split('T')[0];

    const eurId = await fetchCurrencyIdByShortName('EUR')
    const usdId = await fetchCurrencyIdByShortName('USD')
    const uahId = await fetchCurrencyIdByShortName('UAH')
    const hufId = await fetchCurrencyIdByShortName('HUF')

    const eurRateInCents = Math.round(eur_rate * 100); 
    const usdRateInCents = Math.round(usd_rate * 100); 
    const uahRateInCents = Math.round(uah_rate * 100); 
    const hufRateInCents = Math.round(huf_rate * 100); 

    if(currency_rate_id === '') {  
        try {
            await sql`
            INSERT INTO currency_rates (date, rate, currency_id, organisation_id) VALUES
            (${formattedDate}, ${eurRateInCents}, ${eurId}, ${organisation_id}),
            (${formattedDate}, ${usdRateInCents}, ${usdId}, ${organisation_id}),
            (${formattedDate}, ${uahRateInCents}, ${uahId}, ${organisation_id}),
            (${formattedDate}, ${hufRateInCents}, ${hufId}, ${organisation_id})
            `;

        } catch (error) {
            console.log(error);
            return {
                message: 'Database error: Failed to Insert Currency Rates to Db.'
            };
        }

    } else {
        throw new Error('Currency rate already exists!')
    }

    revalidatePath(`/dashboard/invoices/currencies_rates/view`);
    redirect(`/dashboard/invoices/currencies_rates/view`);
}