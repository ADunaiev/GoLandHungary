import { z } from 'zod';

export const InvoiceFormSchema = z.object({
    customerId: z.string().min(1, {
        message: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than 0.' }),
    currency_rate: z.coerce
        .number()
        .gt(0, { message: 'Please enter rate greater then 0.'}),
    status: z.enum(['pending', 'paid'], {
        message: 'Please select an invoice status.',
      }),
    date: z.coerce.date({
        message: 'Please enter invoice date'
    }),
    remarks: z.string(),
    amount_wo_vat: z.coerce
        .number({message: 'Please enter number'})
        .nonnegative({message: 'Amount could not be negative'})
        .min(1, {message: 'Please enter amount'}),
    currency_id: z.string().min(1, {
        message: 'Please select currency'
    }),
    agreement_id: z.string(),
    organisation_id: z.string().min(1, {
        message: 'Please choose organsation'
    }),
    vat_amount: z.coerce
        .number({message: 'Please enter number'})
        .nonnegative("Amount should be not negative"),
    /*
    amount_managerial_wo_vat: z.coerce.number().
        gt(0, { message: 'Amount should be greater than 0.'}),
    amount_managerial_with_vat: z.coerce.number().
        gt(0, { message: 'Amount should be greater than 0.'}),
    */
    number: z.string(),
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