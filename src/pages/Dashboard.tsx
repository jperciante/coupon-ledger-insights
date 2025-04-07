
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { DateRangePicker } from '@/components/Dashboard/DateRangePicker';
import ReconciliationSummary from '@/components/Dashboard/ReconciliationSummary';
import TransactionTable from '@/components/Dashboard/TransactionTable';
import { DateRange } from 'react-day-picker';
import { formatISO, subDays } from 'date-fns';
import { toast } from 'sonner';
import { fetchTransactions, fetchReconciliationSummary } from '@/api/transactionsApi';

const Dashboard = () => {
  // Set default date range to the last 30 days
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  // Fetch transactions with date range filter
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', dateRange],
    queryFn: () => fetchTransactions({
      dateFrom: dateRange?.from ? formatISO(dateRange.from, { representation: 'date' }) : undefined,
      dateTo: dateRange?.to ? formatISO(dateRange.to, { representation: 'date' }) : undefined,
    }),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load transaction data');
        console.error('Error fetching transactions:', error);
      }
    }
  });

  // Fetch reconciliation summary data
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['reconciliationSummary', dateRange],
    queryFn: () => fetchReconciliationSummary({
      dateFrom: dateRange?.from ? formatISO(dateRange.from, { representation: 'date' }) : undefined,
      dateTo: dateRange?.to ? formatISO(dateRange.to, { representation: 'date' }) : undefined,
    }),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load reconciliation summary');
        console.error('Error fetching reconciliation summary:', error);
      }
    }
  });
  
  const isLoading = isLoadingTransactions || isLoadingSummary;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Reconciliation Dashboard</h2>
          <div className="w-full sm:w-auto sm:min-w-[300px]">
            <DateRangePicker 
              dateRange={dateRange} 
              onDateRangeChange={setDateRange} 
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-muted-foreground">Loading transaction data...</p>
          </div>
        ) : (
          <>
            <ReconciliationSummary 
              transactions={transactions} 
              summaryData={summaryData} 
            />
            <TransactionTable transactions={transactions} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
