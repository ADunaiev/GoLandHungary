import { z, ZodType } from 'zod';
import { zfd } from 'zod-form-data'
import { firstDayInPreviousMonth, maxDayForInvoicePayment } from '../utils';

export const InvoiceFormSchema = z.object({
    customerId: z.string().min(1, {
        message: 'Please select a customer.',
    }),
    /*  amount: z.coerce
            .number()
            .gt(0, { message: 'Please enter an amount greater than 0.' }),

        amount_wo_vat: z.coerce
            .number({message: 'Please enter number'})
            .nonnegative({message: 'Amount could not be negative'})
            .min(1, {message: 'Please enter amount'}),

        vat_amount: z.coerce
            .number({message: 'Please enter number'})
            .nonnegative("Amount should be not negative"),

        currency_rate: z.coerce
            .number()
            .gt(0, { message: 'Please enter rate greater then 0.'}), */
    status: z.enum(['pending', 'paid'], {
        message: 'Please select an invoice status.',
      }),
    date: z
        .coerce.date({
            message: 'Please enter invoice date'
        })
        .min(firstDayInPreviousMonth(), {
            message: `Min date is ${(firstDayInPreviousMonth()).toISOString().split('T')[0]}`
        })
        .max(new Date(), {
            message: 'You could not choose future date'
        }),
    performance_date: z
        .coerce.date({
        message: 'Please enter performance date'
        })
        .min(firstDayInPreviousMonth(), {
            message: `Min date is ${(firstDayInPreviousMonth()).toISOString().split('T')[0]}`
        })
        .max(new Date(), {
            message: 'You could not choose future date'
        }),
        
    payment_date: z
        .coerce.date({
            message: 'Please enter payment date'
        })
        .min(new Date(), {
            message: 'Please choose future date'
        })
        .max(maxDayForInvoicePayment(), {
            message: `Max date is ${(maxDayForInvoicePayment()).toISOString().split('T')[0]}`
        }),
    remarks: z.string(),

    currency_id: z.string().min(1, {
        message: 'Please select currency'
    }),
    agreement_id: z.string(),
    organisation_id: z.string().min(1, {
        message: 'Please choose organsation'
    }),

    /*
    amount_managerial_wo_vat: z.coerce.number().
        gt(0, { message: 'Amount should be greater than 0.'}),
    amount_managerial_with_vat: z.coerce.number().
        gt(0, { message: 'Amount should be greater than 0.'}),
    */
    //number: z.string(),
    });

export type InvoiceType = z.infer<typeof InvoiceFormSchema>;

export const InvoiceRateFormSchema = z.object({
    shipment_id: z.string(),
    service_id: z.string()
        .min(1, { message: 'Please choose a service' }),
    rate: z.coerce
        .number({ message: 'Please enter number' })
        .positive({ message: 'Please enter positive number'}),
    currency_id: z.string()
        .min(1, { message: 'Please choose a currency' }),
    vat_rate_id: z.string()
        .min(1, { message: 'Please choose a vat rate' }),
    route_id: z.string(),
    quantity: z.coerce
        .number({ message: 'Please enter number' })
        .positive({ message: 'Please enter positive value' }),
});

export type RateType = z.infer<typeof InvoiceRateFormSchema>;

export const RateFormSchemaForShipment = InvoiceRateFormSchema.omit({shipment_id: true});
export type RateTypeForShipment = z.infer<typeof RateFormSchemaForShipment>

export const ShipmentFormSchema = z.object({
    customerId: z.string().min(1, {
        message: 'Please select a customer',
    }),
    salesId: z.string().min(1, {
        message: 'Please select a sale',
    }),
    documentationId: z.string().min(1, {
        message: 'Please select a documentation',
    }),
    organisation_id: z.string().min(1, {
        message: 'Please choose organsation'
    }),
    date: z.coerce.date({
        message: 'Please enter shipment date'
    }),
    status: z.enum(['in_process', 'delivered'], {
        message: 'Please select an shipment status.',
    }),
    remarks: z.string(),
    customer_reference: z.string(),
});

export const RateTypeWithoutRouteSchema = RateFormSchemaForShipment.omit({route_id: true})
export type RateTypeWithoutRoute = z.infer<typeof RateTypeWithoutRouteSchema>

export type ShipmentType = z.infer<typeof ShipmentFormSchema>;

export const RouteFormSchema = z.object({
    start_city_id: z.string()
        .min(1, { message: 'Please choose a service' }),
    end_city_id: z.string()
        .min(1, { message: 'Please choose a currency' }),
    transport_type_id: z.string()
        .min(1, { message: 'Please choose a vat rate' }),
});

export type RouteTypeSchema = z.infer<typeof RouteFormSchema>

export const UnitFormSchema = z.object({
    number: z.string()
        .min(1, { message: 'Please enter number' })
        .regex(new RegExp('^[a-zA-Z0-9- ]*$'), 'Please use only latin letters or numbers'),
    unit_type_id: z.string()
        .min(1, { message: 'Please choose a type' }),
});

export type UnitTypeSchema = z.infer<typeof UnitFormSchema>

export const VehicleFormSchema = z.object({
    number: z.string()
        .min(1, { message: 'Please enter number' })
        .regex(new RegExp(/^[a-zA-Z0-9-+() ]{2,40}$/), 'Please use only latin letters or numbers'),
    vehicle_type_id: z.string()
        .min(1, { message: 'Please choose a type' }),
    transport_type_id: z.string()
        .min(1, { message: 'Please choose a type' }),
});

export type VehicleTypeSchema = z.infer<typeof VehicleFormSchema>

export const DriverFormSchema = z.object({
    name_eng: z.string()
        .min(1, { message: 'Please enter name' })
        .regex(new RegExp(/^[a-zA-Z]{2,40} [a-zA-Z]{2,40}$/), 'Please use only latin letters'),
    phone: z.string()
        .min(1, { message: 'Please enter phone' })
        .regex(new RegExp('[0-9- +()]'), 'Wrong phone format'),
});

export type DriverTypeSchema = z.infer<typeof DriverFormSchema>

export const CityFormSchema = z.object({
    name_eng: z.string()
        .min(1, { message: 'Please enter name' })
        .regex(new RegExp(/^[a-zA-Z0-9- ]*$/), 'Please use only latin letters'),
    country_id: z.string()
        .min(1, { message: 'Please enter country' }),
});

export type CityTypeSchema = z.infer<typeof CityFormSchema>

export const CurrencyRateFormSchema = z.object({
    date: z.coerce.date({
        message: 'Please enter date'
    }),
    eur_rate: z.coerce
        .number({ message: 'Please enter number' })
        .positive({ message: 'Please enter positive number'}),
    usd_rate: z.coerce
        .number({ message: 'Please enter number' })
        .positive({ message: 'Please enter positive number'}),
    uah_rate: z.coerce
        .number({ message: 'Please enter number' })
        .positive({ message: 'Please enter positive number'}),
    huf_rate: z.coerce
        .number({ message: 'Please enter number' })
        .positive({ message: 'Please enter positive number'}),
    organisation_id: z.string()
        .min(1, { message: 'Please choose an organisation' }),
});

export type CurrencyRateTypeSchema = z.infer<typeof CurrencyRateFormSchema>

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const CustomerFormSchema = z.object({
    name_eng: z.string().min(1, {
        message: 'Please enter name',
    }),
    email: z.string().email({
        message: 'Please use correct email format'
    }),
    code: z.string().min(1, {
        message: 'Please enter a code',
    }),
    address_eng: z.string().min(1, {
        message: 'Please enter an address',
    }),
    country_id: z.string().min(1, {
        message: 'Please select country',
    }),
    name_hun: z.string(),
    address_hun: z.string(),
    vat_number_eu: z.string(),
});

export type CustomerTypeSchema = z.infer<typeof CustomerFormSchema>;

export const CustomerAgreementFormSchema = z.object({
    number: z.string().min(1, {
        message: 'Please enter number',
    }),
    date: z.coerce.date({
        message: 'Please enter agreement date'
    }),
    validity: z.coerce.date({
        message: 'Please enter validity date'
    }),
    organisation_id: z.string().min(1, {
        message: 'Please select organisation',
    }),
    customer_id: z.string().min(1, {
        message: 'Please select customer',
    }),
});

export type CustomerAgreementType = z.infer<typeof CustomerAgreementFormSchema>;

/*
export const CustomerFormSchemaZfd = zfd.formData({
    name_eng: zfd.text(z.string().min(1, {
        message: 'Please enter name',
    })),
    email: z.string().email({
        message: 'Please use correct email format'
    }),
    code: z.string().min(1, {
        message: 'Please enter a code',
    }),
    address_eng: z.string().min(1, {
        message: 'Please enter an address',
    }),
    country_id: z.string().min(1, {
        message: 'Please select country',
    }),
    image: zfd
        .file(z.instanceof(FileList)),
    name_hun: z.string(),
    address_hun: z.string(),
    vat_number_eu: z.string(),
});

export type CustomerTypeSchemaZfd = z.infer<typeof CustomerFormSchemaZfd>;
*/



