
// Base API configuration
export const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

// API endpoints
export const ENDPOINTS = {
  // Sales coupons (PosComm)
  SALES_COUPONS: '/sales-coupons',
  // Credit card coupons
  CREDIT_CARD_COUPONS: '/credit-card-coupons',
  // Reconciliation data
  RECONCILIATION: '/reconciliation',
  TRANSACTIONS: '/transactions',
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  VERIFY_TOKEN: '/auth/verify',
};

// Default request headers
export const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Common fetch wrapper with error handling
export const fetchApi = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getDefaultHeaders(localStorage.getItem('authToken') || undefined),
        ...(options.headers || {}),
      },
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
