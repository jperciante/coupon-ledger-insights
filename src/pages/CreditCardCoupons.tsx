
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/Dashboard/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { addDays, format, subDays } from 'date-fns';
import CreditCardCouponsTable from '@/components/CreditCard/CreditCardCouponsTable';
import PaymentCalendarTable from '@/components/CreditCard/PaymentCalendarTable';

// Mock data function - in a real app, this would fetch from an API
const fetchCreditCardCoupons = async ({ dateRange }: { dateRange: DateRange | undefined }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const startDate = dateRange?.from ? new Date(dateRange.from) : subDays(new Date(), 30);
  const endDate = dateRange?.to ? new Date(dateRange.to) : new Date();
  
  // Generate mock data
  return Array.from({ length: 25 }, (_, i) => ({
    id: `cc-${i + 1}`,
    couponId: `CP${100000 + i}`,
    amount: Math.round(Math.random() * 10000) / 100,
    quotas: Math.floor(Math.random() * 12) + 1,
    authorizationId: `AUTH${200000 + i}`,
    creditType: ['VISA', 'MASTERCARD', 'AMEX'][Math.floor(Math.random() * 3)],
    sellDate: format(
      subDays(new Date(), Math.floor(Math.random() * 30)),
      'yyyy-MM-dd'
    ),
    expectedPaymentDate: format(
      addDays(new Date(), Math.floor(Math.random() * 30)),
      'yyyy-MM-dd'
    ),
    sellerId: `S${1000 + i % 5}`,
    sellerName: `Seller ${i % 5 + 1}`,
  }));
};

const CreditCardCoupons: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['creditCardCoupons', dateRange],
    queryFn: () => fetchCreditCardCoupons({ dateRange }),
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Credit Card Coupons by Sellers</h1>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Credit Card Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <CreditCardCouponsTable coupons={coupons || []} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentCalendarTable coupons={coupons || []} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditCardCoupons;
