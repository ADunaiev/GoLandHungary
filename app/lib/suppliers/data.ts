import { sql } from "@vercel/postgres";
import { SupplierFull, SuppliersTableType } from "../definitions";
import { formatCurrency } from "../utils";

const ITEMS_PER_PAGE = 10;

export async function isSupplierExistsInSupplierInvoices(
    supplier_id: string) {
    try {
      const data = await sql`
      SELECT COUNT(supplier_id)
      FROM supplier_invoices
      WHERE supplier_id = ${supplier_id}
      `;
  
      if (Number(data.rows[0].count) === 0) {
        return false;
      } else {
        return true;
      }
    } catch(error) {
      console.error(error)
      throw new Error('Failed to check is supplier exists in Supplier Invoices.')
    }
  }
  
export async function isSupplierExistsInSupplierAgreements(
  supplier_id: string) {
  try {
    const data = await sql`
    SELECT COUNT(supplier_id)
    FROM supplier_agreements
    WHERE supplier_id = ${supplier_id}
    `;

    if (Number(data.rows[0].count) === 0) {
      return false;
    } else {
      return true;
    }
  } catch(error) {
    console.error(error)
    throw new Error('Failed to check is supplier exists in Suppliers Agreements.')
  }
}

export async function fetchFilteredSuppliers(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<SuppliersTableType>`
		SELECT
		  s.id,
		  s.name_eng,
		  s.email,
		  s.image_url,
		  COUNT(si.id) AS total_invoices,
		  SUM(CASE WHEN si.status = 'pending' THEN si.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN si.status = 'paid' THEN si.amount ELSE 0 END) AS total_paid
		FROM suppliers AS s
		LEFT JOIN supplier_invoices AS si ON s.id = si.supplier_id
		WHERE
		  s.name_eng ILIKE ${`%${query}%`} OR
		  s.email ILIKE ${`%${query}%`} 
		GROUP BY s.id, s.name_eng, s.email, s.image_url
		ORDER BY s.name_eng ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    const suppliers = data.rows.map((supplier) => ({
      ...supplier,
      total_pending: formatCurrency(supplier.total_pending),
      total_paid: formatCurrency(supplier.total_paid),
    }));

    return suppliers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch supplier table.');
  }
}

export async function fetchSuppliersPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
		FROM suppliers AS s
		WHERE
		  s.name_eng ILIKE ${`%${query}%`} OR
		  s.email ILIKE ${`%${query}%`} 
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of suppliers.');
  }
}

export async function isSupplierCodeExistsInDb(
  code: string) {
  try {
    const data = await sql`
    SELECT COUNT(id)
    FROM suppliers
    WHERE code = ${code}
    `;

    if (Number(data.rows[0].count) === 0) {
      return false;
    } else {
      return true;
    }
  } catch(error) {
    console.error(error)
    throw new Error('Failed to check is supplier code exists in database.')
  }
}