import { API_CONFIG } from "@/config/api";
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class HttpClient {
  private instance: AxiosInstance;
  private refreshInstance: AxiosInstance; // Separate instance for refresh requests

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true // Important for cookies (JWT tokens)
    });

    // Separate instance for refresh token requests (no interceptors)
    this.refreshInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add access token from localStorage if available
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Use separate instance for refresh to avoid interceptor loop
            const refreshResponse = await this.refreshInstance.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN);

            // Try different possible response formats from backend
            let newAccessToken;
            if (refreshResponse.data?.data?.token?.accessToken) {
              // Format: { message: "...", data: { token: { accessToken: "..." } } }
              newAccessToken = refreshResponse.data.data.token.accessToken;
            } else if (refreshResponse.data?.token?.accessToken) {
              // Format: { message: "...", token: { accessToken: "..." } }
              newAccessToken = refreshResponse.data.token.accessToken;
            } else if (refreshResponse.data?.accessToken) {
              // Format: { accessToken: "..." }
              newAccessToken = refreshResponse.data.accessToken;
            } else {
              throw new Error("Invalid refresh token response format");
            }

            if (!newAccessToken) {
              throw new Error("No access token received");
            }

            // Update stored token
            localStorage.setItem("accessToken", newAccessToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.instance(originalRequest);
          } catch (refreshError: any) {
            // Refresh failed, clear tokens and redirect to login
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            // Only redirect if not already on login page
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }

            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

const httpClient = new HttpClient();
export default httpClient;
