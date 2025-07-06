import { useEffect, useState } from "react";
import { API_CONFIG } from "@/config/api";
import authService from "@/services/authService";
import type { LoginRequest, RegisterRequest, User } from "@/types/auth";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user data from API
  const fetchUserData = async (accessToken: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS.ME}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();

        let userData = null;

        // Handle different response formats
        if (data.data && typeof data.data === "object") {
          // Backend format: { message: "...", data: { email, username, ... } }
          userData = data.data;
        } else if (data.user) {
          // Alternative format: { user: { email, username, ... } }
          userData = data.user;
        } else if (data.email && data.username) {
          // Direct format: { email, username, ... }
          userData = data;
        }

        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
          return userData;
        }
      } else {
        // If API call fails, clear invalid token
        authService.clearAuthData();
      }
    } catch (error) {
      // If API call fails, clear invalid token
      authService.clearAuthData();
    }

    return null;
  };

  // Function to check and update auth state from localStorage
  const checkAuthState = async () => {
    const accessToken = authService.getAccessToken();
    const storedUser = authService.getCurrentUser();

    if (accessToken) {
      if (storedUser) {
        // Both token and user data exist
        setUser(storedUser);
        setIsLoading(false);
      } else {
        // Token exists but no user data - fetch from API
        const userData = await fetchUserData(accessToken);
        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    } else {
      // No token - clear everything
      setUser(null);
      setIsLoading(false);
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    checkAuthState();
  }, []);

  // Listen for localStorage changes (for Google OAuth and other auth updates)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "accessToken" || event.key === "user") {
        checkAuthState();
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab localStorage changes
    const handleCustomStorageChange = () => {
      checkAuthState();
    };

    window.addEventListener("localStorageChanged", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChanged", handleCustomStorageChange);
    };
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const authResponse = await authService.login(credentials);
      setUser(authResponse.user);

      // Trigger custom storage change event
      window.dispatchEvent(new CustomEvent("localStorageChanged"));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.register(userData);
      // Registration doesn't auto-login, user stays in unauthenticated state
      // User needs to verify email and then login manually
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await authService.logout();
      setUser(null);

      // Trigger custom storage change event
      window.dispatchEvent(new CustomEvent("localStorageChanged"));
    } catch (err: any) {
      console.error("Logout error:", err);
      // Even if logout fails, clear local state
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const isAuthenticated = !!user && !!authService.getAccessToken();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError
  };
};
