
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { TransactionData } from '@/types/transactions';

interface ReconciliationSummaryProps {
  transactions: TransactionData[];
  summaryData?: any; // The summary data from the API
}

const ReconciliationSummary: React.FC<ReconciliationSummaryProps> = ({ transactions, summaryData }) => {
  // Use API data if available, otherwise calculate from transactions
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Use provided summary data or fallback to mock data
  const statusData = summaryData?.statusData || [
    { name: 'Reconciled', value: 42 },
    { name: 'Pending', value: 13 },
    { name: 'Mismatch', value: 5 }
  ];
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];
  
  // Use provided credit type data or fallback to mock data
  const creditTypeData = summaryData?.creditTypeData || [
    { name: 'Visa', amount: 12500 },
    { name: 'Mastercard', amount: 9700 },
    { name: 'American Express', amount: 4200 },
    { name: 'Other', amount: 1800 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Reconciliation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Amount by Credit Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={creditTypeData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReconciliationSummary;
