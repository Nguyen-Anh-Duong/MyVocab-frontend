import { useState } from "react";
import categoryService from "@/services/categoryService";
import type { Category, CategoryStats, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";

interface UseCategoryReturn {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  stats: CategoryStats | null;

  // Actions
  fetchCategories: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  createCategory: (data: CreateCategoryRequest) => Promise<void>;
  updateCategory: (id: string, data: UpdateCategoryRequest) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  searchCategories: (query: string) => Promise<void>;
  fetchCategoryStats: () => Promise<void>;
  clearError: () => void;
  clearSelected: () => void;
}

export const useCategory = (): UseCategoryReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CategoryStats | null>(null);

  const fetchCategories = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch both categories and stats in parallel
      const [categoriesData, statsData] = await Promise.all([
        categoryService.getAllCategories(),
        categoryService.getCategoryStats().catch(() => null) // Don't fail if stats fail
      ]);

      // Merge vocabulary counts from stats into categories
      const categoriesWithCounts = categoriesData.map((category) => {
        let vocabularyCount = 0;

        // Find matching category in stats data (which has vocabularyCount)
        if (statsData && Array.isArray(statsData)) {
          const statsEntry = statsData.find((statsCat) => statsCat._id === category._id);
          vocabularyCount = statsEntry?.vocabularyCount || 0;
        }

        return {
          ...category,
          vocabularyCount
        };
      });

      setCategories(categoriesWithCounts);

      // Build CategoryStats object from the array for compatibility
      if (statsData && Array.isArray(statsData)) {
        const totalCategories = statsData.length;

        // Find most used category
        let mostUsedCategory: Category | null = null;
        if (statsData.length > 0) {
          mostUsedCategory = statsData.reduce((max, cat) => {
            const maxCount = max?.vocabularyCount || 0;
            const catCount = cat.vocabularyCount || 0;
            return catCount > maxCount ? cat : max;
          });
        }

        const vocabulariesByCategory = statsData.map((cat) => ({
          category: cat,
          count: cat.vocabularyCount || 0
        }));

        setStats({
          totalCategories,
          mostUsedCategory,
          vocabulariesByCategory
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategory = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await categoryService.getCategory(id);
      setSelectedCategory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (categoryData: CreateCategoryRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const newCategory = await categoryService.createCategory(categoryData);
      setCategories((prev) => [newCategory, ...prev]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, categoryData: UpdateCategoryRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedCategory = await categoryService.updateCategory(id, categoryData);
      setCategories((prev) => prev.map((cat) => (cat._id === id ? updatedCategory : cat)));
      if (selectedCategory?._id === id) {
        setSelectedCategory(updatedCategory);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await categoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      if (selectedCategory?._id === id) {
        setSelectedCategory(null);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchCategories = async (query: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch search results and stats in parallel
      const [searchData, statsData] = await Promise.all([
        categoryService.searchCategories(query),
        categoryService.getCategoryStats().catch(() => null) // Don't fail if stats fail
      ]);

      // Ensure searchData is an array (should be fixed now)
      const searchArray = Array.isArray(searchData) ? searchData : [];

      // Merge vocabulary counts from stats into search results
      const categoriesWithCounts = searchArray.map((category) => {
        let vocabularyCount = 0;

        // Find matching category in stats data (which has vocabularyCount)
        if (statsData && Array.isArray(statsData)) {
          const statsEntry = statsData.find((statsCat) => statsCat._id === category._id);
          vocabularyCount = statsEntry?.vocabularyCount || 0;
        }

        return {
          ...category,
          vocabularyCount
        };
      });

      setCategories(categoriesWithCounts);

      // Build CategoryStats object from the array for compatibility
      if (statsData && Array.isArray(statsData)) {
        const totalCategories = statsData.length;

        // Find most used category
        let mostUsedCategory: Category | null = null;
        if (statsData.length > 0) {
          mostUsedCategory = statsData.reduce((max, cat) => {
            const maxCount = max?.vocabularyCount || 0;
            const catCount = cat.vocabularyCount || 0;
            return catCount > maxCount ? cat : max;
          });
        }

        const vocabulariesByCategory = statsData.map((cat) => ({
          category: cat,
          count: cat.vocabularyCount || 0
        }));

        setStats({
          totalCategories,
          mostUsedCategory,
          vocabulariesByCategory
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryStats = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const statsData = await categoryService.getCategoryStats();

      // Build CategoryStats object from the array
      if (statsData && Array.isArray(statsData)) {
        const totalCategories = statsData.length;

        // Find most used category
        let mostUsedCategory: Category | null = null;
        if (statsData.length > 0) {
          mostUsedCategory = statsData.reduce((max, cat) => {
            const maxCount = max?.vocabularyCount || 0;
            const catCount = cat.vocabularyCount || 0;
            return catCount > maxCount ? cat : max;
          });
        }

        const vocabulariesByCategory = statsData.map((cat) => ({
          category: cat,
          count: cat.vocabularyCount || 0
        }));

        setStats({
          totalCategories,
          mostUsedCategory,
          vocabulariesByCategory
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const clearSelected = (): void => {
    setSelectedCategory(null);
  };

  return {
    categories,
    selectedCategory,
    isLoading,
    error,
    stats,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories,
    fetchCategoryStats,
    clearError,
    clearSelected
  };
};
