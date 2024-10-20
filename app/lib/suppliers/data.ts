import { sql } from "@vercel/postgres";
import { SupplierField, SupplierFull, SuppliersTableType } from "../definitions";
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
		  SUM(CASE WHEN si.status = 'pending' THEN si.amount_managerial_with_vat ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN si.status = 'paid' THEN si.amount_managerial_with_vat ELSE 0 END) AS total_paid
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

export async function isSupplierCodeExistsInDbEdit(
  code: string, id: string
) {
  try {
    const data = await sql`
    SELECT COUNT(id)
    FROM suppliers
    WHERE code = ${code} AND id <> ${id}
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

export async function fetchSupplierFullById(id: string) {
  try {
    const data = await sql<SupplierFull>`
      SELECT
        suppliers.id,
        suppliers.name_eng,
        suppliers.name_hun,
        suppliers.email,
        suppliers.image_url,
        suppliers.code,
        suppliers.address_eng,
        suppliers.address_hun,
        suppliers.eu_vat_number,
        suppliers.country_id
      FROM suppliers
      WHERE suppliers.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch supplier full by id.');
  }
}

export async function fetchSuppliers() {
  try {
    const data = await sql<SupplierField>`
      SELECT
        id,
        name_eng
      FROM suppliers
      ORDER BY name_eng ASC
    `;

    const suppliers = data.rows;
    return suppliers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all suppliers.');
  }
}

export async function insertSupplierInvoiceRate(expense_id: string, rate_id: string) {
  try {
    await sql`
      INSERT INTO supplier_invoice_rates (supplier_invoice_id, rate_id) VALUES
      (${expense_id}, ${rate_id})
    `;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to insert supplier invoice rate.');
  }
}