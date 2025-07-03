export interface Category {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  createdBy: string;
  vocabularyCount?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  color?: string;
}

export interface CategoryResponse {
  message: string;
  data: Category | Category[];
}

export interface CategoryStats {
  totalCategories: number;
  mostUsedCategory: Category | null;
  vocabulariesByCategory: {
    category: Category;
    count: number;
  }[];
}
