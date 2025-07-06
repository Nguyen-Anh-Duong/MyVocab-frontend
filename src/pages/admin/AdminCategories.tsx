import { useEffect, useState } from "react";
import adminService from "@/services/adminService";
import { AlertCircle, Edit, Eye, FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [vocabularies, setVocabularies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch categories and vocabularies in parallel
      const [categoriesData, vocabulariesData] = await Promise.all([
        adminService.getAllCategories(),
        adminService.getAllVocabularies()
      ]);

      console.log("Categories data:", categoriesData);
      console.log("Vocabularies data:", vocabulariesData);

      setCategories(categoriesData);
      setVocabularies(vocabulariesData);
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError(err.message);
      setCategories([]);
      setVocabularies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(categoryId);
      await adminService.deleteCategory(categoryId);

      // Update local state
      setCategories(categories.filter((cat) => (cat.id || cat._id) !== categoryId));

      alert("Category deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      alert(`Failed to delete category: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getCategoryStats = () => {
    const totalCategories = categories.length;
    const recentCategories = categories.filter(
      (cat) => cat.createdAt && new Date(cat.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    // Calculate usage for each category
    const categoryUsage = categories.map((category) => {
      const categoryId = category.id || category._id;
      const usage = vocabularies.filter(
        (vocab) =>
          vocab.category?.id === categoryId ||
          vocab.category?._id === categoryId ||
          vocab.categories?.includes(categoryId) ||
          vocab.categories?.includes(category.name)
      ).length;

      return {
        ...category,
        usage
      };
    });

    const totalUsage = categoryUsage.reduce((sum, cat) => sum + cat.usage, 0);
    const mostUsedCategory = categoryUsage.reduce(
      (prev, current) => (prev.usage > current.usage ? prev : current),
      categoryUsage[0]
    );

    return { totalCategories, recentCategories, categoryUsage, totalUsage, mostUsedCategory };
  };

  const stats = getCategoryStats();

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
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Manage vocabulary categories and their usage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            Refresh
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recent (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.recentCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Most Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-purple-600">{stats.mostUsedCategory?.name || "N/A"}</div>
            <div className="text-xs text-gray-500">{stats.mostUsedCategory?.usage || 0} vocabularies</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Category Usage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.categoryUsage.map((category) => (
              <div key={category.id || category._id} className="flex items-center gap-4">
                <div
                  className="h-6 w-6 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: category.color || "#3B82F6" }}
                ></div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.usage} vocabularies</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${stats.totalUsage > 0 ? (category.usage / stats.totalUsage) * 100 : 0}%`,
                        backgroundColor: category.color || "#3B82F6"
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                {error ? "Failed to load categories" : "No categories found"}
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id || category._id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-8 w-8 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: category.color || "#3B82F6" }}
                    ></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description || "No description"}</p>
                      <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {stats.categoryUsage.find((c) => (c.id || c._id) === (category.id || category._id))?.usage ||
                            0}{" "}
                          vocabularies
                        </span>
                        {category.createdAt && (
                          <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Edit Category">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id || category._id)}
                      disabled={actionLoading === (category.id || category._id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete Category"
                    >
                      {actionLoading === (category.id || category._id) ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
