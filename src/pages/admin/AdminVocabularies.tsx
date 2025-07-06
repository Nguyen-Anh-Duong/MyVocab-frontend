import { useEffect, useState } from "react";
import adminService from "@/services/adminService";
import { AlertCircle, Edit, Eye, FileText, Filter, Search, Trash2 } from "lucide-react";
import VocabularyDetailModal from "@/components/VocabularyDetailModal";
import VocabularyEditModal from "@/components/VocabularyEditModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminVocabularies() {
  const [vocabularies, setVocabularies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredVocabularies, setFilteredVocabularies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVocabularyId, setSelectedVocabularyId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterVocabularies();
  }, [vocabularies, searchTerm, categoryFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch vocabularies and categories in parallel
      const [vocabulariesData, categoriesData] = await Promise.all([
        adminService.getAllVocabularies(),
        adminService.getAllCategories()
      ]);

      console.log("Vocabularies data:", vocabulariesData);
      console.log("Categories data:", categoriesData);

      setVocabularies(vocabulariesData);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError(err.message);
      setVocabularies([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVocabularies = () => {
    let filtered = [...vocabularies];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (vocab) =>
          vocab.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vocab.meanings?.some(
            (m: any) =>
              m.definitions?.some((def: any) => def.definition?.toLowerCase().includes(searchTerm.toLowerCase())) ||
              m.meaning?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (vocab) =>
          vocab.category?.id === categoryFilter ||
          vocab.category?._id === categoryFilter ||
          vocab.categories?.includes(categoryFilter)
      );
    }

    setFilteredVocabularies(filtered);
  };

  // Modal handlers
  const handleViewVocabulary = (vocabularyId: string) => {
    setSelectedVocabularyId(vocabularyId);
    setViewModalOpen(true);
  };

  const handleEditVocabulary = (vocabularyId: string) => {
    setSelectedVocabularyId(vocabularyId);
    setEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedVocabularyId(null);
  };

  const handleVocabularyUpdated = (updatedVocabulary: any) => {
    // Update vocabulary in local state
    setVocabularies((prev) =>
      prev.map((vocab) =>
        (vocab.id || vocab._id) === (updatedVocabulary.id || updatedVocabulary._id) ? updatedVocabulary : vocab
      )
    );
  };

  const handleDeleteVocabulary = async (vocabId: string) => {
    if (!confirm("Are you sure you want to delete this vocabulary? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(vocabId);
      await adminService.deleteVocabulary(vocabId);

      // Update local state
      setVocabularies(vocabularies.filter((vocab) => (vocab.id || vocab._id) !== vocabId));

      alert("Vocabulary deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete vocabulary:", err);
      alert(`Failed to delete vocabulary: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getVocabularyStats = () => {
    const totalVocabularies = vocabularies.length;
    const recentVocabularies = vocabularies.filter(
      (vocab) => vocab.createdAt && new Date(vocab.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const withAudio = vocabularies.filter((vocab) => vocab.phonetic?.audio).length;
    const categoriesUsed = categories.length;

    return { totalVocabularies, recentVocabularies, withAudio, categoriesUsed };
  };

  const stats = getVocabularyStats();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vocabulary Management</h1>
          <p className="text-gray-600">Manage all vocabulary entries across users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            Refresh
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Bulk Actions
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-600">Failed to load data: {error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by word or definition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id || category._id} value={category.id || category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalVocabularies}</div>
            <p className="text-sm text-gray-600">Total Vocabularies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.recentVocabularies}</div>
            <p className="text-sm text-gray-600">Recent (7 days)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.categoriesUsed}</div>
            <p className="text-sm text-gray-600">Categories Used</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.withAudio}</div>
            <p className="text-sm text-gray-600">With Audio</p>
          </CardContent>
        </Card>
      </div>

      {/* Vocabularies List */}
      <Card>
        <CardHeader>
          <CardTitle>Vocabularies ({filteredVocabularies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVocabularies.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                {error ? "Failed to load vocabularies" : "No vocabularies found"}
              </div>
            ) : (
              filteredVocabularies.map((vocab) => (
                <div key={vocab.id || vocab._id} className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{vocab.word}</h3>
                        {vocab.phonetic?.text && (
                          <span className="font-mono text-sm text-gray-500">{vocab.phonetic.text}</span>
                        )}
                        {vocab.category && (
                          <span
                            className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: (vocab.category.color || "#3B82F6") + "20",
                              color: vocab.category.color || "#3B82F6"
                            }}
                          >
                            {vocab.category.name}
                          </span>
                        )}
                      </div>

                      <div className="mb-3 space-y-2">
                        {vocab.meanings?.slice(0, 2).map((meaning: any, index: number) => (
                          <div key={index}>
                            <span className="mr-2 inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 capitalize">
                              {meaning.partOfSpeech}
                            </span>
                            <span className="text-sm text-gray-700">
                              {meaning.definitions?.[0]?.definition || meaning.meaning}
                            </span>
                          </div>
                        ))}
                        {vocab.meanings?.length > 2 && (
                          <span className="text-xs text-gray-500">+{vocab.meanings.length - 2} more meaning(s)</span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {vocab.authorUsername && <span>By: {vocab.authorUsername}</span>}
                        {vocab.createdAt && <span>Created: {formatDate(vocab.createdAt)}</span>}
                        {vocab.updatedAt && <span>Updated: {formatDate(vocab.updatedAt)}</span>}
                      </div>
                    </div>

                    <div className="ml-4 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View details"
                        onClick={() => handleViewVocabulary(vocab.id || vocab._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Edit vocabulary"
                        onClick={() => handleEditVocabulary(vocab.id || vocab._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVocabulary(vocab.id || vocab._id)}
                        disabled={actionLoading === (vocab.id || vocab._id)}
                        title="Delete vocabulary"
                        className="text-red-600 hover:text-red-700"
                      >
                        {actionLoading === (vocab.id || vocab._id) ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <VocabularyDetailModal
        vocabularyId={selectedVocabularyId}
        isOpen={viewModalOpen}
        onClose={handleCloseModals}
        onEdit={handleEditVocabulary}
      />

      <VocabularyEditModal
        vocabularyId={selectedVocabularyId}
        isOpen={editModalOpen}
        onClose={handleCloseModals}
        onSave={handleVocabularyUpdated}
      />
    </div>
  );
}
