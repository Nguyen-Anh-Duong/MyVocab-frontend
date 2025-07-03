export enum PartOfSpeech {
  Noun = "noun",
  Verb = "verb",
  Adjective = "adjective",
  Adverb = "adverb",
  Pronoun = "pronoun",
  Preposition = "preposition",
  Conjunction = "conjunction",
  Interjection = "interjection",
  Determiner = "determiner",
  Exclamation = "exclamation",
  Phrase = "phrase"
}

export interface Example {
  sentence: string;
  translation?: string;
}

export interface CommonPhrase {
  phrase: string;
  meaning?: string;
}

export interface Meaning {
  meaning: string;
  context?: string;
  examples?: Example[];
  commonPhrases?: CommonPhrase[];
  partOfSpeech?: PartOfSpeech;
  note?: string;
}

export interface Phonetic {
  text?: string;
  audio?: string;
}

export interface Vocabulary {
  _id: string;
  word: string;
  phonetic?: Phonetic;
  meanings: Meaning[];
  categories?: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVocabularyRequest {
  word: string;
  phonetic?: Phonetic;
  meanings: Meaning[];
  categories?: string[];
}

export interface UpdateVocabularyRequest {
  word?: string;
  phonetic?: Phonetic;
  meanings?: Meaning[];
  categories?: string[];
}

export interface SearchVocabularyRequest {
  word: string;
}

export interface VocabularyResponse {
  message: string;
  data: Vocabulary | Vocabulary[];
}
