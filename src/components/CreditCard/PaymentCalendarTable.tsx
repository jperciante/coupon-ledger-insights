
import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { addDays, format, isSameDay, parseISO } from 'date-fns';
import { CreditCardCoupon } from '@/types/transactions';
import { Calendar, DollarSign } from 'lucide-react';

interface PaymentCalendarTableProps {
  coupons: CreditCardCoupon[];
  isLoading: boolean;
}

interface PaymentDaySummary {
  date: Date;
  totalAmount: number;
  coupons: CreditCardCoupon[];
}

const PaymentCalendarTable: React.FC<PaymentCalendarTableProps> = ({ coupons, isLoading }) => {
  const paymentSummary = useMemo(() => {
    if (!coupons.length) return [];

    // Group coupons by payment date
    const paymentMap = new Map<string, PaymentDaySummary>();

    coupons.forEach(coupon => {
      const paymentDate = parseISO(coupon.expectedPaymentDate);
      const dateKey = format(paymentDate, 'yyyy-MM-dd');
      
      if (paymentMap.has(dateKey)) {
        const existing = paymentMap.get(dateKey)!;
        existing.totalAmount += coupon.amount;
        existing.coupons.push(coupon);
      } else {
        paymentMap.set(dateKey, {
          date: paymentDate,
          totalAmount: coupon.amount,
          coupons: [coupon]
        });
      }
    });

    // Convert map to array and sort by date
    return Array.from(paymentMap.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [coupons]);

  if (isLoading) {
    return <div className="py-6 text-center">Loading payment calendar...</div>;
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Payment Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Number of Coupons</TableHead>
            <TableHead>Credit Card Types</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentSummary.length > 0 ? (
            paymentSummary.map((summary) => (
              <TableRow key={format(summary.date, 'yyyy-MM-dd')}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {format(summary.date, 'EEE, MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    ${summary.totalAmount.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell>{summary.coupons.length}</TableCell>
                <TableCell>
                  {Array.from(new Set(summary.coupons.map(c => c.creditType))).join(', ')}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No upcoming payments found for the selected date range.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentCalendarTable;
