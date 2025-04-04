
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { TransactionData } from '@/types/transactions';

interface TransactionTableProps {
  transactions: TransactionData[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Quotas</TableHead>
                <TableHead>Authorization ID</TableHead>
                <TableHead>Credit Type</TableHead>
                <TableHead>Sales Date</TableHead>
                <TableHead>Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.couponId}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.quotas}</TableCell>
                    <TableCell>{transaction.authorizationId}</TableCell>
                    <TableCell>{transaction.creditType}</TableCell>
                    <TableCell>{format(new Date(transaction.salesDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {transaction.paymentDate 
                        ? format(new Date(transaction.paymentDate), 'MMM dd, yyyy')
                        : 'Pending'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No transactions found for the selected date range.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
