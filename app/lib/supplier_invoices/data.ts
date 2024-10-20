import { sql } from "@vercel/postgres";
import { SupplierInvoicesTable } from "../definitions";

const ITEMS_PER_PAGE = 10

export async function fetchSupplierInvoicesPages(query: string) {
    try {
        const count = await sql`SELECT COUNT(*)
        FROM supplier_invoices as si
        JOIN suppliers as s ON si.supplier_id = s.id
        WHERE
            s.name_eng ILIKE ${`%${query}%`} OR
            s.email ILIKE ${`%${query}%`} OR
            si.amount::text ILIKE ${`%${query}%`} OR
            si.date::text ILIKE ${`%${query}%`} OR
            si.status ILIKE ${`%${query}%`}
            `;
  
        const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch total number of supplier invoices.');
    }
}

export async function fetchFilteredSupplierInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<SupplierInvoicesTable>`
      SELECT
        si.id,
        si.amount,
        si.date,
        si.number,
        si.status,
        s.id as supplier_id,
        s.name_eng,
        s.email,
        s.image_url,
        cur.short_name
      FROM supplier_invoices as si
      JOIN suppliers as s ON si.supplier_id = s.id
      JOIN currencies as cur ON si.currency_id = cur.id
      WHERE
        s.name_eng ILIKE ${`%${query}%`} OR
        s.email ILIKE ${`%${query}%`} OR
        si.amount::text ILIKE ${`%${query}%`} OR
        si.date::text ILIKE ${`%${query}%`} OR
        si.status ILIKE ${`%${query}%`} OR
        si.number ILIKE ${`%${query}%`} OR
        cur.short_name ILIKE ${`%${query}%`} 
      ORDER BY si.date DESC, si.number DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch supplier invoices.');
  }
}

export async function fetchSupplierInvoiceIdByNumber(number: string) {
  try {
      const expense = await sql`SELECT id
      FROM supplier_invoices
      WHERE
        number = ${number}
      `;

      return String(expense.rows[0].id);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of supplier invoices.');
  }
}