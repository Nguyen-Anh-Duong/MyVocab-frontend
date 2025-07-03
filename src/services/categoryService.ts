import { API_CONFIG } from "@/config/api";
import type { ApiResponse } from "@/types/auth";
import type { Category, CategoryStats, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";
import httpClient from "@/lib/httpClient";

class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    try {
      const response: ApiResponse<Category[]> = await httpClient.get(API_CONFIG.ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch categories");
    }
  }

  async getCategory(id: string): Promise<Category> {
    try {
      const response: ApiResponse<Category> = await httpClient.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch category");
    }
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    try {
      const response: ApiResponse<Category> = await httpClient.post(API_CONFIG.ENDPOINTS.CATEGORIES, categoryData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create category");
    }
  }

  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<Category> {
    try {
      const response: ApiResponse<Category> = await httpClient.patch(
        `${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`,
        categoryData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update category");
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await httpClient.delete(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete category");
    }
  }

  async getCategoryStats(): Promise<Category[]> {
    try {
      const response: ApiResponse<Category[]> = await httpClient.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}/stats`);

      // Backend returns array of categories with vocabularyCount already populated
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch category statistics");
    }
  }

  async searchCategories(query: string): Promise<Category[]> {
    try {
      const response: ApiResponse<{ categories: Category[] }> = await httpClient.get(
        `${API_CONFIG.ENDPOINTS.CATEGORIES}/search`,
        {
          params: { q: query }
        }
      );

      // Extract categories array from response object
      return response.data.categories || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to search categories");
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;
