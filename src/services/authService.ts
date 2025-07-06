import { API_CONFIG } from "@/config/api";
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenResponse,
  RegisterRequest,
  VerifyEmailRequest
} from "@/types/auth";
import httpClient from "@/lib/httpClient";

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);

      // Backend response format: { message: "...", data: { account: {...}, token: { accessToken: "..." } } }
      const { data } = response;

      // Extract tokens and user info
      const accessToken = data.token.accessToken;
      const user = data.account; // Backend calls it 'account', frontend calls it 'user'

      // Store tokens (refreshToken comes from httpOnly cookie, we don't store it in localStorage)
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Return in format expected by frontend
      return {
        accessToken,
        refreshToken: "", // This comes from httpOnly cookie
        user
      };
    } catch (error: any) {
      // Handle error response
      if (error.response?.data?.errors) {
        const errorMessage = error.response.data.errors[0]?.message || "Login failed";
        throw new Error(errorMessage);
      }
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  async register(userData: RegisterRequest): Promise<void> {
    try {
      await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);

      // Registration successful - backend just returns success message
      // No tokens are returned, user needs to verify email first
    } catch (error: any) {
      // Handle error response
      if (error.response?.data?.errors) {
        const errorMessage = error.response.data.errors[0]?.message || "Registration failed";
        throw new Error(errorMessage);
      }
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Even if logout fails on server, we should clear local data
      console.error("Logout error:", error);
    } finally {
      this.clearAuthData();
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const response = await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN);

      // Backend response format: { message: "...", data: { token: { accessToken: "..." } } }
      const accessToken = response.data.token.accessToken;

      // Update stored access token
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return { accessToken };
    } catch (error: any) {
      this.clearAuthData();

      // Handle error response
      if (error.response?.data?.errors) {
        const errorMessage = error.response.data.errors[0]?.message || "Token refresh failed";
        throw new Error(errorMessage);
      }
      throw new Error(error.response?.data?.message || "Token refresh failed");
    }
  }

  async verifyEmail(verificationData: VerifyEmailRequest): Promise<void> {
    try {
      await httpClient.get(`${API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${verificationData.token}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Email verification failed");
    }
  }

  async initiateGoogleAuth(): Promise<string> {
    try {
      console.log("Calling Google OAuth API:", `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.GOOGLE}`);

      const response = await httpClient.get(API_CONFIG.ENDPOINTS.AUTH.GOOGLE);

      console.log("Google OAuth API response:", response);

      // Check if response has the expected structure
      if (!response) {
        throw new Error("No response received");
      }

      // Backend returns URL directly in response, not nested under data
      if (response.url) {
        return response.url;
      }

      // Also check for nested data format in case backend changes
      if (response.data?.url) {
        return response.data.url;
      }

      console.log("Response data:", response);
      throw new Error("No URL found in response");
    } catch (error: any) {
      console.error("Google OAuth API error:", error);

      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        // More specific error messages
        if (error.response.status === 404) {
          throw new Error("Google OAuth endpoint not found. Please check if backend is running and endpoint exists.");
        }
        if (error.response.status === 500) {
          throw new Error("Server error when initiating Google OAuth. Please try again later.");
        }

        throw new Error(
          error.response?.data?.message || `HTTP ${error.response.status}: Failed to initiate Google authentication`
        );
      }

      if (error.request) {
        throw new Error("Network error: Cannot connect to backend. Please check if backend is running.");
      }

      throw new Error(error.message || "Unknown error occurred during Google OAuth initiation");
    }
  }

  // Helper methods
  clearAuthData(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

const authService = new AuthService();
export default authService;
