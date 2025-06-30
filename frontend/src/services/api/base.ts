import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, API_TIMEOUT, HTTP_STATUS } from '@/constants/api';

// API Error class for better error handling
export class APIError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// Storage abstraction for cross-platform compatibility
export interface StorageAdapter {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}

// Web storage adapter (localStorage)
export class WebStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Handle storage errors silently
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle storage errors silently
    }
  }
}

// Token management interface
export interface TokenManager {
  getAccessToken(): Promise<string | null> | string | null;
  getRefreshToken(): Promise<string | null> | string | null;
  setTokens(accessToken: string, refreshToken: string): Promise<void> | void;
  clearTokens(): Promise<void> | void;
}

// Web token manager implementation
export class WebTokenManager implements TokenManager {
  private storage: StorageAdapter;
  private accessTokenKey = 'appo_access_token';
  private refreshTokenKey = 'appo_refresh_token';

  constructor(storage: StorageAdapter = new WebStorageAdapter()) {
    this.storage = storage;
  }

  getAccessToken(): string | null {
    const result = this.storage.getItem(this.accessTokenKey);
    return typeof result === 'string' ? result : null;
  }

  getRefreshToken(): string | null {
    const result = this.storage.getItem(this.refreshTokenKey);
    return typeof result === 'string' ? result : null;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.storage.setItem(this.accessTokenKey, accessToken);
    this.storage.setItem(this.refreshTokenKey, refreshToken);
  }

  clearTokens(): void {
    this.storage.removeItem(this.accessTokenKey);
    this.storage.removeItem(this.refreshTokenKey);
  }
}

// Base API client configuration
export interface APIClientConfig {
  baseURL?: string;
  timeout?: number;
  tokenManager?: TokenManager;
}

// Base API client class
export class BaseAPIClient {
  protected client: AxiosInstance;
  protected tokenManager: TokenManager;
  private refreshPromise: Promise<void> | null = null;

  constructor(config: APIClientConfig = {}) {
    this.tokenManager = config.tokenManager || new WebTokenManager();
    
    this.client = axios.create({
      baseURL: config.baseURL || API_BASE_URL,
      timeout: config.timeout || API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.tokenManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (token expired)
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshTokens();
            // Retry the original request with new token
            const token = this.tokenManager.getAccessToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.tokenManager.clearTokens();
            // In a real app, you might want to emit an event or call a callback here
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Transform error to APIError
        return Promise.reject(this.transformError(error));
      }
    );
  }

  private async refreshTokens(): Promise<void> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<void> {
    const refreshToken = this.tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new APIError('No refresh token available', HTTP_STATUS.UNAUTHORIZED);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      this.tokenManager.setTokens(accessToken, newRefreshToken);
    } catch (error) {
      throw new APIError('Token refresh failed', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  private transformError(error: any): APIError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return new APIError(
        data.message || 'An error occurred',
        status,
        data.code,
        data.details
      );
    } else if (error.request) {
      // Network error
      return new APIError('Network error occurred', 0, 'NETWORK_ERROR');
    } else {
      // Request setup error
      return new APIError('Request configuration error', 0, 'REQUEST_ERROR');
    }
  }

  // Generic HTTP methods
  protected async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  protected async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  protected async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  protected async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  protected async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  // Utility methods
  public setAuthToken(token: string): void {
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
  }

  public clearAuthToken(): void {
    delete this.client.defaults.headers.Authorization;
    this.tokenManager.clearTokens();
  }

  public getBaseURL(): string {
    return this.client.defaults.baseURL || '';
  }
} 