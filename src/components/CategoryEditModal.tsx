import { useEffect, useState } from "react";
import adminService from "@/services/adminService";
import { Palette, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CategoryEditModalProps {
  categoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (category: any) => void;
}

export default function CategoryEditModal({ categoryId, isOpen, onClose, onSave }: CategoryEditModalProps) {
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6",
    description: ""
  });

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

      // Initialize form with existing data
      setFormData({
        name: data.name || "",
        color: data.color || "#3B82F6",
        description: data.description || ""
      });
    } catch (err: any) {
      console.error("Failed to fetch category details:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) return;

    // Validation
    if (!formData.name.trim()) {
      alert("⚠️ Please enter a category name");
      return;
    }

    try {
      setIsSaving(true);

      // Prepare update data (only send changed fields)
      const updateData: any = {};
      if (formData.name !== category?.name) updateData.name = formData.name;
      if (formData.color !== category?.color) updateData.color = formData.color;
      if (formData.description !== category?.description) updateData.description = formData.description;

      const updatedCategory = await adminService.updateCategory(categoryId, updateData);

      if (onSave) {
        onSave(updatedCategory);
      }

      onClose();
    } catch (err: any) {
      console.error("Failed to update category:", err);
      alert(`❌ Failed to update category: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setCategory(null);
    setError(null);
    setFormData({
      name: "",
      color: "#3B82F6",
      description: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Category</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-600">Failed to load category: {error}</p>
              <Button variant="outline" onClick={fetchCategoryDetails} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : category ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>

              {/* Color Picker */}
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 cursor-pointer rounded-lg border-2 border-gray-200"
                    style={{ backgroundColor: formData.color }}
                    onClick={() => document.getElementById("color-input")?.click()}
                  ></div>
                  <input
                    id="color-input"
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className="sr-only"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="#3B82F6"
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm text-gray-600">How it will appear:</span>
                  </div>
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                    style={{
                      backgroundColor: formData.color + "20",
                      color: formData.color,
                      border: `1px solid ${formData.color}30`
                    }}
                  >
                    {formData.name || "Category Name"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSaving} className="flex-1">
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            </form>
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
