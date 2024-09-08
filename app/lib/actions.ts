'use server';

import { number, z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { InvoiceFormSchema, InvoiceRateFormSchema } from './schemas/schema';
import { fetchVatRateById } from './data';

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
        amount: formData.amount,
        status: formData.status,
        number: formData.number,
        date: formData.date,
        agreement_id: formData.agreement_id,
        amount_wo_vat: formData.amount_wo_vat,
        vat_amount: formData.vat_amount || 0,
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

    const { customerId, amount, status, number, date, agreement_id, amount_wo_vat, vat_amount, currency_id, organisation_id, remarks } = validatedFields.data;

    const amountInCents = amount * 100;
    const amountWoVatInCents = amount_wo_vat * 100;
    const amountVatInCents = vat_amount * 100;
    const formatedDate = date.toISOString().split('T')[0];

    try{
        await sql`
            INSERT INTO invoices (customer_id, amount, status, number, date, agreement_id, amount_wo_vat, vat_amount, currency_id, organisation_id, remarks)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${number}, ${formatedDate}, ${agreement_id}, ${amountWoVatInCents}, ${amountVatInCents}, ${currency_id}, ${organisation_id}, ${remarks})
        `;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.'
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        }
    }

    const {customerId, amount, status} = validatedFields.data;

    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    //throw new Error('Failed to delete invoice');

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted invoice' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice.',
        };
    }
    
    
}

export async function createInvoiceRate(invoice_number: string, formData: RateType) {
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

     revalidatePath('/dashboard/invoices/create');
     redirect('/dashboard/invoices/create');
}

export async function updateInvoiceRate(id: string, formData: FormData) {}

export async function deleteInvoiceRate(id: string) {}

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


