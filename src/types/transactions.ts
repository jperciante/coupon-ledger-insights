
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
