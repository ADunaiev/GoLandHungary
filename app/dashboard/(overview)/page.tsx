import CardWrapper, { ExpencesCardWrapper, TransportCardWrapper } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { LatestInvoicesSkeleton, RevenueChartSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import bcrypt from 'bcrypt';

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page() {

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton/>}>
                    <TransportCardWrapper />
                </Suspense>
            </div>
            <h1 className={`${lusitana.className} mt-4 mb-4 text-xl md:text-2xl`}>
                Incomes
            </h1>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton/>}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton/>}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton/>}>
                    <LatestInvoices />
                </Suspense>
            </div>
            <h1 className={`${lusitana.className} mt-4 mb-4 text-xl md:text-2xl`}>
                Expenses
            </h1>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton/>}>
                    <ExpencesCardWrapper />
                </Suspense>
            </div>
        </main>
    );
}