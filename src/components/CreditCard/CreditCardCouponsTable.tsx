
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { CreditCardCoupon } from '@/types/transactions';
import { CreditCard, DollarSign, Tag } from 'lucide-react';

interface CreditCardCouponsTableProps {
  coupons: CreditCardCoupon[];
  isLoading: boolean;
}

const CreditCardCouponsTable: React.FC<CreditCardCouponsTableProps> = ({ coupons, isLoading }) => {
  if (isLoading) {
    return <div className="py-6 text-center">Loading coupons data...</div>;
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Coupon ID</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Quotas</TableHead>
            <TableHead>Credit Type</TableHead>
            <TableHead>Authorization ID</TableHead>
            <TableHead>Sell Date</TableHead>
            <TableHead>Expected Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    {coupon.couponId}
                  </div>
                </TableCell>
                <TableCell>{coupon.sellerName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    ${coupon.amount.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell>{coupon.quotas}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                    {coupon.creditType}
                  </div>
                </TableCell>
                <TableCell>{coupon.authorizationId}</TableCell>
                <TableCell>{format(new Date(coupon.sellDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{format(new Date(coupon.expectedPaymentDate), 'MMM dd, yyyy')}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No coupons found for the selected date range.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CreditCardCouponsTable;
