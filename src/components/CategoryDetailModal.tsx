import { useEffect, useState } from "react";
import adminService from "@/services/adminService";
import { Calendar, Edit, Hash, Palette, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryDetailModalProps {
  categoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (categoryId: string) => void;
}

export default function CategoryDetailModal({ categoryId, isOpen, onClose, onEdit }: CategoryDetailModalProps) {
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && categoryId) {
      fetchCategoryDetails();
    }
  }, [isOpen, categoryId]);

  const fetchCategoryDetails = async () => {
    if (!categoryId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getCategoryById(categoryId);
      setCategory(data);
    } catch (err: any) {
      console.error("Failed to fetch category details:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (categoryId && onEdit) {
      onEdit(categoryId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Category Details</h2>
          <div className="flex items-center gap-2">
            {onEdit && category && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-600">Failed to load category details: {error}</p>
              <Button variant="outline" onClick={fetchCategoryDetails} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : category ? (
            <div className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: category.color || "#3B82F6" }}
                  ></div>
                  <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                </div>
              </div>

              {/* Color Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Color:</span>
                  <span
                    className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium"
                    style={{
                      backgroundColor: category.color || "#3B82F6",
                      color: "#fff",
                      borderColor: category.color || "#3B82F6"
                    }}
                  >
                    {category.color || "#3B82F6"}
                  </span>
                </div>

                {/* Category ID */}
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">ID:</span>
                  <span className="font-mono text-sm text-gray-800">{category._id}</span>
                </div>

                {/* Description */}
                {category.description && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900">Description</h4>
                    <p className="rounded-lg bg-gray-50 p-3 text-gray-700">{category.description}</p>
                  </div>
                )}

                {/* Visual Preview */}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-900">Preview</h4>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-sm text-gray-600">How it appears in vocabulary:</span>
                    </div>
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                      style={{
                        backgroundColor: (category.color || "#3B82F6") + "20",
                        color: category.color || "#3B82F6",
                        border: `1px solid ${category.color || "#3B82F6"}30`
                      }}
                    >
                      {category.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>Created by: {category.createdBy || "Unknown"}</span>
                </div>
                {category.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {category.updatedAt && category.updatedAt !== category.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Updated: {new Date(category.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No category data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
