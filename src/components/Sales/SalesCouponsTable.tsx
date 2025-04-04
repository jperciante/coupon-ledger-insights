
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
import { SalesCoupon } from '@/types/transactions';
import { DollarSign, Package, Tag, Terminal, User } from 'lucide-react';

interface SalesCouponsTableProps {
  coupons: SalesCoupon[];
  isLoading: boolean;
}

const SalesCouponsTable: React.FC<SalesCouponsTableProps> = ({ coupons, isLoading }) => {
  if (isLoading) {
    return <div className="py-6 text-center">Loading sales coupons data...</div>;
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Coupon ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Sale Date</TableHead>
            <TableHead>Terminal</TableHead>
            <TableHead>Operator</TableHead>
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
                <TableCell>
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                    {coupon.productName}
                  </div>
                </TableCell>
                <TableCell>{coupon.quantity}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    ${coupon.amount.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell>{format(new Date(coupon.saleDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Terminal className="mr-2 h-4 w-4 text-muted-foreground" />
                    {coupon.terminal}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    {coupon.operatorName} ({coupon.operatorId})
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No sales coupons found for the selected date range.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalesCouponsTable;
