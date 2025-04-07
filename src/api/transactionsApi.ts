
import { fetchApi, ENDPOINTS } from './config';
import { TransactionData } from '@/types/transactions';

/**
 * Fetches reconciled transaction data comparing sales and credit card coupons 
 * with optional date filtering
 */
export const fetchTransactions = async (params: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<TransactionData[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params.dateTo) queryParams.append('dateTo', params.dateTo);
  
  const queryString = queryParams.toString();
  const endpoint = `${ENDPOINTS.RECONCILIATION}/transactions${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi(endpoint);
};

/**
 * Fetches reconciliation summary data showing matches, mismatches and pending items
 * between sales coupons and credit card transactions
 */
export const fetchReconciliationSummary = async (params: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<{
  statusData: { name: string; value: number }[];
  creditTypeData: { name: string; amount: number }[];
  reconciliationStats: {
    totalMatched: number;
    totalPending: number;
    totalMismatch: number;
    totalAmount: number;
  };
}> => {
  const queryParams = new URLSearchParams();
  
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params.dateTo) queryParams.append('dateTo', params.dateTo);
  
  const queryString = queryParams.toString();
  const endpoint = `${ENDPOINTS.RECONCILIATION}/summary${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi(endpoint);
};
