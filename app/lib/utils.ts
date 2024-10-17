import { EuVatValidationData, EuVatValidationJsonResponse, Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-GB', {
    style: 'currency',
    currency: 'EUR',
  });
};

export const formatNeededCurrency = (amount: number, currency: string) => {
  return (amount / 100).toLocaleString('en-GB', {
    style: 'currency',
    currency: currency,
  });
};

export const formatAmount = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
  });
}

export const formatAmountCurrency = (amount: number, currency: string) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}M`);
  }

  return { yAxisLabels, topLabel };
};

export function getCorrectDate(date: string) {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  const formattedDate = (new Date(date)).getTime() - offset;

  return new Date(formattedDate).toISOString().split('T')[0];
}

export function firstDayInPreviousMonth() {
  const today = new Date()
  const offset = today.getTimezoneOffset() * 60000;
  const formattedDate = new Date(today.getTime() - offset);

  return new Date(formattedDate.getFullYear(), formattedDate.getMonth() - 1, 1)

}

export function maxDayForInvoicePayment() {
  const today = new Date()
  const offset = today.getTimezoneOffset() * 60000;
  const formattedDate = new Date(today.getTime() - offset);

  return new Date(formattedDate.getFullYear(), formattedDate.getMonth() + 6, formattedDate.getDate())

}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

/*
export async function fetchEuVatNumber(vat_number: string) : Promise<EuVatValidationData> {
    
  try {
    const response = await fetch(`https://api.vatcheckapi.com/v2/check?vat_number=${vat_number}&apikey=vat_live_g4pRU7XQFoR7a41cY3J16MVyRDNIHnMzZPFVa6Wz`)
  
    const { data, errors } : EuVatValidationJsonResponse = await response.json()
  
    if(response.ok) {
      const companyData = data?.companyData
      
      if(companyData) {
        
        return companyData;
      } else {
        throw new Error(`VAT Number is not valid`)
      }
    } else {
      throw new Error('Request has wrong response')
    }

  } catch(error) {
    console.error('Fetch error: ', error)
    throw new Error('Failed to fetch company by VAT')
  }

} */
