
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/Dashboard/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { format, subDays, formatISO } from 'date-fns';
import SalesCouponsTable from '@/components/Sales/SalesCouponsTable';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Filter, Search, Terminal, User } from 'lucide-react';
import { fetchSalesCoupons, fetchTerminals, fetchOperators } from '@/api/salesCouponsApi';
import { toast } from 'sonner';

const SalesCoupons: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch terminal IDs
  const { data: terminalIds = [] } = useQuery({
    queryKey: ['terminals'],
    queryFn: () => fetchTerminals(),
    onError: (error) => {
      toast.error('Failed to load terminals');
      console.error('Error fetching terminals:', error);
    }
  });

  // Fetch operators
  const { data: operators = [] } = useQuery({
    queryKey: ['operators'],
    queryFn: () => fetchOperators(),
    onError: (error) => {
      toast.error('Failed to load operators');
      console.error('Error fetching operators:', error);
    }
  });

  // Fetch sales coupons with filters
  const { data: coupons, isLoading } = useQuery({
    queryKey: ['salesCoupons', dateRange, selectedTerminal, selectedOperator],
    queryFn: () => fetchSalesCoupons({ 
      dateFrom: dateRange?.from ? formatISO(dateRange.from, { representation: 'date' }) : undefined,
      dateTo: dateRange?.to ? formatISO(dateRange.to, { representation: 'date' }) : undefined,
      terminalId: selectedTerminal || undefined,
      operatorId: selectedOperator || undefined
    }),
    onError: (error) => {
      toast.error('Failed to load sales coupons');
      console.error('Error fetching sales coupons:', error);
    }
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
                <Select 
                  value={selectedTerminal || "all-terminals"} 
                  onValueChange={(value) => setSelectedTerminal(value === "all-terminals" ? null : value)}
                >
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
                <Select 
                  value={selectedOperator || "all-operators"} 
                  onValueChange={(value) => setSelectedOperator(value === "all-operators" ? null : value)}
                >
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
