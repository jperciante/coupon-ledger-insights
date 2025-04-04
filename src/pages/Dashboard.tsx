
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { DateRangePicker } from '@/components/Dashboard/DateRangePicker';
import ReconciliationSummary from '@/components/Dashboard/ReconciliationSummary';
import TransactionTable from '@/components/Dashboard/TransactionTable';
import { DateRange } from 'react-day-picker';
import { addDays, subDays } from 'date-fns';
import { toast } from 'sonner';
import { TransactionData } from '@/types/transactions';

// Mock transaction data - in a real app this would come from an API
const generateMockTransactions = (count: number): TransactionData[] => {
  const creditTypes = ['Visa', 'Mastercard', 'American Express', 'Other'];
  const today = new Date();
  
  return Array.from({ length: count }, (_, i) => {
    const salesDate = subDays(today, Math.floor(Math.random() * 60));
    const paymentDate = Math.random() > 0.2 
      ? addDays(salesDate, Math.floor(Math.random() * 14) + 1) 
      : null;
    
    return {
      id: `tr-${i + 1}`,
      couponId: `CPN-${10000 + i}`,
      amount: +(Math.random() * 1000 + 50).toFixed(2),
      quotas: Math.floor(Math.random() * 12) + 1,
      authorizationId: `AUTH-${Math.floor(Math.random() * 1000000)}`,
      creditType: creditTypes[Math.floor(Math.random() * creditTypes.length)],
      salesDate: salesDate.toISOString(),
      paymentDate: paymentDate?.toISOString() || null,
    };
  });
};

const Dashboard = () => {
  // Set default date range to the last 30 days
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch transactions when date range changes
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data
        const mockData = generateMockTransactions(20);
        
        // Filter by date range if it exists
        const filteredData = dateRange?.from && dateRange.to
          ? mockData.filter(tx => {
              const txDate = new Date(tx.salesDate);
              return txDate >= dateRange.from! && txDate <= dateRange.to!;
            })
          : mockData;
        
        setTransactions(filteredData);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        toast.error('Failed to load transaction data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [dateRange]);

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
            <ReconciliationSummary transactions={transactions} />
            <TransactionTable transactions={transactions} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
