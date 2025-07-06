import { useState } from "react";
import vocabularyService from "@/services/vocabularyService";
import type {
  CreateVocabularyRequest,
  SearchVocabularyRequest,
  UpdateVocabularyRequest,
  Vocabulary
} from "@/types/vocabulary";

interface UseVocabularyReturn {
  vocabularies: Vocabulary[];
  selectedVocabulary: Vocabulary | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchVocabularies: () => Promise<void>;
  fetchVocabulary: (id: string) => Promise<void>;
  createVocabulary: (data: CreateVocabularyRequest) => Promise<void>;
  updateVocabulary: (id: string, data: UpdateVocabularyRequest) => Promise<void>;
  deleteVocabulary: (id: string) => Promise<void>;
  searchVocabularies: (data: SearchVocabularyRequest) => Promise<void>;
  getVocabulariesByCategory: (categoryId: string) => Promise<void>;
  forceRefresh: () => Promise<void>;
  clearError: () => void;
  clearSelected: () => void;
}

export const useVocabulary = (): UseVocabularyReturn => {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache to prevent duplicate calls
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Removed auto-fetch on mount - let components control when to fetch
  // useEffect(() => {
  //   fetchVocabularies();
  // }, []);

  const fetchVocabularies = async (): Promise<void> => {
    // Prevent duplicate calls if already fetching or initialized with data
    if (isFetching || (isInitialized && vocabularies.length > 0)) {
      return;
    }

    setIsFetching(true);
    setIsLoading(true);
    setError(null);

    try {
      const data = await vocabularyService.getAllVocabularies();
      setVocabularies(data);
      setIsInitialized(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  const fetchVocabulary = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await vocabularyService.getVocabulary(id);
      setSelectedVocabulary(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createVocabulary = async (vocabularyData: CreateVocabularyRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const newVocabulary = await vocabularyService.createVocabulary(vocabularyData);
      setVocabularies((prev) => [newVocabulary, ...prev]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVocabulary = async (id: string, vocabularyData: UpdateVocabularyRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedVocabulary = await vocabularyService.updateVocabulary(id, vocabularyData);
      setVocabularies((prev) => prev.map((vocab) => (vocab._id === id ? updatedVocabulary : vocab)));
      if (selectedVocabulary?._id === id) {
        setSelectedVocabulary(updatedVocabulary);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVocabulary = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await vocabularyService.deleteVocabulary(id);
      setVocabularies((prev) => prev.filter((vocab) => vocab._id !== id));
      if (selectedVocabulary?._id === id) {
        setSelectedVocabulary(null);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchVocabularies = async (searchData: SearchVocabularyRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await vocabularyService.searchVocabularies(searchData);
      setVocabularies(data);
      // Don't set isInitialized for search results as they are filtered
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getVocabulariesByCategory = async (categoryId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await vocabularyService.getVocabulariesByCategory(categoryId);
      setVocabularies(data);
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
    setSelectedVocabulary(null);
  };

  // Force refresh - bypasses cache
  const forceRefresh = async (): Promise<void> => {
    setIsInitialized(false);
    setIsFetching(false);
    await fetchVocabularies();
  };

  return {
    vocabularies,
    selectedVocabulary,
    isLoading,
    error,
    fetchVocabularies,
    fetchVocabulary,
    createVocabulary,
    updateVocabulary,
    deleteVocabulary,
    searchVocabularies,
    getVocabulariesByCategory,
    forceRefresh,
    clearError,
    clearSelected
  };
};
