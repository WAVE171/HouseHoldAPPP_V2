// Stub file - API integration pending

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeInstruction {
  id: string;
  stepNumber: number;
  text: string;
  timer?: number;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  difficulty?: string;
  imageUrl?: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  tags: string[];
  isFavorite?: boolean;
}

export const mockRecipes: Recipe[] = [];

export const recipeTags = [
  'breakfast',
  'lunch',
  'dinner',
  'dessert',
  'snack',
  'vegetarian',
  'quick',
  'traditional',
];

export async function getRecipes(): Promise<Recipe[]> {
  return [];
}

export async function getRecipeById(_id: string): Promise<Recipe | null> {
  return null;
}

export async function createRecipe(_data: Partial<Recipe>): Promise<Recipe> {
  throw new Error('API integration required');
}

export async function updateRecipe(_id: string, _data: Partial<Recipe>): Promise<Recipe> {
  throw new Error('API integration required');
}

export async function deleteRecipe(_id: string): Promise<void> {
  return;
}

export async function toggleFavorite(_id: string): Promise<Recipe> {
  throw new Error('API integration required');
}
