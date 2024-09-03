// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type Currency = {
  id: string;
  name_eng: string;
  short_name: string;
  name_hun: string;
};

export type CurrencyField = {
  id: string;
  short_name: string;
};

export type OrganisationField = {
  id: string;
  name_eng: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomerAgreement = {
  id: string;
  number: string;
  date: string;
  validity: string;
  organisation_id: string;
  customer_id: string;
};

export type CustomerAgreementField = {
  id: string;
  number_and_date: string;
}

export type Rate = {
  id: string;
  shipment_id: string;
  service_id: string;
  rate: number;
  currency_id: string;
  vat_rate_id: string;
  route_id: string;
  quantity: number;
};

export type RateTable = {
  id: string;
  shipment_id: string;
  shipment_number: string;
  route_id: string;
  start_point_name: string;
  end_point_name: string;
  service_id: string;
  service_name: string;
  rate: number;
  currency_id: string;
  currency_name: string;
  vat_rate_id: string;
  vat_rate_rate: number;
  vat_rate_name: string;
  quantity: number;
};

