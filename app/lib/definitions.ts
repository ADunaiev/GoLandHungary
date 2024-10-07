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

export type UserField = {
  id: string;
  name: string;
};

export type CityField = {
  id: string;
  name_eng: string;
};

export type CityFullField = {
  id: string;
  name_eng: string;
  country_name_eng: string;
};

export type TransportTypeField = {
  id: string;
  name_eng: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type CustomerFull = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  code: string;
  address_eng: string;
  vat_number_eu: string;
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
  number: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
  short_name: string;
};

export type InvoiceTypeFull = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
  date: string;
  remarks: string;
  amount_wo_vat: number;
  currency_id: string;
  agreement_id: string;
  vat_amount: number;
  amount_managerial_wo_vat: number;
  amount_managerial_with_vat: number;
  number: string;
  organisation_id: string;
  currency_rate: number;
  performance_date: string;
  payment_date: string;
}

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

export type OrganisationFull = {
  id: string;
  name_eng: string;
  address: string;
  code: string;
  vat_number_local: string;
  vat_number_eu: string;
  ceo_name: string;
  email: string;
};

export type BankAccount = {
  id: string;
  organisation_id: string;
  bank_name: string;
  iban: string;
  currency_id: string;
  bank_address: string;
  swift: string;
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

export type ServiceField = {
  id: string;
  name_eng: string;
}

export type CountryField = {
  id: string;
  name_eng: string;
}

export type VatField = {
  id: string;
  name_eng: string;
  rate: number;
}

export type ShipmentField = {
  id: string;
  number_date: string;
}

export type ShipmentTypeFull = {
  id: string;
  number: string;
  date: string;
  customer_id: string;
  customer_name_eng: string;
  sales_id: string;
  sales_name_eng: string;
  documentation_id: string;
  documentation_name_eng: string;
  remarks: string;
  organisation_id: string;
  organisation_name_eng: string;
  status: 'in_process' | 'delivered';
  customer_reference: string;
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

export type RouteField = {
  id: string,
  start_end: string;
}

export type RouteFullType = {
  id: string,
  start_city_id: string;
  start_city_name: string;
  end_city_id: string;
  end_city_name: string;
  transport_type_id: string;
  transport_type_name: string;
  image_url: string;
}

export type CurrencyRateField = {
  id: string,
  organisation_id: string,
  currency_id: string,
  rate: number,
  date: string,
}

export type CurrencyRate = {
  id: string,
  date: string,
  short_name: string,
  rate: number,
  organisation_name: string,
}

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
  currency_rate: number;
  vat_rate_id: string;
  vat_rate_rate: number;
  vat_rate_name: string;
  quantity: number;
};

export type InvoiceRateDbData = {
  invoice_id: string,
  rate_id: string,
  currency_rate: number,
  net_unit: number,
  net_line: number,
  vat_value: number,
  gross_value: number
}

export type UnitField = {
  id: string,
  number: string,
  unit_type_name: string,
}

export type UnitTypeField = {
  id: string,
  name_eng: string,
}

export type VehicleTypeField = {
  id: string,
  name_eng: string,
}

export type ShipmentRouteUnitTypeFull = {
  id: string,
  number: string,
  unit_type_id: string, 
  unit_type_name: string,
  vehicle_id: string, 
  vehicle_number: string,
  transport_type_id: string,
  vehicle_type_id: string, 
  vehicle_type_name: string,
  driver_id: string, 
  driver_name: string, 
  driver_phone: string,
  shipment_id: string,
  route_id: string,
  start_date: string,
  end_date: string,
}

export type VehicleTypeFull = {
  id: string,
  number: string,
  transport_type_id: string,
  transport_type_name: string,
  vehicle_type_id: string,
  vehicle_type_name: string,
  /* delete if everything is stable
  driver_id: string,
  driver_name: string,
  driver_phone: string, */
}

export type DriverTypeFull = {
  id: string,
  name_eng: string,
  phone: string,
}

export type InvoiceTotalAmountsType = {
  amount: number,
  amount_wo_vat: number,
  vat_amount: number,
  amount_managerial_wo_vat: number,
  amount_managerial_with_vat: number,
}


