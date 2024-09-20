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
} from './definitions';
import { formatCurrency } from './utils';
import { RateType } from './schemas/schema';
import { getRandomValues } from 'crypto';

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
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
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

    if(oldNumber.trim() === '') { oldNumber = 'GH_000001'}

    const newNumber = Number(oldNumber.slice(3,9)) + 1;
    
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
