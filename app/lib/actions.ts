'use server';

import { number, z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { InvoiceFormSchema } from './schemas/schema';

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


