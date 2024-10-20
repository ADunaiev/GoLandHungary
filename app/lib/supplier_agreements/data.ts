/* Suppliers agreements */

import { sql } from "@vercel/postgres";
import { SupplierAgreement } from "../definitions";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredSuppliersAgreements(
    query: string,
    currentPage: number,
  ) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    
    try {
      const data = await sql<SupplierAgreement>`
        SELECT 
        sa.id,
        sa.number,
        sa.date,
        sa.validity,
        sa.organisation_id,
        o.name_eng as organisation_name,
        sa.supplier_id,
        s.name_eng as supplier_name
        FROM supplier_agreements AS sa
        LEFT JOIN organisations AS o ON sa.organisation_id = o.id
        LEFT JOIN suppliers AS s ON sa.supplier_id = s.id
        WHERE
            sa.number ILIKE ${`%${query}%`} OR
            sa.date::text ILIKE ${`%${query}%`} OR
            sa.validity::text ILIKE ${`%${query}%`} OR
            o.name_eng ILIKE ${`%${query}%`} OR
            s.name_eng ILIKE ${`%${query}%`} 
        ORDER BY sa.number DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
  
      const agreements = data.rows;
  
      return agreements;
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to fetch filtered suppliers agreements.');
    }
  }
  
export async function isSupplierAgreementExistsInInvoices(
  id: string) {
  try {
    const data = await sql`
    SELECT COUNT(agreement_id)
    FROM supplier_invoices
    WHERE agreement_id = ${id}
    `;

    if (Number(data.rows[0].count) === 0) {
      return false;
    } else {
      return true;
    }
  } catch(error) {
    console.error(error)
    throw new Error('Failed to check is supplier agreement exists in Invoices.')
  }
}

export async function fetchSuppliersAgreementsPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
      FROM supplier_agreements AS sa
      LEFT JOIN organisations AS o ON sa.organisation_id = o.id
      LEFT JOIN suppliers AS s ON sa.supplier_id = s.id
      WHERE
          sa.number ILIKE ${`%${query}%`} OR
          sa.date::text ILIKE ${`%${query}%`} OR
          sa.validity::text ILIKE ${`%${query}%`} OR
          o.name_eng ILIKE ${`%${query}%`} OR
          s.name_eng ILIKE ${`%${query}%`} 
      `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of suppliers agreements.');
  }
}

export async function fetchSuppliersAgreementsBySupplierId(
  supplier_id: string,
) {
  
  try {
    const data = await sql<SupplierAgreement>`
    SELECT 
        sa.id,
        sa.number,
        sa.date,
        sa.validity,
        sa.organisation_id,
        o.name_eng as organisation_name,
        sa.supplier_id,
        s.name_eng as supplier_name
    FROM supplier_agreements AS sa
    LEFT JOIN organisations AS o ON sa.organisation_id = o.id
    LEFT JOIN suppliers AS s ON sa.supplier_id = s.id
		WHERE
      s.id = ${supplier_id}
		ORDER BY sa.number DESC
	  `;

    const agreements = data.rows;

    return agreements;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch suppliers agreements by supplier id.');
  }
}

export async function fetchSupplierAgreementById(id: string) {
  try {
    const data = await sql<SupplierAgreement>`
      SELECT 
      sa.id,
      sa.number,
      sa.date,
      sa.validity,
      sa.organisation_id,
      o.name_eng as organisation_name,
      sa.supplier_id,
      s.name_eng as supplier_name
      FROM supplier_agreements AS sa
      LEFT JOIN organisations AS o ON sa.organisation_id = o.id
      LEFT JOIN suppliers AS s ON sa.supplier_id = s.id
      WHERE sa.id = ${id};
    `;

    const agreement = data.rows;
    return agreement[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch supplier agreement by id.');
  }
}

export async function fetchSupplierAgreements() {
  try {
    const data = await sql<SupplierAgreement>`
    SELECT sa.id, sa.number, sa.date, sa.validity, 
    sa.organisation_id, sa.supplier_id
    FROM supplier_agreements as sa
    ORDER BY sa.number ASC
    `;

    const agreements = data.rows;

    return agreements;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch supplier agreements.');
  }
}