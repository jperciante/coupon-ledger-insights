
import { fetchApi, ENDPOINTS } from './config';

/**
 * User login interface
 */
interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Login response interface
 */
interface LoginResponse {
  user: {
    id: number;
    username: string;
    name: string;
  };
  token: string;
}

/**
 * Authenticates a user and returns user info with token
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return fetchApi(ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

/**
 * Logs out the current user
 */
export const logout = async (): Promise<void> => {
  return fetchApi(ENDPOINTS.LOGOUT, {
    method: 'POST',
  });
};

/**
 * Verifies if the current auth token is valid
 */
export const verifyToken = async (): Promise<{valid: boolean; user?: {id: number; username: string; name: string}}> => {
  return fetchApi(ENDPOINTS.VERIFY_TOKEN);
};
