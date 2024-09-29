import { sql } from '@vercel/postgres';
import {
  CustomerAgreement,
  CurrencyField,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  CustomerAgreementField,
  OrganisationField,
  RateTable,
  ServiceField,
  VatField,
  RouteField,
  ShipmentField,
  InvoiceTypeFull,
  CurrencyRateField,
  Rate,
  InvoiceRateDbData,
  BankAccount,
  OrganisationFull,
  CustomerFull,
  Currency,
  ShipmentTypeFull,
  UserField,
  RouteFullType,
  CityField,
  TransportTypeField,
} from './definitions';
import { formatCurrency } from './utils';
import { RateType } from './schemas/schema';
import { getRandomValues } from 'crypto';
import { cache } from 'react';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        i.id,
        i.amount,
        i.date,
        i.number,
        i.status,
        cust.name,
        cust.email,
        cust.image_url,
        cur.short_name
      FROM invoices as i
      JOIN customers as cust ON i.customer_id = cust.id
      JOIN currencies as cur ON i.currency_id = cur.id
      WHERE
        cust.name ILIKE ${`%${query}%`} OR
        cust.email ILIKE ${`%${query}%`} OR
        i.amount::text ILIKE ${`%${query}%`} OR
        i.date::text ILIKE ${`%${query}%`} OR
        i.status ILIKE ${`%${query}%`} OR
        i.number ILIKE ${`%${query}%`} OR
        cur.short_name ILIKE ${`%${query}%`} 
      ORDER BY i.number DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    console.log(invoice);
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchInvoiceFullById(id: string) {
  try {
    const data = await sql<InvoiceTypeFull>`
    SELECT * FROM invoices
    WHERE id = ${id}
    `;

    return data.rows[0];
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch invoice full by id.');
  }
}

export async function fetchRateById(id: string) {
  try {
    const data = await sql<Rate>`
    SELECT 
      id,
      shipment_id,
      service_id,
      rate,
      currency_id,
      vat_rate_id,
      route_id,
      quantity
    FROM rates
    WHERE id = ${id}
    `;

    const rate = data.rows.map((rate) => ({
      ...rate,
      rate: rate.rate / 100
    }));
    console.log(rate);
    return rate[0];
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch rate by id.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchCurrencies() {
  try {
    const data = await sql<CurrencyField>`
      SELECT
        id,
        short_name
      FROM currencies
      ORDER BY short_name ASC
    `;

    const currencies = data.rows;
    return currencies;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch currencies.');
  }
}

export async function fetchServices() {
  try {
    const data = await sql<ServiceField>`
      SELECT
        id,
        name_eng
      FROM services
      ORDER BY name_eng ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch services.');
  }
}

export async function fetchVatRates() {
  try {
    const data = await sql<VatField>`
      SELECT
        id,
        name_eng,
        rate
      FROM vat_rates
      ORDER BY name_eng ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch vat rates.');
  }
}

export async function fetchVatRateById(id: string) {
  try {
    const data = sql<VatField>`
    SELECT id, name_eng, rate
    FROM vat_rates
    WHERE id = ${id}
    `;

    return (await data).rows[0];
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch vat rate by id');
  }
}

export async function fetchOrganisations() {
  try {
    const data = await sql<OrganisationField>`
      SELECT
        id,
        name_eng
      FROM organisations
      ORDER BY name_eng ASC
    `;

    const organisations = data.rows;
    return organisations;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch organisations.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchAgreementsByCusomerIdAndOrganisationId(
        customer_id: string, 
        organisation_id: string
) {
  try {
    const data = await sql<CustomerAgreementField>`
    SELECT ca.id, ca.number ||' dd. ' || ca.date as number_and_date
    FROM customers_agreements as ca
    LEFT JOIN customers as c
    ON ca.customer_id = c.id
    WHERE cast(ca.organisation_id as text) ILIKE ${`%${organisation_id}}%`} OR 
    cast(ca.customer_id as text) ILIKE ${`%${customer_id}%`}
    ORDER BY ca.date ASC
	  `;

    const agreements = data.rows;

    return agreements;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch agreements by customerId and organisationId.');
  }
}

export async function fetchAgreementsByCusomerNameAndOrganisationName(
  customer_name: string, 
  organisation_name: string
) {
  try {
    const data = await sql<CustomerAgreementField>`
    SELECT ca.id, ca.number ||' dd. ' || ca.date as number_and_date
    FROM customers_agreements as ca
    LEFT JOIN customers as c
    ON ca.customer_id = c.id
    LEFT JOIN organisations as o
    ON ca.organisation_id = o.id
    WHERE cast(o.name_eng as text) ILIKE ${`%${organisation_name}%`} AND 
    cast(c.name as text) ILIKE ${`%${customer_name}%`}
    ORDER BY ca.date ASC
    `;

    const agreements = data.rows;

    return agreements;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch agreements by customerId and organisationId.');
  }
}

export async function fetchInvoiceRatesByInvoiceNumber(invoice_number: string) {
  try {
    const data = await sql<RateTable>`
    SELECT r.id, s.id as shipment_id, s.number as shipment_number,
    ro.id as route_id, c1.name_eng as start_point_name,
    c2.name_eng as end_point_name, se.id as service_id, 
    se.name_eng as service_name, r.rate as rate,
    cu.id as currency_id, cu.short_name as currency_name,
    vr.id as vat_rate_id, vr.rate as vat_rate_rate,
    vr.name_eng as vat_rate_name, r.quantity
    FROM rates as r
    LEFT JOIN shipments as s
    ON r.shipment_id = s.id
    LEFT JOIN routes as ro
    ON r.route_id = ro.id
    LEFT JOIN cities as c1
    ON ro.start_city_id = c1.id
    LEFT JOIN cities as c2
    ON ro.end_city_id = c2.id
    LEFT JOIN services as se
    ON r.service_id = se.id
    LEFT JOIN currencies as cu
    ON r.currency_id = cu.id
    LEFT JOIN vat_rates as vr
    ON r.vat_rate_id = vr.id
    LEFT JOIN invoice_rates as ir
    ON r.id = ir.rate_id
    WHERE r.invoice_number = ${invoice_number}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch rates for the invoice.');
  }
}

export async function fetchInvoiceNumber() {
  try {
    const oldInvoice = await sql`
    select max(number)
    from invoices
    where customer_id NOTNULL
    `;
    

    let oldNumber: string = oldInvoice.rows[0].max;
    //console.log('oldNumber = ', oldInvoice.rows[0].max);

    if(oldNumber.trim() === '') { oldNumber = 'GH_000001'}

    const newNumber = Number(oldNumber.slice(3,9)) + 1;
    //console.log('newNumber = ', newNumber)
    
    const newNumberString = '00000' + String(newNumber);
    const length = newNumberString.length;

    const newStyledNumber = 'GH_' + newNumberString.slice(length-6,length)
    
    return newStyledNumber;
  } catch(error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoice number.');
  }
}

export async function fetchRoutes() {
  try {
    const data = await sql<RouteField>`
    SELECT r.id, c1.name_eng || ' - ' || c2.name_eng as start_end
    FROM routes as r
    LEFT JOIN cities as c1
    ON r.start_city_id = c1.id
    LEFT JOIN cities as c2
    ON r.end_city_id = c2.id
    ORDER BY start_end ASC
    `;

    return data.rows;
  } catch(error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch routes.');
  }
}

export async function fetchShipments() {
  try {
    const data = await sql<ShipmentField>`
    SELECT id, number || ' dd. ' || date as number_date
    FROM shipments
    ORDER BY number_date DESC
    `;

    return data.rows;
  } catch(error) {
    console.log('Database error', error);
    throw new Error('Failed to fetch shipments');
  }
}

export async function fetchInvoiceByNumber(number: string) {
  try {
    const data = await sql<InvoiceTypeFull>`
    SELECT * FROM invoices
    WHERE number = ${number}
    `;

    return data.rows[0];
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch invoice by number');
  }
}

export async function createInvoiceDraft() {
  try {

    const invoiceNumber = await fetchInvoiceNumber();
    const invoice = await fetchInvoiceByNumber(invoiceNumber);

    if(invoice == null) {
      await sql`
      INSERT INTO invoices (number) VALUES
      (${invoiceNumber})
      `;
    }
    return invoiceNumber;
  } catch(error) {
      console.log('Database error: ', error);
      throw new Error('Failed to create invoice draft');
  }
}

export async function fetchInvoiceDraft() {
  try {
    const invoiceNumber = await createInvoiceDraft();

    const data = await sql<InvoiceTypeFull>`
    SELECT * 
    FROM invoices
    WHERE number = ${`${invoiceNumber}`}
    `;

    return data.rows[0];
  } catch(error) {
    console.log('Database error', error);
    throw new Error('Failed to fetch invoice draft');
  }
}

export async function fetchCurrenciesRates() {
  try {
    const data = await sql<CurrencyRateField>`
    select c.id, cr.organisation_id, cr.currency_id, cr.rate, cr.date
    from currency_rates as cr
    left join currencies as c
    on cr.currency_id = c.id
    `;

    return data.rows;
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch currencies rates');
  }
}

export async function saveInvoiceRatesToDb(
  invoice_number: string, 
  date: Date,
  organisation_id: string,
  invoice_currency_id: string
) {
  try {
    const invoice = await fetchInvoiceByNumber(invoice_number);
    const rates = await fetchRatesByInvoiceNumber(invoice_number);
    const currencies = await fetchCurrenciesRatesByDate(date, organisation_id);
    const vat_rates = await fetchVatRates();
    const invoice_currency_rate = currencies.find(c => c.currency_id == invoice_currency_id)?.rate || 1;

    rates.map(async (rate) => {
      const rate_currency = currencies.find(c => c.currency_id == rate.currency_id)?.rate || 1;
      const rate_vat_rate = vat_rates.find(vr => vr.id == rate.vat_rate_id)?.rate || 0;
      const net_unit = Math.round(rate.rate * rate_currency / invoice_currency_rate);
      const net_line = net_unit * rate.quantity;
      const vat_value = Math.round(net_line * rate_vat_rate / 10000);
      const gross_value = net_line + vat_value;

      await sql`
      INSERT INTO invoice_rates (invoice_id, rate_id, currency_rate, net_unit, net_line, vat_value, gross_value) VALUES
      (${invoice.id}, ${rate.id}, ${rate_currency}, ${net_unit}, ${net_line}, ${vat_value}, ${gross_value})
      `;

    });

  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to save invoice rates to database.');
  }
}

export async function deleteInvoiceRatesFromDb(invoice_id: string) {
  try {
    await sql`DELETE FROM invoice_rates WHERE invoice_id = ${invoice_id}`;

  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to delete invoice rates from database.');
  }
}

export async function fetchRatesByInvoiceNumber(invoice_number: string) {
  try {
    const data = await sql<Rate>`
    SELECT id, shipment_id, service_id, rate, currency_id, vat_rate_id, route_id, quantity
    FROM rates
    WHERE invoice_number = ${invoice_number}
    `;

    return data.rows;
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch rates by invoice number.');
  }
}

export async function fetchCurrenciesRatesByDate(date: Date, organisation_id: string) {
  try {
    const formatedDate = date.toISOString().split('T')[0];

    const data = await sql<CurrencyRateField>`
    SELECT id, organisation_id, currency_id, rate, date
    FROM currency_rates
    WHERE date <= ${formatedDate} AND organisation_id = ${organisation_id} 
    ORDER BY date DESC
    LIMIT 4
    `;

    return data.rows;
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch currencies rates by date.');
  }
}

export async function fetchInvoiceRatesByInvoiceId(id: string) {
  try {
    const data = await sql<InvoiceRateDbData>`
    SELECT * 
    FROM invoice_rates
    WHERE invoice_id = ${id}
    `;

    return data.rows;
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch invoice rates data.');
  }
}

export async function fetchCurrencyRateByDateOrganisationCurrency(date: Date, organisation_id: string, currency_id: string) {
  try {
    const formatedDate = date.toISOString().split('T')[0];

    const data = await sql<CurrencyRateField>`
    SELECT id, organisation_id, currency_id, rate, date
    FROM currency_rates
    WHERE date = ${formatedDate} AND organisation_id = ${organisation_id} 
    AND currency_id = ${currency_id}
    `;

    return data.rows[0];
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch currency rate by date, organisation and currency.');
  }
}

export async function fetchManagerialCurrencyIdByOrganisationId(organisation_id: string) {
  try {
    const data = await sql`
    SELECT managerial_currency_id
    FROM organisations
    WHERE id = ${organisation_id}
    `;

    return String(data.rows[0].managerial_currency_id);
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch managerial currency rate.');
  }
}

export async function fetchInvoiceNumberByRateId(rate_id: string) {
  try {
    const data = await sql`
    SELECT invoice_number
    FROM rates
    WHERE id = ${rate_id}
    `;

    return String(data.rows[0].invoice_number);
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch invoice number by rate id.')
  }
}

export async function fetchCustomerById(id: string) {
  try {
    const data = await sql<CustomerField>`
      SELECT
        customers.id,
        customers.name
      FROM customers
      WHERE customers.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer by id.');
  }
}

export async function fetchCustomerFullById(id: string) {
  try {
    const data = await sql<CustomerFull>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        customers.code,
        customers.address_eng,
        customers.vat_number_eu
      FROM customers
      WHERE customers.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer full by id.');
  }
}

export async function fetchCurrencyById(id: string) {
  try {
    const data = await sql<CurrencyField>`
      SELECT
        currencies.id,
        currencies.short_name
      FROM currencies
      WHERE currencies.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch currency by id.');
  }
}

export async function fetchCurrencyFullById(id: string) {
  try {
    const data = await sql<Currency>`
      SELECT
        currencies.id,
        currencies.name_eng,
        currencies.name_hun,
        currencies.short_name
      FROM currencies
      WHERE currencies.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch currency full by id.');
  }
}

export async function fetchAgreementById(id: string) {
  try {
    const data = await sql<CustomerAgreementField>`
      SELECT
        customers_agreements.id,
        customers_agreements.number || ' dd. ' || customers_agreements.date as number_and_date
      FROM customers_agreements
      WHERE customers_agreements.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch agreement by id.');
  }
}

export async function fetchOrganisationById(id: string) {
  try {
    const data = await sql<OrganisationField>`
      SELECT
        organisations.id,
        organisations.name_eng
      FROM organisations
      WHERE organisations.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch organisation by id.');
  }
}

export async function fetchCurrencyRateById(id: string) {
  try {
    const data = await sql<CurrencyRateField>`
      SELECT
        currency_rates.id,
        currency_rates.organisation_id,
        currency_rates.currency_id,
        currency_rates.rate,
        currency_rates.date
      FROM currency_rates
      WHERE currency_rates.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch currency rate by id.');
  }
}

export async function fetchBankAccountsByCurrencyIdAndOrganisationId(
  currency_id: string, 
  organisation_id: string
) {
  try {
    const data = await sql<BankAccount>`
    SELECT ba.id, ba.organisation_id, ba.bank_name, ba.iban, ba.currency_id, 
    ba.bank_address, ba.swift
    FROM bank_accounts as ba
    WHERE ba.currency_id = ${currency_id} AND 
    ba.organisation_id = ${organisation_id} AND 
    ba.is_valid = true
    `;

    return data.rows[0] || null;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch bank accounts by currency id and organisation id.');
  }
}

export async function fetchOrganisationFullById(id: string) {
  try {
    const data = await sql<OrganisationFull>`
    SELECT id, name_eng, address, code, vat_number_eu, vat_number_local, ceo_name, email
    FROM organisations
    WHERE id = ${id}
    `;

    return data.rows[0];
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch organisation full by id.');
  }
}

export async function fetchShipmentsFullType() {
  try {
    const data = await sql<ShipmentTypeFull>`
    SELECT s.id, s.number, s.date, c.id as customer_id, 
    c.name as customer_name_eng, u1.id as sales_id,
    u1.name as sales_name_eng, u2.id as documentation_id,
    u2.name as documentation_name_eng, s.remarks,
    o.id as organisation_id, o.name_eng as organisation_name_eng
    FROM public.shipments as s
    LEFT JOIN customers as c
    ON s.customer_id = c.id
    LEFT JOIN users as u1
    on s.sale_id = u1.id
    LEFT JOIN users as u2
    on s.documentation_id = u2.id
    LEFT JOIN organisations as o
    on s.organisation_id = o.id
    `;

    return data.rows;
  } catch(error) {
    console.log('Database error', error);
    throw new Error('Failed to fetch shipments full type');
  }
}

export async function fetchFilteredShipments(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<ShipmentTypeFull>`
      SELECT 
        s.id, 
        s.number, 
        s.date, 
        c.id as customer_id, 
        c.name as customer_name_eng, 
        u1.id as sales_id,
        u1.name as sales_name_eng, 
        u2.id as documentation_id,
        u2.name as documentation_name_eng, 
        s.remarks,
        o.id as organisation_id, 
        o.name_eng as organisation_name_eng,
        s.status
      FROM public.shipments as s
      LEFT JOIN customers as c ON s.customer_id = c.id
      LEFT JOIN users as u1 on s.sale_id = u1.id
      LEFT JOIN users as u2 on s.documentation_id = u2.id
      LEFT JOIN organisations as o on s.organisation_id = o.id
      WHERE
        s.number ILIKE ${`%${query}%`} OR
        s.date::text ILIKE ${`%${query}%`} OR
        c.name ILIKE ${`%${query}%`} OR
        u1.name ILIKE ${`%${query}%`} OR
        u2.name ILIKE ${`%${query}%`} OR
        s.remarks ILIKE ${`%${query}%`} OR
        s.status ILIKE ${`%${query}%`} OR
        o.name_eng ILIKE ${`%${query}%`}
      ORDER BY s.number DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered shipments.');
  }
}

export async function fetchShipmentsPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM public.shipments as s
    LEFT JOIN customers as c ON s.customer_id = c.id
    LEFT JOIN users as u1 on s.sale_id = u1.id
    LEFT JOIN users as u2 on s.documentation_id = u2.id
    LEFT JOIN organisations as o on s.organisation_id = o.id
    WHERE
      s.number ILIKE ${`%${query}%`} OR
      s.date::text ILIKE ${`%${query}%`} OR
      c.name ILIKE ${`%${query}%`} OR
      u1.name ILIKE ${`%${query}%`} OR
      u2.name ILIKE ${`%${query}%`} OR
      s.remarks ILIKE ${`%${query}%`} OR
      s.status ILIKE ${`%${query}%`} OR
      o.name_eng ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of shipments.');
  }
}

export async function fetchSales() {
  try {
    const data = await sql<UserField>`
      SELECT
        id,
        name
      FROM users
      WHERE is_sale = true
      ORDER BY name ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch sales.');
  }
}

export async function fetchDocumentations() {
  try {
    const data = await sql<UserField>`
      SELECT
        id,
        name
      FROM users
      WHERE is_documentation = true
      ORDER BY name ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch documentations.');
  }
}

export async function fetchShipmentNumber() {
  try {
    const oldShipment = await sql`
    select max(number)
    from shipments
    where customer_id NOTNULL
    `;
    

    let oldNumber: string = oldShipment.rows[0].max;
    //console.log('oldNumber = ', oldInvoice.rows[0].max);

    if(oldNumber.trim() === '') { oldNumber = '000001'}

    const newNumber = Number(oldNumber.slice(0,6)) + 1;
    //console.log('newNumber = ', newNumber)
    
    const newNumberString = '00000' + String(newNumber);
    const length = newNumberString.length;

    const newStyledNumber = newNumberString.slice(length-6,length)
    
    return newStyledNumber;
  } catch(error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch shipment number.');
  }
}

export async function fetchShipmentFullById(id: string) {
  try {
    const data = await sql<ShipmentTypeFull>`
    SELECT s.id, s.number, s.date, c.id as customer_id, 
    c.name as customer_name_eng, u1.id as sales_id,
    u1.name as sales_name_eng, u2.id as documentation_id,
    u2.name as documentation_name_eng, s.remarks,
    o.id as organisation_id, o.name_eng as organisation_name_eng,
    s.customer_reference, s.status
    FROM public.shipments as s
    LEFT JOIN customers as c
    ON s.customer_id = c.id
    LEFT JOIN users as u1
    on s.sale_id = u1.id
    LEFT JOIN users as u2
    on s.documentation_id = u2.id
    LEFT JOIN organisations as o
    on s.organisation_id = o.id
    WHERE s.id = ${id}
    `;
    
    return data.rows[0];
  } catch(error) {
    console.log('Database error: ', error);
    throw new Error('Failed to fetch shipment full by id.');
  }
}

export async function fetchRatesByShipmentId(id: string) {
  try {
    const data = await sql<RateTable>`
    SELECT r.id, s.id as shipment_id, s.number as shipment_number,
    ro.id as route_id, c1.name_eng as start_point_name,
    c2.name_eng as end_point_name, se.id as service_id, 
    se.name_eng as service_name, r.rate as rate,
    cu.id as currency_id, cu.short_name as currency_name,
    vr.id as vat_rate_id, vr.rate as vat_rate_rate,
    vr.name_eng as vat_rate_name, r.quantity
    FROM rates as r
    LEFT JOIN shipments as s
    ON r.shipment_id = s.id
    LEFT JOIN routes as ro
    ON r.route_id = ro.id
    LEFT JOIN cities as c1
    ON ro.start_city_id = c1.id
    LEFT JOIN cities as c2
    ON ro.end_city_id = c2.id
    LEFT JOIN services as se
    ON r.service_id = se.id
    LEFT JOIN currencies as cu
    ON r.currency_id = cu.id
    LEFT JOIN vat_rates as vr
    ON r.vat_rate_id = vr.id
    LEFT JOIN invoice_rates as ir
    ON r.id = ir.rate_id
    WHERE r.shipment_id = ${id}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch rates by shipment id.');
  }
}

export async function fetchShipmentById(id: string) {
  try {
    const data = await sql<ShipmentField>`
    SELECT id, number || ' dd. ' || date as number_date
    FROM shipments
    WHERE id = ${id}
    `;

    return data.rows[0];
  } catch(error) {
    console.log('Database error: ', error)
    throw new Error('Failed to fetch shipment by id.')
  }
}

export async function fetchRoutesByShipmentId(id: string) {
  try {
    const data = await sql<RouteFullType>`
    select r.id, 
    r.start_city_id, c1.name_eng as start_city_name,
    r.end_city_id, c2.name_eng as end_city_name,
    r.transport_type_id, tt.name_eng as transport_type_name,
    tt.image_url
    from routes as r
    left join cities as c1
    on r.start_city_id = c1.id
    left join cities as c2
    on r.end_city_id = c2.id
    left join transport_types as tt
    on r.transport_type_id = tt.id
    left join shipment_routes as sr
    on r.id = sr.route_id
    WHERE sr.shipment_id = ${id}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch routes by shipment id.');
  }
}

export async function fetchCities() {
  try {
    const data = await sql<CityField>`
      SELECT
        id,
        name_eng
      FROM cities
      ORDER BY name_eng ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all cities.');
  }
}

export async function fetchTransportTypes() {
  try {
    const data = await sql<TransportTypeField>`
      SELECT
        id,
        name_eng
      FROM transport_types
      ORDER BY name_eng ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all transport types.');
  }
}

export async function createShipmentRouteInDb(shipment_id: string, route_id: string) {
  try {
    await sql`
    INSERT INTO shipment_routes (shipment_id, route_id) VALUES
    (${shipment_id}, ${route_id})
    `;
  } catch(error) {
    console.log('Database error: ', error)
    throw new Error('Failed to create Shipment_Route in database')
  }
}

export async function fetchRouteIdByCitiesAndTransport(
  start_city_id: string, 
  end_city_id: string, 
  transport_type_id: string
) {
  try {
    const data = await sql`
    SELECT id FROM routes 
    WHERE 
      start_city_id = ${start_city_id} AND
      end_city_id = ${end_city_id} AND
      transport_type_id = ${transport_type_id}
    `;


    return data.rows[0] == null ? '' : String( data.rows[0].id);
  } catch(error) {
    console.log('Database error: ', error)
    throw new Error('Failed to fetch route id by cities and transport')
  }
}