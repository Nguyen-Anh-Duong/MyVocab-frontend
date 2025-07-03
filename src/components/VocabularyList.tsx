import { useState } from "react";
import type { Vocabulary } from "@/types/vocabulary";
import { Edit, Plus, Search, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useVocabulary } from "@/hooks/useVocabulary";

interface VocabularyCardProps {
  vocabulary: Vocabulary;
  onEdit: (vocab: Vocabulary) => void;
  onDelete: (id: string) => void;
}

function VocabularyCard({ vocabulary, onEdit, onDelete }: VocabularyCardProps) {
  const handlePlayAudio = () => {
    if (vocabulary.phonetic?.audio) {
      const audio = new Audio(vocabulary.phonetic.audio);
      audio.play().catch(console.error);
    }
  };

  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{vocabulary.word}</CardTitle>
          <div className="flex gap-2">
            {vocabulary.phonetic?.audio && (
              <Button variant="ghost" size="sm" onClick={handlePlayAudio} className="h-8 w-8 p-0">
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
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
        {vocabulary.phonetic?.text && <p className="text-sm text-gray-500">/{vocabulary.phonetic.text}/</p>}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {vocabulary.meanings.map((meaning, index) => (
            <div key={index} className="border-l-2 border-blue-200 pl-3">
              <div className="mb-1 flex items-center gap-2">
                {meaning.partOfSpeech && (
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">{meaning.partOfSpeech}</span>
                )}
              </div>
              <p className="text-sm font-medium">{meaning.meaning}</p>
              {meaning.context && <p className="mt-1 text-xs text-gray-600">Context: {meaning.context}</p>}
              {meaning.examples && meaning.examples.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700">Examples:</p>
                  {meaning.examples.slice(0, 2).map((example, exIndex) => (
                    <p key={exIndex} className="text-xs text-gray-600 italic">
                      • {example.sentence}
                      {example.translation && ` (${example.translation})`}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {vocabulary.categories && vocabulary.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {vocabulary.categories.map((category, index) => (
                <span key={index} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function VocabularyList() {
  const { vocabularies, isLoading, error, deleteVocabulary, searchVocabularies, fetchVocabularies, clearError } =
    useVocabulary();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await fetchVocabularies();
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      await searchVocabularies({ word: searchTerm.trim() });
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    setIsSearching(false);
    await fetchVocabularies();
  };

  const handleEdit = (vocabulary: Vocabulary) => {
    // TODO: Implement edit functionality
    console.log("Edit vocabulary:", vocabulary);
    alert(`Edit functionality for "${vocabulary.word}" will be implemented next!`);
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

  const handleAddNew = () => {
    // TODO: Navigate to add vocabulary page
    console.log("Add new vocabulary");
    alert("Add new vocabulary functionality will be implemented next!");
  };

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <Button onClick={clearError}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Vocabularies</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Word
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search vocabularies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          Search
        </Button>
        {isSearching && (
          <Button variant="outline" onClick={handleClearSearch}>
            Clear
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Loading vocabularies...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && vocabularies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {isSearching ? "No vocabularies found" : "No vocabularies yet"}
            </h3>
            <p className="mb-4 text-gray-500">
              {isSearching
                ? "Try searching with different keywords"
                : "Start building your vocabulary by adding your first word!"}
            </p>
            {!isSearching && (
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Word
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Vocabulary Grid */}
      {!isLoading && vocabularies.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vocabularies.map((vocabulary) => (
            <VocabularyCard key={vocabulary._id} vocabulary={vocabulary} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default VocabularyList;
