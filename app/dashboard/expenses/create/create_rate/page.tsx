import { fetchCurrencies, fetchRoutes, fetchServices, fetchShipments, fetchVatRates } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/rates/create-form'
import ExpenseRateForm from '@/app/ui/rates/create-form-expense';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page() {

  const [services, currencies, vat_rates, routes] = await Promise.all([
    fetchServices(),
    fetchCurrencies(),
    fetchVatRates(),
    fetchRoutes(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Expenses', href: '/dashboard/expenses' },
          { label: 'Create Expense', href: '/dashboard/expenses/create' },
          {
            label: 'Create Rate',
            href: `/dashboard/expenses/create/create_rate`,
            active: true,
          },
        ]}
      />
      <ExpenseRateForm services={services} currencies={currencies} vat_rates={vat_rates} 
      routes={routes} expense_number='new_expense' isCreateExpense={true}/>
    </main>
  );
}