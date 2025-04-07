
import { fetchApi, ENDPOINTS } from './config';
import { CreditCardCoupon } from '@/types/transactions';

/**
 * Fetches credit card coupons with optional filters
 */
export const fetchCreditCardCoupons = async (params: {
  dateFrom?: string;
  dateTo?: string;
  cardBrand?: string;
  creditType?: string;
  liquidationId?: string;
  searchTerm?: string;
}): Promise<CreditCardCoupon[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params.dateTo) queryParams.append('dateTo', params.dateTo);
  if (params.cardBrand) queryParams.append('cardBrand', params.cardBrand);
  if (params.creditType) queryParams.append('creditType', params.creditType);
  if (params.liquidationId) queryParams.append('liquidationId', params.liquidationId);
  if (params.searchTerm) queryParams.append('search', params.searchTerm);
  
  const queryString = queryParams.toString();
  const endpoint = `${ENDPOINTS.CREDIT_CARD_COUPONS}${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi(endpoint);
};

/**
 * Fetches available liquidation IDs
 */
export const fetchLiquidationIds = async (): Promise<string[]> => {
  return fetchApi(`${ENDPOINTS.CREDIT_CARD_COUPONS}/liquidations`);
};
