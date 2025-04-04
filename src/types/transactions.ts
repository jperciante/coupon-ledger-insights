
export interface TransactionData {
  id: string;
  couponId: string;
  amount: number;
  quotas: number;
  authorizationId: string;
  creditType: string;
  salesDate: string;
  paymentDate: string | null;
}

export interface CreditCardCoupon {
  id: string;
  couponId: string;
  amount: number;
  quotas: number;
  taxes: number;
  commissions: number;
  authorizationId: string;
  creditType: 'Credit' | 'Debit';
  cardBrand: 'OCA' | 'Visa' | 'MasterCard';
  sellDate: string;
  expectedPaymentDate: string;
  sellerId: string;
  sellerName: string;
  liquidationId: string;
}

export interface SalesCoupon {
  id: string;
  couponId: string;
  amount: number;
  productName: string;
  quantity: number;
  saleDate: string;
  terminal: string;
  operatorId: string;
  operatorName: string;
}

export interface LiquidationSummary {
  liquidationId: string;
  totalAmount: number;
  couponCount: number;
  paymentDay: string;
  cardBrand: 'OCA' | 'Visa' | 'MasterCard';
}
