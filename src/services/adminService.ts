import { API_CONFIG } from "@/config/api";
import type { User } from "@/types/auth";
import type { Category } from "@/types/category";
import type { Vocabulary } from "@/types/vocabulary";
import httpClient from "@/lib/httpClient";

interface AdminStats {
  totalUsers: number;
  totalVocabularies: number;
  totalCategories: number;
  recentActivity: number;
}

interface AdminUser extends User {
  userId?: string;
  lastLoginAt?: string;
  vocabularyCount?: number;
  status?: string;
}

interface AdminVocabulary extends Vocabulary {
  authorUsername?: string;
  createdBy?: string;
}

interface AdminCategory extends Omit<Category, "createdBy"> {
  createdBy?: string;
  authorUsername?: string;
}

class AdminService {
  // User Management
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const response = await httpClient.get(API_CONFIG.ENDPOINTS.ADMIN.USERS);

      console.log("Raw users response:", response);

      // Handle different response formats
      let users = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else if (response.data?.users) {
        users = response.data.users;
      } else if (response.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (Array.isArray(response)) {
        users = response;
      } else {
        users = response.data || [];
      }

      // Normalize user data to have consistent id field
      return users.map((user: any) => ({
        ...user,
        id: user.userId || user.id || user._id,
        userId: user.userId || user.id || user._id
      }));
    } catch (error: any) {
      console.error("Failed to fetch all users:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    try {
      console.log("Updating user role:", { userId, role });

      const response = await httpClient.patch(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${userId}`, {
        role
      });

      console.log("Update user role response:", response);

      // Handle different response formats
      if (response.data?.data) {
        return {
          ...response.data.data,
          id: response.data.data.userId || response.data.data.id,
          userId: response.data.data.userId || response.data.data.id
        };
      } else if (response.data?.user) {
        return {
          ...response.data.user,
          id: response.data.user.userId || response.data.user.id,
          userId: response.data.user.userId || response.data.user.id
        };
      } else {
        return {
          ...response.data,
          id: response.data.userId || response.data.id,
          userId: response.data.userId || response.data.id
        };
      }
    } catch (error: any) {
      console.error("Failed to update user role:", error);
      throw new Error(error.response?.data?.message || "Failed to update user role");
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      console.log("Deleting user:", userId);
      await httpClient.delete(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${userId}`);
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  }

  // Vocabulary Management
  async getAllVocabularies(): Promise<AdminVocabulary[]> {
    try {
      const response = await httpClient.get(API_CONFIG.ENDPOINTS.ADMIN.VOCABULARIES);

      console.log("Raw vocabularies response:", response);

      // Handle different response formats
      let vocabularies = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        vocabularies = response.data.data;
      } else if (response.data?.vocabularies) {
        vocabularies = response.data.vocabularies;
      } else if (response.data && Array.isArray(response.data)) {
        vocabularies = response.data;
      } else if (Array.isArray(response)) {
        vocabularies = response;
      } else {
        vocabularies = response.data || [];
      }

      return vocabularies;
    } catch (error: any) {
      console.error("Failed to fetch all vocabularies:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch vocabularies");
    }
  }

  async deleteVocabulary(vocabularyId: string): Promise<void> {
    try {
      await httpClient.delete(`${API_CONFIG.ENDPOINTS.VOCABULARIES}/${vocabularyId}`);
    } catch (error: any) {
      console.error("Failed to delete vocabulary:", error);
      throw new Error(error.response?.data?.message || "Failed to delete vocabulary");
    }
  }

  // Category Management
  async getAllCategories(): Promise<AdminCategory[]> {
    try {
      const response = await httpClient.get(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIES);

      console.log("Raw categories response:", response);

      // Handle different response formats
      let categories = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        categories = response.data.data;
      } else if (response.data?.categories) {
        categories = response.data.categories;
      } else if (response.data && Array.isArray(response.data)) {
        categories = response.data;
      } else if (Array.isArray(response)) {
        categories = response;
      } else {
        categories = response.data || [];
      }

      return categories;
    } catch (error: any) {
      console.error("Failed to fetch all categories:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch categories");
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await httpClient.delete(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`);
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      throw new Error(error.response?.data?.message || "Failed to delete category");
    }
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<AdminStats> {
    try {
      // Try to get stats from dedicated endpoint first
      try {
        const response = await httpClient.get(API_CONFIG.ENDPOINTS.ADMIN.STATS);
        return response.data?.data || response.data;
      } catch {
        // If no dedicated stats endpoint, compute from other endpoints
        const [users, vocabularies, categories] = await Promise.all([
          this.getAllUsers(),
          this.getAllVocabularies(),
          this.getAllCategories()
        ]);

        return {
          totalUsers: users.length,
          totalVocabularies: vocabularies.length,
          totalCategories: categories.length,
          recentActivity: 0 // Can't compute without additional data
        };
      }
    } catch (error: any) {
      console.error("Failed to fetch dashboard stats:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch dashboard stats");
    }
  }

  // Search Users
  async searchUsers(query: string): Promise<AdminUser[]> {
    try {
      const response = await httpClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}?search=${encodeURIComponent(query)}`);

      let users = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else if (response.data?.users) {
        users = response.data.users;
      } else if (response.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (Array.isArray(response)) {
        users = response;
      } else {
        users = response.data || [];
      }

      return users.map((user: any) => ({
        ...user,
        id: user.userId || user.id || user._id,
        userId: user.userId || user.id || user._id
      }));
    } catch (error: any) {
      console.error("Failed to search users:", error);
      throw new Error(error.response?.data?.message || "Failed to search users");
    }
  }

  // Search Vocabularies
  async searchVocabularies(query: string, category?: string): Promise<AdminVocabulary[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (category && category !== "all") params.append("category", category);

      const response = await httpClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.VOCABULARIES}?${params.toString()}`);

      let vocabularies = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        vocabularies = response.data.data;
      } else if (response.data?.vocabularies) {
        vocabularies = response.data.vocabularies;
      } else if (response.data && Array.isArray(response.data)) {
        vocabularies = response.data;
      } else if (Array.isArray(response)) {
        vocabularies = response;
      } else {
        vocabularies = response.data || [];
      }

      return vocabularies;
    } catch (error: any) {
      console.error("Failed to search vocabularies:", error);
      throw new Error(error.response?.data?.message || "Failed to search vocabularies");
    }
  }

  // Filter Users by Role
  async getUsersByRole(role?: string): Promise<AdminUser[]> {
    try {
      const params = role && role !== "all" ? `?role=${role}` : "";
      const response = await httpClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}${params}`);

      let users = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else if (response.data?.users) {
        users = response.data.users;
      } else if (response.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (Array.isArray(response)) {
        users = response;
      } else {
        users = response.data || [];
      }

      return users.map((user: any) => ({
        ...user,
        id: user.userId || user.id || user._id,
        userId: user.userId || user.id || user._id
      }));
    } catch (error: any) {
      console.error("Failed to filter users by role:", error);
      throw new Error(error.response?.data?.message || "Failed to filter users");
    }
  }
}

const adminService = new AdminService();
export default adminService;
