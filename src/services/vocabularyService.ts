import { API_CONFIG } from "@/config/api";
import type { ApiResponse } from "@/types/auth";
import type {
  CreateVocabularyRequest,
  SearchVocabularyRequest,
  UpdateVocabularyRequest,
  Vocabulary,
  VocabularyResponse
} from "@/types/vocabulary";
import httpClient from "@/lib/httpClient";
import categoryService from "./categoryService";

class VocabularyService {
  // Helper method to map category IDs to names
  private async mapCategoryIdsToNames(vocabularies: Vocabulary[]): Promise<Vocabulary[]> {
    try {
      // Safety check: ensure vocabularies is an array
      if (!Array.isArray(vocabularies)) {
        console.warn("mapCategoryIdsToNames received non-array:", vocabularies);
        return [];
      }

      const categories = await categoryService.getAllCategories();
      const categoryMap = new Map(categories.map((cat) => [cat._id, cat.name]));

      return vocabularies.map((vocab) => ({
        ...vocab,
        categories: vocab.categories?.map((categoryId) => {
          // If it's already a name (doesn't look like MongoDB ObjectId), return as-is
          if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
            return categoryId;
          }
          // Otherwise, map ID to name
          return categoryMap.get(categoryId) || categoryId;
        })
      }));
    } catch (error) {
      console.warn("Failed to map category IDs to names:", error);
      // Return original data if mapping fails, ensure it's an array
      return Array.isArray(vocabularies) ? vocabularies : [];
    }
  }

  async getAllVocabularies(): Promise<Vocabulary[]> {
    try {
      const response: ApiResponse<Vocabulary[]> = await httpClient.get(API_CONFIG.ENDPOINTS.VOCABULARIES);

      // Map category IDs to names
      const mappedVocabularies = await this.mapCategoryIdsToNames(response.data);

      return mappedVocabularies;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch vocabularies");
    }
  }

  async getVocabulary(id: string): Promise<Vocabulary> {
    try {
      const response: ApiResponse<Vocabulary> = await httpClient.get(`${API_CONFIG.ENDPOINTS.VOCABULARIES}/${id}`);

      // Map category IDs to names for single vocabulary
      const mappedVocabularies = await this.mapCategoryIdsToNames([response.data]);
      return mappedVocabularies[0];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch vocabulary");
    }
  }

  async createVocabulary(vocabularyData: CreateVocabularyRequest): Promise<Vocabulary> {
    try {
      const response: ApiResponse<Vocabulary> = await httpClient.post(
        API_CONFIG.ENDPOINTS.VOCABULARIES,
        vocabularyData
      );

      // Map category IDs to names for created vocabulary
      const mappedVocabularies = await this.mapCategoryIdsToNames([response.data]);
      return mappedVocabularies[0];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create vocabulary");
    }
  }

  async updateVocabulary(id: string, vocabularyData: UpdateVocabularyRequest): Promise<Vocabulary> {
    try {
      const response: ApiResponse<Vocabulary> = await httpClient.patch(
        `${API_CONFIG.ENDPOINTS.VOCABULARIES}/${id}`,
        vocabularyData
      );

      // Map category IDs to names for updated vocabulary
      const mappedVocabularies = await this.mapCategoryIdsToNames([response.data]);
      return mappedVocabularies[0];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update vocabulary");
    }
  }

  async deleteVocabulary(id: string): Promise<void> {
    try {
      await httpClient.delete(`${API_CONFIG.ENDPOINTS.VOCABULARIES}/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete vocabulary");
    }
  }

  async getVocabulariesByCategory(categoryId: string): Promise<Vocabulary[]> {
    try {
      const response: ApiResponse<{
        category: any;
        vocabularies: Vocabulary[];
      }> = await httpClient.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}/vocabularies`);

      // Log the response to debug the structure
      console.log("API Response for getVocabulariesByCategory:", response.data);

      // Extract vocabularies array from the response structure
      let vocabulariesArray: Vocabulary[] = [];

      if (response.data && response.data.vocabularies && Array.isArray(response.data.vocabularies)) {
        vocabulariesArray = response.data.vocabularies;
      } else {
        console.warn("Unexpected response structure, vocabularies not found:", response.data);
        vocabulariesArray = [];
      }

      // Since categories are already objects with names in this API,
      // we need to extract just the names for consistency with other APIs
      const processedVocabularies = vocabulariesArray.map((vocab) => ({
        ...vocab,
        categories: vocab.categories?.map((category: any) => {
          // If it's already an object with name, extract the name
          if (typeof category === "object" && category.name) {
            return category.name;
          }
          // If it's a string ID, keep as is (shouldn't happen with this API)
          return category;
        })
      }));

      return processedVocabularies;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch vocabularies by category");
    }
  }

  async searchVocabularies(searchData: SearchVocabularyRequest): Promise<Vocabulary[]> {
    try {
      const response: ApiResponse<Vocabulary[]> = await httpClient.get(`${API_CONFIG.ENDPOINTS.VOCABULARIES}/search`, {
        params: searchData
      });

      // Map category IDs to names for search results
      const mappedVocabularies = await this.mapCategoryIdsToNames(response.data);
      return mappedVocabularies;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to search vocabularies");
    }
  }
}

const vocabularyService = new VocabularyService();
export default vocabularyService;
