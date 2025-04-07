
import { fetchApi, ENDPOINTS } from './config';
import { SalesCoupon } from '@/types/transactions';

/**
 * Fetches sales coupons (PosComm) with optional filters
 */
export const fetchSalesCoupons = async (params: {
  dateFrom?: string;
  dateTo?: string;
  terminalId?: string;
  operatorId?: string;
  searchTerm?: string;
}): Promise<SalesCoupon[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params.dateTo) queryParams.append('dateTo', params.dateTo);
  if (params.terminalId) queryParams.append('terminalId', params.terminalId);
  if (params.operatorId) queryParams.append('operatorId', params.operatorId);
  if (params.searchTerm) queryParams.append('search', params.searchTerm);
  
  const queryString = queryParams.toString();
  const endpoint = `${ENDPOINTS.SALES_COUPONS}${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi(endpoint);
};

/**
 * Fetches unique terminals from the system
 */
export const fetchTerminals = async (): Promise<string[]> => {
  return fetchApi(`${ENDPOINTS.SALES_COUPONS}/terminals`);
};

/**
 * Fetches unique operators from the system
 */
export const fetchOperators = async (): Promise<{id: string, name: string}[]> => {
  return fetchApi(`${ENDPOINTS.SALES_COUPONS}/operators`);
};
