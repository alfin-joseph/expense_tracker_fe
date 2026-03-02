import axios, { AxiosInstance } from 'axios';

// Base API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types from OpenAPI spec
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  currency_preference?: string;
  timezone?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  is_default: boolean;
  created_at: string;
}

export interface CategoryCreate {
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
}

export interface CategoryUpdate extends Partial<CategoryCreate> {}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: string;
  description?: string;
  transaction_date: string;
  is_recurring: boolean;
  category?: string;
  category_name: string;
  created_at: string;
}

export interface TransactionCreate {
  type: 'income' | 'expense';
  amount: string;
  description?: string;
  transaction_date: string;
  is_recurring: boolean;
  category?: string;
}

export interface AnalyticsSummary {
  total_income: number;
  total_expense: number;
  net_savings: number;
  avg_monthly_income: number;
  avg_monthly_expense: number;
}

export interface AnalyticsTrend {
  month: number;
  type: 'income' | 'expense';
  total: number;
}

export interface AnalyticsCategoryDistribution {
  category__name: string;
  total: number;
}

export interface AnalyticsOverview {
  summary: AnalyticsSummary;
  trend: AnalyticsTrend[];
  category_distribution: AnalyticsCategoryDistribution[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Client
class APIClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.refreshToken) {
            try {
              const response = await this.refreshAccessToken(this.refreshToken);
              this.setTokens(response.access, this.refreshToken);
              originalRequest.headers.Authorization = `Bearer ${response.access}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              // Refresh failed, clear tokens
              this.clearTokens();
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );

    // Load tokens from localStorage on initialization
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  public setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    }
  }

  public clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  // Auth endpoints
  public async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/api/auth/login/', credentials);
    return response.data;
  }

  public async register(data: RegisterRequest) {
    const response = await this.client.post('/api/auth/register/', data);
    return response.data;
  }

  public async getProfile(): Promise<User> {
    const response = await this.client.get<User>('/api/auth/profile/');
    return response.data;
  }

  public async refreshAccessToken(refresh: string): Promise<RefreshTokenResponse> {
    const response = await this.client.post<RefreshTokenResponse>('/api/auth/refresh/', {
      refresh,
    });
    return response.data;
  }

  // Categories endpoints
  public async getCategories(page?: number, ordering?: string) {
    const response = await this.client.get<PaginatedResponse<Category>>('/api/categories/', {
      params: { page, ordering },
    });
    return response.data;
  }

  public async getCategory(id: string): Promise<Category> {
    const response = await this.client.get<Category>(`/api/categories/${id}/`);
    return response.data;
  }

  public async createCategory(data: CategoryCreate): Promise<Category> {
    const response = await this.client.post<Category>('/api/categories/', data);
    return response.data;
  }

  public async updateCategory(id: string, data: CategoryUpdate): Promise<Category> {
    const response = await this.client.put<Category>(`/api/categories/${id}/`, data);
    return response.data;
  }

  public async patchCategory(id: string, data: Partial<CategoryCreate>): Promise<Category> {
    const response = await this.client.patch<Category>(`/api/categories/${id}/`, data);
    return response.data;
  }

  public async deleteCategory(id: string): Promise<void> {
    await this.client.delete(`/api/categories/${id}/`);
  }

  // Transactions endpoints
  public async getTransactions(page?: number, ordering?: string) {
    const response = await this.client.get<PaginatedResponse<Transaction>>(
      '/api/transactions/',
      { params: { page, ordering } }
    );
    return response.data;
  }

  public async getTransaction(id: string): Promise<Transaction> {
    const response = await this.client.get<Transaction>(`/api/transactions/${id}/`);
    return response.data;
  }

  public async createTransaction(data: TransactionCreate): Promise<Transaction> {
    const response = await this.client.post<Transaction>('/api/transactions/', data);
    return response.data;
  }

  public async updateTransaction(id: string, data: TransactionCreate): Promise<Transaction> {
    const response = await this.client.put<Transaction>(`/api/transactions/${id}/`, data);
    return response.data;
  }

  public async patchTransaction(
    id: string,
    data: Partial<TransactionCreate>
  ): Promise<Transaction> {
    const response = await this.client.patch<Transaction>(`/api/transactions/${id}/`, data);
    return response.data;
  }

  public async deleteTransaction(id: string): Promise<void> {
    await this.client.delete(`/api/transactions/${id}/`);
  }

  // Analytics endpoints
  public async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const endpoints = [
      '/api/analytics/overview/',
      '/analytics/overview/',
      '/api/overview/',
      '/overview/',
    ];

    let lastError: any = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying analytics endpoint: ${endpoint}`);
        const response = await this.client.get<AnalyticsOverview>(endpoint);
        console.log(`Analytics endpoint SUCCESS at ${endpoint}:`, response.data);
        return response.data;
      } catch (error: any) {
        lastError = error;
        console.log(`Analytics endpoint FAILED at ${endpoint}:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
        });
      }
    }

    console.error('All analytics endpoints failed:', {
      endpoints,
      baseURL: this.client.defaults.baseURL,
      lastError: {
        status: lastError?.response?.status,
        statusText: lastError?.response?.statusText,
        data: lastError?.response?.data,
        message: lastError?.message,
      },
    });

    throw lastError;
  }
}

// Export singleton instance
export const apiClient = new APIClient();
