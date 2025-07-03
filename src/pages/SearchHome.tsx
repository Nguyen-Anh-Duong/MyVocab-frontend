import { useEffect, useState } from "react";
import type { Category } from "@/types/category";
import type { Vocabulary } from "@/types/vocabulary";
import { Book, Edit, Filter, Plus, Search, Trash2, Volume2, X } from "lucide-react";
import VocabularyForm from "@/components/VocabularyForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCategory } from "@/hooks/useCategory";
import { useVocabulary } from "@/hooks/useVocabulary";

// Helper function to get category color
const getCategoryColor = (categoryName: string, categories: Category[]): string => {
  const category = categories.find((cat) => cat.name === categoryName);
  return category?.color || "#6b7280"; // Default gray color if no color found
};

// Helper function to get contrasting text color based on background
const getTextColor = (backgroundColor: string): string => {
  // Convert hex to RGB
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black for light colors, white for dark colors
  return brightness > 128 ? "#000000" : "#ffffff";
};

interface VocabularyResultProps {
  vocabulary: Vocabulary;
  onEdit: (vocab: Vocabulary) => void;
  onDelete: (id: string) => void;
  categories: Category[];
}

function VocabularyResult({ vocabulary, onEdit, onDelete, categories }: VocabularyResultProps) {
  const handlePlayAudio = () => {
    if (vocabulary.phonetic?.audio) {
      const audio = new Audio(vocabulary.phonetic.audio);
      audio.play().catch(console.error);
    }
  };

  return (
    <Card className="w-full border-l-4 border-l-blue-500 transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-bold text-gray-900">{vocabulary.word}</CardTitle>
            {vocabulary.phonetic?.audio && (
              <Button variant="ghost" size="sm" onClick={handlePlayAudio} className="h-8 w-8 p-0">
                <Volume2 className="h-4 w-4 text-blue-600" />
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(vocabulary)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(vocabulary._id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {vocabulary.phonetic?.text && <p className="font-mono text-lg text-gray-600">/{vocabulary.phonetic.text}/</p>}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {vocabulary.meanings.map((meaning, index) => (
            <div key={index} className="border-l-3 border-blue-200 pl-4">
              <div className="mb-2 flex items-center gap-2">
                {meaning.partOfSpeech && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {meaning.partOfSpeech}
                  </span>
                )}
              </div>
              <p className="mb-2 text-lg font-medium text-gray-900">{meaning.meaning}</p>
              {meaning.context && (
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-medium">Context:</span> {meaning.context}
                </p>
              )}
              {meaning.examples && meaning.examples.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2 text-sm font-medium text-gray-700">Examples:</p>
                  {meaning.examples.slice(0, 3).map((example, exIndex) => (
                    <div key={exIndex} className="mb-2 rounded bg-gray-50 p-2">
                      <p className="text-sm text-gray-800 italic">"{example.sentence}"</p>
                      {example.translation && <p className="mt-1 text-xs text-gray-600">{example.translation}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {vocabulary.categories && vocabulary.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {vocabulary.categories.map((category, index) => {
                const backgroundColor = getCategoryColor(category, categories);
                const textColor = getTextColor(backgroundColor);

                return (
                  <span
                    key={index}
                    className="rounded-full px-3 py-1 text-sm font-medium"
                    style={{
                      backgroundColor: backgroundColor,
                      color: textColor
                    }}
                  >
                    #{category}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SearchHome() {
  const { user, logout } = useAuth();
  const {
    vocabularies,
    isLoading,
    error,
    searchVocabularies,
    fetchVocabularies,
    deleteVocabulary,
    createVocabulary,
    updateVocabulary,
    clearError
  } = useVocabulary();
  const { categories, fetchCategories } = useCategory();

  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [recentVocabularies, setRecentVocabularies] = useState<Vocabulary[]>([]);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingVocabulary, setEditingVocabulary] = useState<Vocabulary | null>(null);

  // Category filtering
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Listen for Add Word event from header
  useEffect(() => {
    const handleAddWord = () => {
      setEditingVocabulary(null);
      setShowFormDialog(true);
    };

    window.addEventListener("openAddVocabulary", handleAddWord);
    return () => window.removeEventListener("openAddVocabulary", handleAddWord);
  }, []);

  // Load recent vocabularies and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchVocabularies(), fetchCategories()]);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    loadData();
  }, []);

  // Set recent vocabularies (last 5) and apply category filter
  useEffect(() => {
    if (vocabularies.length > 0) {
      let filteredVocabs = vocabularies;

      // Apply category filter
      if (selectedCategories.length > 0) {
        filteredVocabs = vocabularies.filter((vocab) =>
          vocab.categories?.some((category) => selectedCategories.includes(category))
        );
      }

      if (!hasSearched) {
        setRecentVocabularies(filteredVocabs.slice(0, 5));
      }
    }
  }, [vocabularies, hasSearched, selectedCategories]);

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((cat) => cat !== categoryName) : [...prev, categoryName]
    );
  };

  const clearCategoryFilter = () => {
    setSelectedCategories([]);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setHasSearched(true);
    try {
      await searchVocabularies({ word: searchTerm.trim() });
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    setHasSearched(false);
    await fetchVocabularies();
  };

  const handleEdit = (vocabulary: Vocabulary) => {
    setEditingVocabulary(vocabulary);
    setShowFormDialog(true);
  };

  const handleAddNew = () => {
    setEditingVocabulary(null);
    setShowFormDialog(true);
  };

  const handleFormSubmit = async (vocabularyData: any) => {
    try {
      if (editingVocabulary) {
        // Update existing vocabulary
        await updateVocabulary(editingVocabulary._id, vocabularyData);
      } else {
        // Create new vocabulary
        await createVocabulary(vocabularyData);
      }

      setShowFormDialog(false);
      setEditingVocabulary(null);

      // Refresh the list
      if (hasSearched) {
        await searchVocabularies({ word: searchTerm });
      } else {
        await fetchVocabularies();
      }
    } catch (error) {
      console.error("Failed to save vocabulary:", error);
      // Error is handled by useVocabulary hook
    }
  };

  const handleFormCancel = () => {
    setShowFormDialog(false);
    setEditingVocabulary(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this vocabulary?")) {
      try {
        await deleteVocabulary(id);
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Apply category filter to both search results and recent vocabularies
  const getFilteredVocabularies = (vocabs: Vocabulary[]) => {
    if (selectedCategories.length === 0) {
      return vocabs;
    }
    return vocabs.filter((vocab) => vocab.categories?.some((category) => selectedCategories.includes(category)));
  };

  const displayVocabularies = hasSearched ? getFilteredVocabularies(vocabularies) : recentVocabularies;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Search Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Expand Your Vocabulary</h2>
          <p className="mb-8 text-xl text-gray-600">Search and discover words in your personal vocabulary collection</p>

          {/* Search Box */}
          <div className="relative mx-auto mb-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for any word..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="rounded-xl border-2 border-gray-200 py-4 pr-4 pl-12 text-lg shadow-lg focus:border-blue-500"
              />
            </div>

            {/* Category Filter Toggle */}
            <div className="mt-4 flex justify-center gap-3">
              <Button
                onClick={handleSearch}
                disabled={isLoading || !searchTerm.trim()}
                className="bg-blue-600 px-8 py-2 hover:bg-blue-700"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className="px-6 py-2"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {selectedCategories.length > 0 && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
                    {selectedCategories.length}
                  </span>
                )}
              </Button>

              {hasSearched && (
                <Button variant="outline" onClick={handleClearSearch} className="px-6 py-2">
                  Clear Results
                </Button>
              )}
            </div>

            {/* Category Filter Panel */}
            {showCategoryFilter && (
              <div className="mt-4 rounded-lg border bg-white p-4 shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Filter by Categories</h3>
                  {selectedCategories.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearCategoryFilter} className="text-sm text-gray-500">
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Selected Categories */}
                {selectedCategories.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-2 text-sm text-gray-600">Selected:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((categoryName) => {
                        const backgroundColor = getCategoryColor(categoryName, categories);
                        const textColor = getTextColor(backgroundColor);

                        return (
                          <span
                            key={categoryName}
                            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
                            style={{
                              backgroundColor: backgroundColor,
                              color: textColor
                            }}
                          >
                            #{categoryName}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCategoryToggle(categoryName)}
                              className="h-4 w-4 p-0 hover:opacity-70"
                              style={{ color: textColor }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Available Categories */}
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter((cat) => !selectedCategories.includes(cat.name))
                    .map((category) => {
                      const backgroundColor = category.color || "#6b7280";
                      const textColor = getTextColor(backgroundColor);

                      return (
                        <Button
                          key={category._id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleCategoryToggle(category.name)}
                          className="border-2 text-xs hover:opacity-80"
                          style={{
                            borderColor: backgroundColor,
                            color: backgroundColor
                          }}
                        >
                          {category.name}
                          {category.vocabularyCount !== undefined && (
                            <span className="ml-1 opacity-70">({category.vocabularyCount})</span>
                          )}
                        </Button>
                      );
                    })}
                </div>

                {categories.length === 0 && <p className="text-sm text-gray-500">No categories available</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-600">{error}</p>
              <Button onClick={clearError} variant="ghost" className="mt-2">
                Try Again
              </Button>
            </div>
          )}

          {/* Section Title */}
          {displayVocabularies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {hasSearched ? `Search Results (${displayVocabularies.length})` : "Recent Vocabularies"}
                {selectedCategories.length > 0 && (
                  <span className="text-lg font-normal text-gray-600">
                    {hasSearched ? " in " : " from "}
                    {selectedCategories.length === 1
                      ? `"${selectedCategories[0]}"`
                      : `${selectedCategories.length} categories`}
                  </span>
                )}
              </h3>
              {!hasSearched && selectedCategories.length === 0 && (
                <p className="mt-2 text-gray-600">
                  Your latest added words •{" "}
                  <Button variant="link" className="p-0" onClick={fetchVocabularies}>
                    View all
                  </Button>
                </p>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Searching your vocabulary...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {!isLoading && displayVocabularies.length > 0 && (
            <div className="space-y-6">
              {displayVocabularies.map((vocabulary) => (
                <VocabularyResult
                  key={vocabulary._id}
                  vocabulary={vocabulary}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  categories={categories}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && displayVocabularies.length === 0 && (
            <div className="py-12 text-center">
              <Book className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-medium text-gray-900">
                {hasSearched ? "No words found" : "No vocabularies yet"}
              </h3>
              <p className="mb-6 text-gray-600">
                {hasSearched
                  ? "Try searching with different keywords or check your spelling"
                  : "Start building your vocabulary by adding your first word!"}
              </p>
              <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Word
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Vocabulary Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
          <DialogTitle>{editingVocabulary ? "Edit Vocabulary" : "Add New Vocabulary"}</DialogTitle>
          <DialogDescription>
            {editingVocabulary ? "Edit the details of the vocabulary" : "Enter the details of the new vocabulary"}
          </DialogDescription>
          <VocabularyForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isLoading}
            initialData={editingVocabulary || undefined}
            mode={editingVocabulary ? "edit" : "add"}
            hideTitle={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SearchHome;
