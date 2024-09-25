
/*
'use client'

import React, { ReactInstance } from "react";
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { PrinterIcon } from "@heroicons/react/24/outline";
import { InvoicesTable, InvoiceTypeFull } from "@/app/lib/definitions";

export const ComponentToPrint = React.forwardRef<HTMLDivElement>((props, ref) => {
    return (
      <div ref={ref}>My cool content here!</div>
    );
  });


export const InvoicePrint = ({invoice}:{invoice: InvoicesTable}) => {

    const contentToPrint = useRef(null);

    const handlePrint = useReactToPrint({
      documentTitle: "Print This Document",
      onBeforePrint: () => console.log("before printing..."),
      onAfterPrint: () => console.log("after printing..."),
      removeAfterPrint: true,
    });
  
    return (
      <>
        <div ref={contentToPrint}>
            {'Invoice ' + invoice.number}
        </div>

        <button className="rounded-md border p-2 hover:bg-gray-100" onClick={() => {
            handlePrint(null, () => contentToPrint.current)
        }}>
            <span className="sr-only">Print</span>
            <PrinterIcon className="w-5" />
        </button>
      </>
    )
  } */

'use client';

import { BankAccount, Currency, CustomerField, CustomerFull, InvoiceForm, InvoiceRateDbData, OrganisationFull } from '@/app/lib/definitions';
import {
  CalendarDaysIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  HomeIcon,
  UserCircleIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateInvoice, State } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { 
  CurrencyField, 
  CustomerAgreementField, 
  OrganisationField, 
  RateTable,
  InvoiceTypeFull,
  CurrencyRateField, 
} from '@/app/lib/definitions';
import { InvoiceType } from '@/app/lib/schemas/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InvoiceFormSchema } from '@/app/lib/schemas/schema';
import { I18nProvider } from '@react-aria/i18n';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Image from 'next/image'
import { formatDateToLocal } from '@/app/lib/utils';

export default function PrintInvoice ({ 
  customer,
  currency,
  agreement,
  organisation,
  invoice,
  invoice_rates,
  rates,
  bank_account,
}: { 
  customer: CustomerFull,
  currency: Currency,
  agreement: CustomerAgreementField,
  organisation: OrganisationFull,
  invoice: InvoiceTypeFull,
  invoice_rates: InvoiceRateDbData[],
  rates: RateTable[],
  bank_account: BankAccount,
}) {
  const contentToPrint = useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: `Invoice ${invoice.number} from ${new Date(invoice.date).toISOString().split('T')[0]}`, 
  });

  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  const formattedDate = (new Date(invoice.date)).getTime() - offset;
  const formattedPerformanceDate = (new Date(invoice.performance_date)).getTime() - offset;
  const formattedPaymentDate = (new Date(invoice.payment_date)).getTime() - offset;


  return (
    <>
      <div ref={contentToPrint} className="m-10">
        <div>
          <Image
            src="/goal-hungary-logo.png"
            width={276}
            height={48}
            alt='GOAL Hungary Logo image'
            priority={false}
          />
        </div>

        <div className="w-full text-center text-2xl font-bold mt-6">
          { 'Invoice / Számla' }
        </div>
        
        {/* Supplier and Customer block */}
        <table className="w-full table-fixed text-sm mt-3">
          <tbody>
            <tr>
              <td className="font-bold">Szállító címe: / Supplier</td>
              <td className="font-bold">Vevő címe: / Cust.addr</td>
            </tr>
            <tr>
              <td>{organisation.name_eng}</td>
              <td>{customer.name}</td>
            </tr>
            <tr>
              <td>{organisation.address}</td>
              <td>{customer.address_eng}</td>
            </tr>
            <tr>
              <td className="font-bold">Adószám: / TAX Number:</td>
              <td className="font-bold">Adószám: / TAX Number:</td>
            </tr>
            <tr>
              <td>{organisation.code}</td>
              <td>{customer.code}</td>
            </tr>
            <tr>
              <td className="font-bold">Közösségi adószám: / EU VAT Reg. No.</td>
              <td className="font-bold">Közösségi adószám: / EU VAT Reg. No.</td>
            </tr>
            <tr>
              <td>{organisation.vat_number_eu}</td>
              <td>{customer.vat_number_eu}</td>
            </tr>
            <tr>
              <td className="font-bold">Bankszámlaszám: / Bank account:</td>
              <td className="font-bold">e-mail:</td>
            </tr>
            <tr>
              <td>{bank_account === null ? '' : bank_account.iban}</td>
              <td>{customer.email}</td>
            </tr>
            <tr>
              <td>{bank_account !== null ? bank_account.bank_name : ''}</td>
              <td></td>
            </tr>
            <tr>
              <td>{bank_account !== null ? bank_account.bank_address : ''}</td>
              <td></td>
            </tr>
            <tr>
              <td>{bank_account !== null ? bank_account.swift : ''}</td>
              <td></td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Ügyintéző : / Contact: </span>
                <span>{organisation.ceo_name}</span><br/>
                <span className="font-bold">E-mail: </span>
                <span>{organisation.email}</span>
              </td>
              <td className="font-bold"></td>
            </tr>
          </tbody>
        </table>

        {/* Dates and Number block */}
        <table className="w-full table-fixed text-sm mt-3">
          <tbody>
            <tr>
              <td className="text-center">
                <span className="font-bold">Fizetés módja:</span><br/>
                <span className="text-xs">Payment method:</span><br/>
                <span>Átutalás / Transfer</span>
              </td>
              <td className="text-center">
                <span className="font-bold"> Teljesítés időpontja:</span><br/>
                <span className="text-xs"> Date of performance:</span><br/>
                <span>
                  {
                    formattedPerformanceDate === 10800000 ?
                    '' :
                    new Date(formattedPerformanceDate).toISOString().split('T')[0] 
                  }
                </span>
              </td>
              <td className="text-center">
                <span className="font-bold">Számla kelte:</span><br/>
                <span className="text-xs">Issuing date:</span><br/>
                <span>{new Date(formattedDate).toISOString().split('T')[0]}</span>
              </td>
              <td className="text-center">
                <span className="font-bold">Fizetési határidő:</span><br/>
                <span className="text-xs">Payment terms:</span><br/>
                <span>
                  {
                    formattedPaymentDate === 10800000 ?
                    '' :
                    new Date(formattedPaymentDate).toISOString().split('T')[0]
                  }
                </span>
              </td>
              <td className="text-center">
                <span className="font-bold">Számlaszám:</span><br/>
                <span className="text-xs">Invoice nr</span><br/>
                <span className="font-bold text-base">{invoice.number}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Remarks */}
        <div className="mt-3 text-sm">
          <span>{'Megjegyzéseket/Remarks: ' + invoice.remarks}</span>
        </div>

        {/* Invoice table */}
        <table className="mt-3 w-full">
          <thead className="rounded-lg text-left text-sm font-normal">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium sm:pl-6">
                Tétel megnevezése<br/>
                <span className="text-xs">Description</span>
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Nettó egységár<br/>
                <span className="text-xs">Net unit price</span>                         
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Menny.<br/>
                <span className="text-xs">Qty</span> 
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Nettó egységár<br/>
                <span className="text-xs">Net line</span>
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Áfa%<br/>
                <span className="text-xs">TAX%</span>
              </th>
              <th scope="col" className="px-3 py-3 font-medium">      
                ÁFA<br/>
                <span className="text-xs">TAX</span>
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Bruttó<br/>
                <span className="text-xs">Gross</span>
              </th>
              <th scope="col" className="relative py-3 pl-6 pr-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rates?.map((rate) => (
              <tr
                key={rate.id}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                <td className="whitespace-nowrap py-1 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <p>{rate.service_name}</p>
                  </div>
                  <p className="text-xs text-gray-500">{rate.start_point_name + " - " + rate.end_point_name}</p>
                </td>
                <td className="whitespace-nowrap px-3 py-1">
                  { 
                    (
                      Number(invoice_rates.find(r => r.rate_id === rate.id)?.net_unit) / 100 
                    ).toLocaleString('en-GB', {minimumFractionDigits:2, maximumFractionDigits: 2})
                  }
                </td>
                <td className="whitespace-nowrap px-3 py-1">
                  {rate.quantity}
                </td>
                <td className="whitespace-nowrap px-3 py-1">
                  { 
                    (
                      Number(invoice_rates.find(r => r.rate_id === rate.id)?.net_line) / 100
                    )
                      .toLocaleString('en-GB', {minimumFractionDigits:2, maximumFractionDigits: 2})
                    }
                </td>
                <td className="whitespace-nowrap px-3 py-1">
                  {rate.vat_rate_name}
                </td>
                <td className="whitespace-nowrap px-3 py-1">
                  {
                    (
                      Number(invoice_rates.find(r => r.rate_id === rate.id)?.vat_value) / 100 
                    )
                      .toLocaleString('en-GB', { minimumFractionDigits:2, maximumFractionDigits:2 })
                  }
                </td>
                <td className="whitespace-nowrap px-3 py-1">
                  {
                    (
                      Number(invoice_rates.find(r => r.rate_id === rate.id)?.gross_value) / 100 
                    ).toLocaleString('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Taxes and totals */}
        <table className="w-full table-fixed text-sm">
          <tbody>
            <tr>
              <td>
                {'MNB középárfolyam: / Central rate: ' + invoice.currency_rate / 100}
              </td>
              <td>
                <div className="grid grid-cols-2 text-base">
                  <div className="font-bold text-right">
                    Net / Nettó:<br/>
                    TAX / ÁFA:<br/>
                    Total / Összesen:
                  </div>
                  <div className="font-bold text-base text-center">
                    {(invoice.amount_wo_vat / 100)
                      .toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      + ' ' + currency.short_name
                     }<br/>
                     {(invoice.vat_amount / 100)
                      .toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                     }<br/>
                    {(invoice.amount / 100)
                      .toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      + ' ' + currency.short_name
                     }
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* VAT Remarks */}
        <div className="mt-3 text-sm text-center">
          <span>{rates.find(r => 
            r.vat_rate_name === 'NA') != null ?
            'Addressee of the invoice is obliged to pay the tax / Az adó megfizetésére a számla címzettje kötelezett.' :
            ''
          }</span>
        </div>


      </div>

      <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/invoices"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>

          <button 
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" 
            onClick={() => {
              handlePrint(null, () => contentToPrint.current)
              }}>
                <span>Print</span>
          </button>

        </div>


    </>
  );
}







