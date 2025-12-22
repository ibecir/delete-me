import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
  User,
  Link,
  LinkCreate,
  LinkUpdate,
  LinkListResponse,
  DashboardStats,
  ApiError,
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private client: AxiosInstance;
  private userId: number | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include user ID
    this.client.interceptors.request.use((config) => {
      if (this.userId) {
        config.headers['X-User-ID'] = this.userId.toString();
      }
      return config;
    });
  }

  setUserId(userId: number | null) {
    this.userId = userId;
  }

  getUserId(): number | null {
    return this.userId;
  }

  // Auth endpoints
  async login(email: string): Promise<User> {
    const response = await this.client.post<User>('/auth/login', { email });
    this.userId = response.data.id;
    return response.data;
  }

  async register(email: string): Promise<User> {
    const response = await this.client.post<User>('/auth/register', { email });
    this.userId = response.data.id;
    return response.data;
  }

  // Links endpoints
  async getLinks(): Promise<LinkListResponse> {
    const response = await this.client.get<LinkListResponse>('/links');
    return response.data;
  }

  async getLink(id: number): Promise<Link> {
    const response = await this.client.get<Link>(`/links/${id}`);
    return response.data;
  }

  async createLink(data: LinkCreate): Promise<Link> {
    const response = await this.client.post<Link>('/links', data);
    return response.data;
  }

  async updateLink(id: number, data: LinkUpdate): Promise<Link> {
    const response = await this.client.put<Link>(`/links/${id}`, data);
    return response.data;
  }

  async deleteLink(id: number): Promise<void> {
    await this.client.delete(`/links/${id}`);
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.client.get<DashboardStats>('/dashboard/stats');
    return response.data;
  }
}

// Create singleton instance
export const api = new ApiService();

// Error helper
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.detail || 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
}
