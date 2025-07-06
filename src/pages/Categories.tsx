import { useEffect, useState } from "react";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";
import type { Vocabulary } from "@/types/vocabulary";
import { Book, Edit, Eye, Plus, Search, Trash2, TrendingUp, Volume2 } from "lucide-react";
import VocabularyForm from "@/components/VocabularyForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCategory } from "@/hooks/useCategory";
import { useVocabulary } from "@/hooks/useVocabulary";

interface CategoryFormProps {
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Category;
  mode?: "add" | "edit";
}

function CategoryForm({ onSubmit, onCancel, isLoading = false, initialData, mode = "add" }: CategoryFormProps) {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: "",
    description: "",
    color: "#3b82f6"
  });

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        color: initialData.color || "#3b82f6"
      });
    }
  }, [initialData, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("⚠️ Please enter a category name");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("❌ Failed to save category. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter category name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Category description (optional)"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <div className="flex items-center gap-2">
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="h-10 w-16"
          />
          <Input
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="#3b82f6"
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
              ? "Update Category"
              : "Create Category"}
        </Button>
        <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function Categories() {
  const {
    categories,
    selectedCategory,
    isLoading,
    error,
    stats,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories,
    fetchCategoryStats,
    clearError
  } = useCategory();

  const {
    vocabularies: categoryVocabularies,
    isLoading: vocabLoading,
    error: vocabError,
    getVocabulariesByCategory,
    createVocabulary,
    updateVocabulary,
    clearError: clearVocabError
  } = useVocabulary();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [showVocabulariesDialog, setShowVocabulariesDialog] = useState(false);
  const [showAddVocabDialog, setShowAddVocabDialog] = useState(false);
  const [editingVocabulary, setEditingVocabulary] = useState<Vocabulary | null>(null);

  // Listen for Add Word event from header
  useEffect(() => {
    const handleAddWord = () => {
      setEditingVocabulary(null);
      setShowAddVocabDialog(true);
    };

    window.addEventListener("openAddVocabulary", handleAddWord);
    return () => window.removeEventListener("openAddVocabulary", handleAddWord);
  }, []);

  // Load categories and stats on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Categories hook now automatically loads stats when fetching categories
        await fetchCategories();
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    loadData();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await fetchCategories();
      return;
    }

    try {
      await searchCategories(searchTerm.trim());
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    await fetchCategories();
  };

  const handleCreateCategory = async (categoryData: CreateCategoryRequest | UpdateCategoryRequest) => {
    try {
      await createCategory(categoryData as CreateCategoryRequest);
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleEditCategory = async (categoryData: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (!editingCategory) return;

    try {
      await updateCategory(editingCategory._id, categoryData as UpdateCategoryRequest);
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        await deleteCategory(id);
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleViewVocabularies = async (category: Category) => {
    setViewingCategory(category);
    setShowVocabulariesDialog(true);

    try {
      await getVocabulariesByCategory(category._id);
    } catch (err) {
      console.error("Failed to fetch vocabularies:", err);
    }
  };

  const handlePlayAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(console.error);
    }
  };

  const handleAddVocabulary = async (vocabularyData: any) => {
    try {
      await createVocabulary(vocabularyData);
      setShowAddVocabDialog(false);
      setEditingVocabulary(null);

      // Refresh categories to update vocabulary counts
      await fetchCategories();
    } catch (error) {
      console.error("Failed to add vocabulary:", error);
    }
  };

  const handleEditVocabulary = async (vocabularyData: any) => {
    if (!editingVocabulary) return;

    try {
      await updateVocabulary(editingVocabulary._id, vocabularyData);
      setShowAddVocabDialog(false);
      setEditingVocabulary(null);

      // Refresh the vocabularies list for current viewing category
      if (viewingCategory) {
        await getVocabulariesByCategory(viewingCategory._id);
      }

      // Refresh categories to update vocabulary counts
      await fetchCategories();
    } catch (error) {
      console.error("Failed to update vocabulary:", error);
    }
  };

  const handleFormSubmit = async (vocabularyData: any) => {
    if (editingVocabulary) {
      await handleEditVocabulary(vocabularyData);
    } else {
      await handleAddVocabulary(vocabularyData);
    }
  };

  const handleFormCancel = () => {
    setShowAddVocabDialog(false);
    setEditingVocabulary(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Page Header */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Category Management</h1>
            <p className="text-xl text-gray-600">Organize your vocabulary with custom categories</p>
          </div>

          {/* Search and Actions */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
              {searchTerm && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowStats(!showStats)} className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {showStats ? "Hide Stats" : "Show Stats"}
              </Button>

              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>Add a new category to organize your vocabulary.</DialogDescription>
                  <CategoryForm
                    onSubmit={handleCreateCategory}
                    onCancel={() => setShowCreateDialog(false)}
                    isLoading={isLoading}
                    mode="add"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-600">{error}</p>
              <Button onClick={clearError} variant="ghost" className="mt-2">
                Dismiss
              </Button>
            </div>
          )}

          {/* Category Statistics */}
          {showStats && stats && (
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stats.totalCategories}</div>
                    <p className="text-sm text-gray-600">Total Categories</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{stats.mostUsedCategory?.name || "N/A"}</div>
                    <p className="text-sm text-gray-600">Most Used Category</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {stats.vocabulariesByCategory.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                    <p className="text-sm text-gray-600">Total Vocabularies</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Categories Grid */}
          {categories.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category._id} className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: category.color || "#3b82f6" }}
                        />
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewVocabularies(category)}
                          className="h-8 w-8 p-0"
                          title="View vocabularies"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCategory(category)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category._id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {category.description && <p className="mb-2 text-sm text-gray-600">{category.description}</p>}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{category.vocabularyCount || 0} vocabularies</span>
                      <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Book className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-medium text-gray-900">No categories found</h3>
              <p className="mb-6 text-gray-600">
                {searchTerm ? "Try searching with different keywords" : "Create your first category to get started!"}
              </p>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Category
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          )}
        </div>
      </section>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update the category details.</DialogDescription>
          <CategoryForm
            onSubmit={handleEditCategory}
            onCancel={() => setEditingCategory(null)}
            isLoading={isLoading}
            initialData={editingCategory || undefined}
            mode="edit"
          />
        </DialogContent>
      </Dialog>

      {/* View Vocabularies Dialog */}
      <Dialog open={showVocabulariesDialog} onOpenChange={setShowVocabulariesDialog}>
        <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
          <DialogTitle>
            Vocabularies in "{viewingCategory?.name}"
            {viewingCategory && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({categoryVocabularies.length} {categoryVocabularies.length === 1 ? "word" : "words"})
              </span>
            )}
          </DialogTitle>
          <DialogDescription>All vocabulary words in this category</DialogDescription>

          {vocabError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-600">{vocabError}</p>
              <Button onClick={clearVocabError} variant="ghost" className="mt-2">
                Dismiss
              </Button>
            </div>
          )}

          {vocabLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading vocabularies...</p>
              </div>
            </div>
          ) : categoryVocabularies.length > 0 ? (
            <div className="space-y-4">
              {categoryVocabularies.map((vocabulary) => (
                <Card key={vocabulary._id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl font-bold text-gray-900">{vocabulary.word}</CardTitle>
                        {vocabulary.phonetic?.audio && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayAudio(vocabulary.phonetic!.audio!)}
                            className="h-8 w-8 p-0"
                          >
                            <Volume2 className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingVocabulary(vocabulary);
                          setShowAddVocabDialog(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                    {vocabulary.phonetic?.text && (
                      <p className="font-mono text-gray-600">/{vocabulary.phonetic.text}/</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vocabulary.meanings.map((meaning, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-3">
                          <div className="mb-1 flex items-center gap-2">
                            {meaning.partOfSpeech && (
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                {meaning.partOfSpeech}
                              </span>
                            )}
                          </div>
                          <p className="mb-2 font-medium text-gray-900">{meaning.meaning}</p>
                          {meaning.context && (
                            <p className="mb-2 text-sm text-gray-600">
                              <span className="font-medium">Context:</span> {meaning.context}
                            </p>
                          )}
                          {meaning.examples && meaning.examples.length > 0 && (
                            <div className="mt-2">
                              <p className="mb-1 text-sm font-medium text-gray-700">Examples:</p>
                              {meaning.examples.slice(0, 2).map((example, exIndex) => (
                                <div key={exIndex} className="mb-1 rounded bg-gray-50 p-2">
                                  <p className="text-sm text-gray-800 italic">"{example.sentence}"</p>
                                  {example.translation && (
                                    <p className="mt-1 text-xs text-gray-600">{example.translation}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Book className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No vocabularies found</h3>
              <p className="text-gray-600">This category doesn't have any vocabulary words yet.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Vocabulary Dialog */}
      <Dialog open={showAddVocabDialog} onOpenChange={setShowAddVocabDialog}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
          <DialogTitle>{editingVocabulary ? "Edit Vocabulary" : "Add New Vocabulary"}</DialogTitle>
          <DialogDescription>
            {editingVocabulary ? "Edit the details of the vocabulary" : "Enter the details of the new vocabulary"}
          </DialogDescription>
          <VocabularyForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={vocabLoading}
            initialData={editingVocabulary || undefined}
            mode={editingVocabulary ? "edit" : "add"}
            hideTitle={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
