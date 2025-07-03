import { useEffect, useState } from "react";
import { type CreateVocabularyRequest, PartOfSpeech, type Vocabulary } from "@/types/vocabulary";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategory } from "@/hooks/useCategory";

interface VocabularyFormProps {
  onSubmit: (data: CreateVocabularyRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Vocabulary; // For editing
  mode?: "add" | "edit";
  hideTitle?: boolean; // For when used in dialog
}

const partOfSpeechOptions: PartOfSpeech[] = [
  PartOfSpeech.Noun,
  PartOfSpeech.Verb,
  PartOfSpeech.Adjective,
  PartOfSpeech.Adverb,
  PartOfSpeech.Pronoun,
  PartOfSpeech.Preposition,
  PartOfSpeech.Conjunction,
  PartOfSpeech.Interjection,
  PartOfSpeech.Determiner,
  PartOfSpeech.Phrase
];

export default function VocabularyForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  mode = "add",
  hideTitle = false
}: VocabularyFormProps) {
  const { categories, fetchCategories } = useCategory();

  const [formData, setFormData] = useState<CreateVocabularyRequest>({
    word: "",
    phonetic: {
      text: "",
      audio: ""
    },
    meanings: [
      {
        partOfSpeech: PartOfSpeech.Noun,
        meaning: "",
        context: "",
        examples: [{ sentence: "", translation: "" }],
        commonPhrases: []
      }
    ],
    categories: []
  });

  const [newCategory, setNewCategory] = useState("");

  // Load available categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Initialize form with data when editing
  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        word: initialData.word,
        phonetic: initialData.phonetic || { text: "", audio: "" },
        meanings:
          initialData.meanings.length > 0
            ? initialData.meanings.map((meaning) => ({
                ...meaning,
                // Ensure partOfSpeech always has a valid value - NEVER undefined or empty
                partOfSpeech: meaning.partOfSpeech || PartOfSpeech.Noun,
                context: meaning.context || "",
                examples:
                  meaning.examples && meaning.examples.length > 0
                    ? meaning.examples
                    : [{ sentence: "", translation: "" }],
                commonPhrases: meaning.commonPhrases || []
              }))
            : [
                {
                  partOfSpeech: PartOfSpeech.Noun,
                  meaning: "",
                  context: "",
                  examples: [{ sentence: "", translation: "" }],
                  commonPhrases: []
                }
              ],
        categories: initialData.categories || []
      });
    }
  }, [initialData, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up empty examples and commonPhrases, validate
    const cleanedData = {
      ...formData,
      meanings: formData.meanings.map((meaning) => ({
        ...meaning,
        examples: meaning.examples?.filter((ex) => ex.sentence.trim()) || [],
        commonPhrases: meaning.commonPhrases?.filter((phrase) => phrase.phrase.trim()) || []
      }))
    };

    // Enhanced validation
    if (!cleanedData.word.trim()) {
      alert("⚠️ Please enter a word to continue");
      return;
    }

    if (!cleanedData.meanings[0].meaning.trim()) {
      alert("⚠️ Please enter at least one definition for the word");
      return;
    }

    // Check if any meaning has valid content including partOfSpeech
    const hasValidMeaning = cleanedData.meanings.every((meaning) => meaning.meaning.trim() && meaning.partOfSpeech);

    if (!hasValidMeaning) {
      alert("⚠️ Each meaning must have a definition and part of speech selected");
      return;
    }

    try {
      await onSubmit(cleanedData);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("❌ Failed to save vocabulary. Please check your data and try again.");
    }
  };

  const updateMeaning = (index: number, field: string, value: any) => {
    const newMeanings = [...formData.meanings];
    newMeanings[index] = { ...newMeanings[index], [field]: value };
    setFormData({ ...formData, meanings: newMeanings });
  };

  const addMeaning = () => {
    setFormData({
      ...formData,
      meanings: [
        ...formData.meanings,
        {
          partOfSpeech: PartOfSpeech.Noun,
          meaning: "",
          context: "",
          examples: [{ sentence: "", translation: "" }],
          commonPhrases: []
        }
      ]
    });
  };

  const removeMeaning = (index: number) => {
    if (formData.meanings.length > 1) {
      const newMeanings = formData.meanings.filter((_, i) => i !== index);
      setFormData({ ...formData, meanings: newMeanings });
    }
  };

  const updateExample = (meaningIndex: number, exampleIndex: number, field: string, value: string) => {
    const newMeanings = [...formData.meanings];
    if (!newMeanings[meaningIndex].examples) {
      newMeanings[meaningIndex].examples = [];
    }
    newMeanings[meaningIndex].examples![exampleIndex] = {
      ...newMeanings[meaningIndex].examples![exampleIndex],
      [field]: value
    };
    setFormData({ ...formData, meanings: newMeanings });
  };

  const addExample = (meaningIndex: number) => {
    const newMeanings = [...formData.meanings];
    if (!newMeanings[meaningIndex].examples) {
      newMeanings[meaningIndex].examples = [];
    }
    newMeanings[meaningIndex].examples!.push({ sentence: "", translation: "" });
    setFormData({ ...formData, meanings: newMeanings });
  };

  const removeExample = (meaningIndex: number, exampleIndex: number) => {
    const newMeanings = [...formData.meanings];
    if (newMeanings[meaningIndex].examples && newMeanings[meaningIndex].examples!.length > 1) {
      newMeanings[meaningIndex].examples = newMeanings[meaningIndex].examples!.filter((_, i) => i !== exampleIndex);
      setFormData({ ...formData, meanings: newMeanings });
    }
  };

  const updateCommonPhrase = (meaningIndex: number, phraseIndex: number, field: string, value: string) => {
    const newMeanings = [...formData.meanings];
    if (!newMeanings[meaningIndex].commonPhrases) {
      newMeanings[meaningIndex].commonPhrases = [];
    }
    newMeanings[meaningIndex].commonPhrases![phraseIndex] = {
      ...newMeanings[meaningIndex].commonPhrases![phraseIndex],
      [field]: value
    };
    setFormData({ ...formData, meanings: newMeanings });
  };

  const addCommonPhrase = (meaningIndex: number) => {
    const newMeanings = [...formData.meanings];
    if (!newMeanings[meaningIndex].commonPhrases) {
      newMeanings[meaningIndex].commonPhrases = [];
    }
    newMeanings[meaningIndex].commonPhrases!.push({ phrase: "", meaning: "" });
    setFormData({ ...formData, meanings: newMeanings });
  };

  const removeCommonPhrase = (meaningIndex: number, phraseIndex: number) => {
    const newMeanings = [...formData.meanings];
    if (newMeanings[meaningIndex].commonPhrases && newMeanings[meaningIndex].commonPhrases!.length > 1) {
      newMeanings[meaningIndex].commonPhrases = newMeanings[meaningIndex].commonPhrases!.filter(
        (_, i) => i !== phraseIndex
      );
      setFormData({ ...formData, meanings: newMeanings });
    }
  };

  // Auto-cleanup empty entries when user stops interacting
  const cleanupEmptyExamples = (meaningIndex: number) => {
    const newMeanings = [...formData.meanings];
    if (newMeanings[meaningIndex].examples) {
      // Keep at least one example entry, remove others if empty
      const nonEmptyExamples = newMeanings[meaningIndex].examples!.filter((ex) => ex.sentence.trim());
      if (nonEmptyExamples.length === 0) {
        // Keep one empty example if all are empty
        newMeanings[meaningIndex].examples = [{ sentence: "", translation: "" }];
      } else {
        newMeanings[meaningIndex].examples = nonEmptyExamples;
      }
      setFormData({ ...formData, meanings: newMeanings });
    }
  };

  const cleanupEmptyCommonPhrases = (meaningIndex: number) => {
    const newMeanings = [...formData.meanings];
    if (newMeanings[meaningIndex].commonPhrases) {
      // Remove all empty common phrases (don't need to keep any if empty)
      const nonEmptyPhrases = newMeanings[meaningIndex].commonPhrases!.filter((phrase) => phrase.phrase.trim());
      newMeanings[meaningIndex].commonPhrases = nonEmptyPhrases;
      setFormData({ ...formData, meanings: newMeanings });
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !(formData.categories || []).includes(newCategory.trim())) {
      setFormData({
        ...formData,
        categories: [...(formData.categories || []), newCategory.trim()]
      });
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: (formData.categories || []).filter((c) => c !== category)
    });
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      {!hideTitle && (
        <CardHeader>
          <CardTitle className="text-2xl">{mode === "edit" ? "Edit Vocabulary" : "Add New Vocabulary"}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={hideTitle ? "pt-6" : ""}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Word and Phonetic */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="word">Word *</Label>
              <Input
                id="word"
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                placeholder="Enter the word"
                required
              />
            </div>
            <div>
              <Label htmlFor="phonetic">Phonetic</Label>
              <Input
                id="phonetic"
                value={formData.phonetic?.text || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phonetic: { ...formData.phonetic, text: e.target.value }
                  })
                }
                placeholder="/fəˈnetɪk/"
              />
            </div>
          </div>

          {/* Audio URL */}
          <div>
            <Label htmlFor="audio">Audio URL (optional)</Label>
            <Input
              id="audio"
              value={formData.phonetic?.audio || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phonetic: { ...formData.phonetic, audio: e.target.value }
                })
              }
              placeholder="https://example.com/audio.mp3"
            />
          </div>

          {/* Meanings */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <Label className="text-lg font-semibold">Meanings *</Label>
              <Button type="button" onClick={addMeaning} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Meaning
              </Button>
            </div>

            {formData.meanings.map((meaning, meaningIndex) => (
              <div key={meaningIndex} className="mb-4 space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Meaning {meaningIndex + 1}</span>
                  {formData.meanings.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeMeaning(meaningIndex)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label>Part of Speech *</Label>
                    <Select
                      key={`${meaningIndex}-${meaning.partOfSpeech || "none"}`}
                      value={meaning.partOfSpeech}
                      onValueChange={(value) => updateMeaning(meaningIndex, "partOfSpeech", value as PartOfSpeech)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select part of speech" />
                      </SelectTrigger>
                      <SelectContent>
                        {partOfSpeechOptions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Context (optional)</Label>
                    <Input
                      value={meaning.context || ""}
                      onChange={(e) => updateMeaning(meaningIndex, "context", e.target.value)}
                      placeholder="Context or situation"
                    />
                  </div>
                </div>

                <div>
                  <Label>Definition *</Label>
                  <Textarea
                    value={meaning.meaning}
                    onChange={(e) => updateMeaning(meaningIndex, "meaning", e.target.value)}
                    placeholder="Enter the meaning/definition"
                    required
                  />
                </div>

                {/* Examples */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>
                      Examples <span className="text-xs text-gray-500">(empty entries will be auto-removed)</span>
                    </Label>
                    <Button type="button" onClick={() => addExample(meaningIndex)} variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Example
                    </Button>
                  </div>

                  {meaning.examples?.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                      <div>
                        <Input
                          value={example.sentence}
                          onChange={(e) => updateExample(meaningIndex, exampleIndex, "sentence", e.target.value)}
                          onBlur={() => cleanupEmptyExamples(meaningIndex)}
                          placeholder="Example sentence"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={example.translation || ""}
                          onChange={(e) => updateExample(meaningIndex, exampleIndex, "translation", e.target.value)}
                          onBlur={() => cleanupEmptyExamples(meaningIndex)}
                          placeholder="Translation (optional)"
                        />
                        {meaning.examples && meaning.examples.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeExample(meaningIndex, exampleIndex)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Common Phrases */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>
                      Common Phrases <span className="text-xs text-gray-500">(empty entries will be auto-removed)</span>
                    </Label>
                    <Button type="button" onClick={() => addCommonPhrase(meaningIndex)} variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Phrase
                    </Button>
                  </div>

                  {meaning.commonPhrases &&
                    meaning.commonPhrases.length > 0 &&
                    meaning.commonPhrases.map((phrase, phraseIndex) => (
                      <div key={phraseIndex} className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <Input
                            value={phrase.phrase}
                            onChange={(e) => updateCommonPhrase(meaningIndex, phraseIndex, "phrase", e.target.value)}
                            onBlur={() => cleanupEmptyCommonPhrases(meaningIndex)}
                            placeholder="Common phrase"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={phrase.meaning || ""}
                            onChange={(e) => updateCommonPhrase(meaningIndex, phraseIndex, "meaning", e.target.value)}
                            onBlur={() => cleanupEmptyCommonPhrases(meaningIndex)}
                            placeholder="Phrase meaning (optional)"
                          />
                          {meaning.commonPhrases && meaning.commonPhrases.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeCommonPhrase(meaningIndex, phraseIndex)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div>
            <Label className="text-lg font-semibold">Categories</Label>
            <div className="mb-2 flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add or search categories"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {categories
                  .filter(
                    (cat) =>
                      cat.name.toLowerCase().includes(newCategory.toLowerCase()) &&
                      !formData.categories?.includes(cat.name)
                  )
                  .map((cat) => (
                    <option key={cat._id} value={cat.name} />
                  ))}
              </datalist>
              <Button type="button" onClick={addCategory} variant="outline">
                Add
              </Button>
            </div>

            {/* Available category suggestions */}
            {newCategory.length > 0 && (
              <div className="mb-3">
                <p className="mb-2 text-sm text-gray-600">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter(
                      (cat) =>
                        cat.name.toLowerCase().includes(newCategory.toLowerCase()) &&
                        !formData.categories?.includes(cat.name)
                    )
                    .slice(0, 5)
                    .map((cat) => (
                      <Button
                        key={cat._id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!formData.categories?.includes(cat.name)) {
                            setFormData({
                              ...formData,
                              categories: [...(formData.categories || []), cat.name]
                            });
                            setNewCategory("");
                          }
                        }}
                        className="text-xs"
                      >
                        + {cat.name}
                        {cat.vocabularyCount !== undefined && (
                          <span className="ml-1 text-gray-500">({cat.vocabularyCount})</span>
                        )}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* Selected categories */}
            <div className="flex flex-wrap gap-2">
              {(formData.categories || []).map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                >
                  #{category}
                  <Button
                    type="button"
                    onClick={() => removeCategory(category)}
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </span>
              ))}
            </div>

            {/* Your categories section */}
            {categories.length > 0 && (
              <div className="mt-3">
                <p className="mb-2 text-sm text-gray-600">Your categories:</p>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter((cat) => !formData.categories?.includes(cat.name))
                    .sort((a, b) => (b.vocabularyCount || 0) - (a.vocabularyCount || 0))
                    .slice(0, 8)
                    .map((cat) => (
                      <Button
                        key={cat._id}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            categories: [...(formData.categories || []), cat.name]
                          });
                        }}
                        className="text-xs text-gray-600 hover:text-blue-600"
                      >
                        {cat.name}
                        {cat.vocabularyCount !== undefined && <span className="ml-1">({cat.vocabularyCount})</span>}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? mode === "edit"
                  ? "Updating..."
                  : "Adding..."
                : mode === "edit"
                  ? "Update Vocabulary"
                  : "Add Vocabulary"}
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
