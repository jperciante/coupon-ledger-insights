
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/Dashboard/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { addDays, format, subDays } from 'date-fns';
import CreditCardCouponsTable from '@/components/CreditCard/CreditCardCouponsTable';
import PaymentCalendarTable from '@/components/CreditCard/PaymentCalendarTable';
import { CreditCardCoupon, LiquidationSummary } from '@/types/transactions';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CreditCard, Filter, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// Mock liquidation IDs
const liquidationIds = ['LIQ-2023-001', 'LIQ-2023-002', 'LIQ-2023-003', 'LIQ-2023-004'];

// Mock data function - in a real app, this would fetch from an API
const fetchCreditCardCoupons = async ({ 
  dateRange, 
  cardBrand, 
  creditType, 
  liquidationId 
}: { 
  dateRange: DateRange | undefined, 
  cardBrand: string | null,
  creditType: string | null,
  liquidationId: string | null
}): Promise<CreditCardCoupon[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const startDate = dateRange?.from ? new Date(dateRange.from) : subDays(new Date(), 30);
  const endDate = dateRange?.to ? new Date(dateRange.to) : new Date();
  
  // Card brands for random assignment
  const cardBrands = ['OCA', 'Visa', 'MasterCard'] as const;
  const creditTypes = ['Credit', 'Debit'] as const;
  
  // Generate mock data
  let coupons = Array.from({ length: 25 }, (_, i) => {
    const randomCardBrand = cardBrands[Math.floor(Math.random() * cardBrands.length)];
    const randomCreditType = creditTypes[Math.floor(Math.random() * creditTypes.length)];
    const randomLiquidationId = liquidationIds[Math.floor(Math.random() * liquidationIds.length)];
    
    return {
      id: `cc-${i + 1}`,
      couponId: `CP${100000 + i}`,
      amount: Math.round(Math.random() * 10000) / 100,
      quotas: Math.floor(Math.random() * 12) + 1,
      taxes: Math.round(Math.random() * 500) / 100,
      commissions: Math.round(Math.random() * 300) / 100,
      authorizationId: `AUTH${200000 + i}`,
      cardBrand: randomCardBrand,
      creditType: randomCreditType,
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
      liquidationId: randomLiquidationId
    };
  });
  
  // Apply filters
  if (cardBrand) {
    coupons = coupons.filter(coupon => coupon.cardBrand === cardBrand);
  }
  
  if (creditType) {
    coupons = coupons.filter(coupon => coupon.creditType === creditType);
  }
  
  if (liquidationId) {
    coupons = coupons.filter(coupon => coupon.liquidationId === liquidationId);
  }
  
  return coupons;
};

// Function to calculate liquidation summaries
const calculateLiquidationSummaries = (coupons: CreditCardCoupon[]): LiquidationSummary[] => {
  const liquidationMap = new Map<string, LiquidationSummary>();
  
  coupons.forEach(coupon => {
    if (!liquidationMap.has(coupon.liquidationId)) {
      liquidationMap.set(coupon.liquidationId, {
        liquidationId: coupon.liquidationId,
        totalAmount: 0,
        couponCount: 0,
        paymentDay: coupon.expectedPaymentDate,
        cardBrand: coupon.cardBrand
      });
    }
    
    const summary = liquidationMap.get(coupon.liquidationId)!;
    summary.totalAmount += coupon.amount;
    summary.couponCount += 1;
  });
  
  return Array.from(liquidationMap.values());
};

const CreditCardCoupons: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedCardBrand, setSelectedCardBrand] = useState<string | null>(null);
  const [selectedCreditType, setSelectedCreditType] = useState<string | null>(null);
  const [selectedLiquidationId, setSelectedLiquidationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['creditCardCoupons', dateRange, selectedCardBrand, selectedCreditType, selectedLiquidationId],
    queryFn: () => fetchCreditCardCoupons({ 
      dateRange, 
      cardBrand: selectedCardBrand, 
      creditType: selectedCreditType,
      liquidationId: selectedLiquidationId
    }),
  });

  const filteredCoupons = useMemo(() => {
    if (!coupons) return [];
    
    return coupons.filter(coupon => 
      coupon.couponId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.authorizationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coupons, searchTerm]);

  const liquidationSummaries = useMemo(() => {
    return calculateLiquidationSummaries(filteredCoupons);
  }, [filteredCoupons]);

  const handleResetFilters = () => {
    setSelectedCardBrand(null);
    setSelectedCreditType(null);
    setSelectedLiquidationId(null);
    setSearchTerm('');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Credit Card Coupons by Sellers</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Label>Card Brand</Label>
                <Select value={selectedCardBrand || ''} onValueChange={value => setSelectedCardBrand(value || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Card Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Card Brands</SelectItem>
                    <SelectItem value="OCA">OCA</SelectItem>
                    <SelectItem value="Visa">Visa</SelectItem>
                    <SelectItem value="MasterCard">MasterCard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Credit Type</Label>
                <RadioGroup 
                  className="flex space-x-4"
                  value={selectedCreditType || ''}
                  onValueChange={value => setSelectedCreditType(value || null)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="all" />
                    <Label htmlFor="all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Credit" id="credit" />
                    <Label htmlFor="credit">Credit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Debit" id="debit" />
                    <Label htmlFor="debit">Debit</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Liquidation ID</Label>
                <Select value={selectedLiquidationId || ''} onValueChange={value => setSelectedLiquidationId(value || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Liquidations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Liquidations</SelectItem>
                    {liquidationIds.map(id => (
                      <SelectItem key={id} value={id}>{id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liquidation KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {liquidationSummaries.map(summary => (
            <Card key={summary.liquidationId} className="border-l-4" style={{ borderLeftColor: summary.cardBrand === 'OCA' ? '#4f46e5' : summary.cardBrand === 'Visa' ? '#0284c7' : '#ef4444' }}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{summary.liquidationId}</CardTitle>
                  <Badge variant={summary.cardBrand === 'OCA' ? 'default' : summary.cardBrand === 'Visa' ? 'secondary' : 'destructive'}>
                    {summary.cardBrand}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Amount:</span>
                    <span className="font-semibold">${summary.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Coupons:</span>
                    <span className="font-semibold">{summary.couponCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Day:</span>
                    <span className="font-semibold">{format(new Date(summary.paymentDay), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Credit Card Coupons</CardTitle>
            </CardHeader>
            <CardContent>
              <CreditCardCouponsTable coupons={filteredCoupons || []} isLoading={isLoading} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentCalendarTable coupons={filteredCoupons || []} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreditCardCoupons;
