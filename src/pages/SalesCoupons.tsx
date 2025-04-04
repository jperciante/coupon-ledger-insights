
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/Dashboard/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import SalesCouponsTable from '@/components/Sales/SalesCouponsTable';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Filter, Search, Terminal, User } from 'lucide-react';

// Mock terminal IDs
const terminalIds = ['POS-1', 'POS-2', 'POS-3', 'POS-4', 'POS-5'];

// Mock data function - in a real app, this would fetch from an API
const fetchSalesCoupons = async ({ 
  dateRange, 
  terminalId, 
  operatorId
}: { 
  dateRange: DateRange | undefined,
  terminalId: string | null,
  operatorId: string | null
}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const startDate = dateRange?.from ? new Date(dateRange.from) : subDays(new Date(), 30);
  const endDate = dateRange?.to ? new Date(dateRange.to) : new Date();
  
  // Generate mock data
  let coupons = Array.from({ length: 30 }, (_, i) => ({
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

  // Apply filters
  if (terminalId) {
    coupons = coupons.filter(coupon => coupon.terminal === terminalId);
  }
  
  if (operatorId) {
    coupons = coupons.filter(coupon => coupon.operatorId === operatorId);
  }
  
  return coupons;
};

const SalesCoupons: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['salesCoupons', dateRange, selectedTerminal, selectedOperator],
    queryFn: () => fetchSalesCoupons({ 
      dateRange, 
      terminalId: selectedTerminal,
      operatorId: selectedOperator
    }),
  });

  const filteredCoupons = useMemo(() => {
    if (!coupons) return [];
    
    return coupons.filter(coupon => 
      coupon.couponId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.operatorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coupons, searchTerm]);

  const handleResetFilters = () => {
    setSelectedTerminal(null);
    setSelectedOperator(null);
    setSearchTerm('');
  };

  // Create unique list of operators from coupons
  const operators = useMemo(() => {
    if (!coupons) return [];
    
    const uniqueOperators = new Set<string>();
    coupons.forEach(coupon => {
      uniqueOperators.add(coupon.operatorId);
    });
    
    return Array.from(uniqueOperators).map(opId => {
      const coupon = coupons.find(c => c.operatorId === opId);
      return {
        id: opId,
        name: coupon ? coupon.operatorName : opId
      };
    });
  }, [coupons]);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Sales System Coupons (PosComm)</h1>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </CardTitle>
              <button 
                onClick={handleResetFilters}
                className="text-sm text-blue-600 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search coupons..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Terminal</Label>
                <Select value={selectedTerminal || undefined} onValueChange={value => setSelectedTerminal(value || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Terminals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-terminals">All Terminals</SelectItem>
                    {terminalIds.map(id => (
                      <SelectItem key={id} value={id}>
                        <div className="flex items-center">
                          <Terminal className="mr-2 h-4 w-4 text-muted-foreground" />
                          {id}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Operator</Label>
                <Select value={selectedOperator || undefined} onValueChange={value => setSelectedOperator(value || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Operators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-operators">All Operators</SelectItem>
                    {operators.map(operator => (
                      <SelectItem key={operator.id} value={operator.id}>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {operator.name} ({operator.id})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesCouponsTable coupons={filteredCoupons || []} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesCoupons;
