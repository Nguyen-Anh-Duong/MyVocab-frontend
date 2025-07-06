import { useEffect, useState } from "react";
import adminService from "@/services/adminService";
import { X } from "lucide-react";
import VocabularyForm from "@/components/VocabularyForm";
import { Button } from "@/components/ui/button";

interface VocabularyEditModalProps {
  vocabularyId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (vocabulary: any) => void;
}

export default function VocabularyEditModal({ vocabularyId, isOpen, onClose, onSave }: VocabularyEditModalProps) {
  const [vocabulary, setVocabulary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && vocabularyId) {
      fetchVocabularyDetails();
    }
  }, [isOpen, vocabularyId]);

  const fetchVocabularyDetails = async () => {
    if (!vocabularyId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getVocabularyById(vocabularyId);
      setVocabulary(data);
    } catch (err: any) {
      console.error("Failed to fetch vocabulary details:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (updatedVocabulary: any) => {
    if (!vocabularyId) return;

    try {
      setIsSaving(true);
      const savedVocabulary = await adminService.updateVocabulary(vocabularyId, updatedVocabulary);

      if (onSave) {
        onSave(savedVocabulary);
      }

      onClose();
    } catch (err: any) {
      console.error("Failed to update vocabulary:", err);
      // Let VocabularyForm handle the error display
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setVocabulary(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Vocabulary</h2>
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
              <p className="text-red-600">Failed to load vocabulary: {error}</p>
              <Button variant="outline" onClick={fetchVocabularyDetails} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : vocabulary ? (
            <VocabularyForm
              initialData={vocabulary}
              onSubmit={handleSave}
              onCancel={handleClose}
              isLoading={isSaving}
              mode="edit"
            />
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No vocabulary data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
