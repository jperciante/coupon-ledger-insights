
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
import { CreditCard, DollarSign, Landmark, Receipt, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Coupon ID</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Taxes</TableHead>
              <TableHead>Commissions</TableHead>
              <TableHead>Quotas</TableHead>
              <TableHead>Credit Type</TableHead>
              <TableHead>Card Brand</TableHead>
              <TableHead>Liquidation ID</TableHead>
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
                  <TableCell>${coupon.taxes.toFixed(2)}</TableCell>
                  <TableCell>${coupon.commissions.toFixed(2)}</TableCell>
                  <TableCell>{coupon.quotas}</TableCell>
                  <TableCell>
                    <Badge variant={coupon.creditType === 'Credit' ? 'default' : 'outline'}>
                      {coupon.creditType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        coupon.cardBrand === 'OCA' 
                          ? 'default' 
                          : coupon.cardBrand === 'Visa' 
                            ? 'secondary' 
                            : 'destructive'
                      }
                    >
                      {coupon.cardBrand}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Landmark className="mr-2 h-4 w-4 text-muted-foreground" />
                      {coupon.liquidationId}
                    </div>
                  </TableCell>
                  <TableCell>{coupon.authorizationId}</TableCell>
                  <TableCell>{format(new Date(coupon.sellDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(coupon.expectedPaymentDate), 'MMM dd, yyyy')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  No coupons found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CreditCardCouponsTable;
