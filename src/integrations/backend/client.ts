import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Base URL for API requests
 * @remarks
 * Retrieved from the VITE_API_URL environment variable.
 * Defaults to 'http://localhost:8080' if not specified.
 * @const {string}
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/api';

export class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}${API_BASE_PATH}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add JWT token to requests if it exists
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public setAuthToken(token: string | null) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('accessToken', token);
    } else {
      delete this.client.defaults.headers.common['Authorization'];
      localStorage.removeItem('accessToken');
    }
  }
}

export const apiClient = new APIClient();
