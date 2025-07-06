import { useEffect, useState } from "react";
import adminService from "@/services/adminService";
import { Calendar, Edit, User, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VocabularyDetailModalProps {
  vocabularyId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (vocabularyId: string) => void;
}

export default function VocabularyDetailModal({ vocabularyId, isOpen, onClose, onEdit }: VocabularyDetailModalProps) {
  const [vocabulary, setVocabulary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handlePlayAudio = () => {
    if (vocabulary?.phonetic?.audio) {
      const audio = new Audio(vocabulary.phonetic.audio);
      audio.play().catch(console.error);
    }
  };

  const handleEdit = () => {
    if (vocabularyId && onEdit) {
      onEdit(vocabularyId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Vocabulary Details</h2>
          <div className="flex items-center gap-2">
            {onEdit && vocabulary && (
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
              <p className="text-red-600">Failed to load vocabulary details: {error}</p>
              <Button variant="outline" onClick={fetchVocabularyDetails} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : vocabulary ? (
            <div className="space-y-6">
              {/* Word Header */}
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold text-gray-900">{vocabulary.word}</h3>
                {vocabulary.phonetic?.text && (
                  <span className="font-mono text-lg text-gray-500">{vocabulary.phonetic.text}</span>
                )}
                {vocabulary.phonetic?.audio && (
                  <Button variant="ghost" size="sm" onClick={handlePlayAudio}>
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Category */}
              {vocabulary.category && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span
                    className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: (vocabulary.category.color || "#3B82F6") + "20",
                      color: vocabulary.category.color || "#3B82F6"
                    }}
                  >
                    {vocabulary.category.name}
                  </span>
                </div>
              )}

              {/* Meanings */}
              {vocabulary.meanings && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Meanings</h4>
                  {vocabulary.meanings.map((meaning: any, meaningIndex: number) => (
                    <div key={meaningIndex} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800 capitalize">
                          {meaning.partOfSpeech}
                        </span>
                      </div>

                      {/* Definitions */}
                      {meaning.definitions && meaning.definitions.length > 0 && (
                        <div className="space-y-3">
                          {meaning.definitions.map((def: any, defIndex: number) => (
                            <div key={defIndex} className="ml-4">
                              <p className="mb-1 text-gray-700">
                                <span className="font-medium">{defIndex + 1}.</span> {def.definition}
                              </p>
                              {def.example && (
                                <p className="ml-4 text-sm text-gray-600 italic">Example: "{def.example}"</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Legacy meaning field */}
                      {meaning.meaning && <p className="ml-4 text-gray-700">{meaning.meaning}</p>}

                      {/* Examples from legacy format */}
                      {meaning.examples && meaning.examples.length > 0 && (
                        <div className="mt-3 ml-4">
                          <h6 className="mb-2 text-sm font-medium text-gray-800">Examples:</h6>
                          {meaning.examples.map((example: any, exIndex: number) => (
                            <div key={exIndex} className="mb-1 text-sm text-gray-600">
                              <p className="italic">"{example.sentence}"</p>
                              {example.translation && <p className="text-gray-500">→ {example.translation}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>Created by: {vocabulary.authorUsername || "Unknown"}</span>
                </div>
                {vocabulary.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {new Date(vocabulary.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {vocabulary.updatedAt && vocabulary.updatedAt !== vocabulary.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Updated: {new Date(vocabulary.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
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
