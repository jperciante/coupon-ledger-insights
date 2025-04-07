
import { fetchApi, ENDPOINTS } from './config';
import { TransactionData } from '@/types/transactions';

/**
 * Fetches transaction data for reconciliation with optional date filtering
 */
export const fetchTransactions = async (params: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<TransactionData[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params.dateTo) queryParams.append('dateTo', params.dateTo);
  
  const queryString = queryParams.toString();
  const endpoint = `${ENDPOINTS.TRANSACTIONS}${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi(endpoint);
};

/**
 * Fetches reconciliation summary data
 */
export const fetchReconciliationSummary = async (params: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<any> => {
  const queryParams = new URLSearchParams();
  
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params.dateTo) queryParams.append('dateTo', params.dateTo);
  
  const queryString = queryParams.toString();
  const endpoint = `${ENDPOINTS.TRANSACTIONS}/summary${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi(endpoint);
};
