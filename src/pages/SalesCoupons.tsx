
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/Dashboard/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import SalesCouponsTable from '@/components/Sales/SalesCouponsTable';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';

// Mock data function - in a real app, this would fetch from an API
const fetchSalesCoupons = async ({ dateRange }: { dateRange: DateRange | undefined }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const startDate = dateRange?.from ? new Date(dateRange.from) : subDays(new Date(), 30);
  const endDate = dateRange?.to ? new Date(dateRange.to) : new Date();
  
  // Generate mock data
  return Array.from({ length: 30 }, (_, i) => ({
    id: `sc-${i + 1}`,
    couponId: `CP${100000 + i}`,
    amount: Math.round(Math.random() * 10000) / 100,
    productName: `Product ${i % 10 + 1}`,
    quantity: Math.floor(Math.random() * 5) + 1,
    saleDate: format(
      subDays(new Date(), Math.floor(Math.random() * 30)),
      'yyyy-MM-dd'
    ),
    terminal: `POS-${i % 5 + 1}`,
    operatorId: `OP-${1000 + i % 8}`,
    operatorName: `Operator ${i % 8 + 1}`,
  }));
};

const SalesCoupons: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['salesCoupons', dateRange],
    queryFn: () => fetchSalesCoupons({ dateRange }),
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Sales System Coupons (PosComm)</h1>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesCouponsTable coupons={coupons || []} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesCoupons;
