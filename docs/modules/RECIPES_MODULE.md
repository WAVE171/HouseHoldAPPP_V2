# Recipes Module Documentation

## Overview

The Recipes module manages household recipes, including recipe details, ingredients with quantities, and step-by-step instructions.

## Location

```
apps/api/src/modules/recipes/
├── dto/
│   ├── create-recipe.dto.ts
│   └── update-recipe.dto.ts
├── recipes.controller.ts
├── recipes.service.ts
└── recipes.module.ts
```

## Endpoints

### POST `/api/v1/recipes`

Create a new recipe.

**Request Body:**
```json
{
  "title": "Spaghetti Carbonara",
  "description": "Classic Italian pasta dish",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 4,
  "category": "Italian",
  "tags": ["pasta", "dinner", "quick"],
  "ingredients": [
    { "name": "Spaghetti", "quantity": 400, "unit": "g" },
    { "name": "Eggs", "quantity": 4, "unit": "whole" },
    { "name": "Pancetta", "quantity": 200, "unit": "g" },
    { "name": "Parmesan", "quantity": 100, "unit": "g" }
  ],
  "instructions": [
    { "stepNumber": 1, "instruction": "Cook spaghetti according to package directions" },
    { "stepNumber": 2, "instruction": "Fry pancetta until crispy" },
    { "stepNumber": 3, "instruction": "Mix eggs with parmesan" },
    { "stepNumber": 4, "instruction": "Combine hot pasta with egg mixture and pancetta" }
  ]
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "title": "Spaghetti Carbonara",
    "description": "Classic Italian pasta dish",
    "prepTime": 15,
    "cookTime": 20,
    "servings": 4,
    "category": "Italian",
    "tags": ["pasta", "dinner", "quick"],
    "ingredients": [
      { "id": "clx...", "name": "Spaghetti", "quantity": 400, "unit": "g" },
      { "id": "clx...", "name": "Eggs", "quantity": 4, "unit": "whole" },
      { "id": "clx...", "name": "Pancetta", "quantity": 200, "unit": "g" },
      { "id": "clx...", "name": "Parmesan", "quantity": 100, "unit": "g" }
    ],
    "instructions": [
      { "id": "clx...", "stepNumber": 1, "instruction": "Cook spaghetti according to package directions" },
      { "id": "clx...", "stepNumber": 2, "instruction": "Fry pancetta until crispy" },
      { "id": "clx...", "stepNumber": 3, "instruction": "Mix eggs with parmesan" },
      { "id": "clx...", "stepNumber": 4, "instruction": "Combine hot pasta with egg mixture and pancetta" }
    ],
    "creatorId": "clx...",
    "householdId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z",
    "updatedAt": "2026-01-26T00:00:00.000Z"
  }
}
```

### GET `/api/v1/recipes`

Get all recipes for the household.

**Query Parameters:**
- `category` - Filter by category

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "title": "Spaghetti Carbonara",
      "description": "Classic Italian pasta dish",
      "prepTime": 15,
      "cookTime": 20,
      "servings": 4,
      "category": "Italian",
      "tags": ["pasta", "dinner", "quick"],
      "ingredients": [...],
      "instructions": [...],
      "createdAt": "2026-01-26T00:00:00.000Z"
    }
  ]
}
```

### GET `/api/v1/recipes/:id`

Get a specific recipe with full details.

### PATCH `/api/v1/recipes/:id`

Update a recipe.

**Request Body:**
```json
{
  "title": "Updated Recipe Title",
  "servings": 6,
  "ingredients": [
    { "name": "Spaghetti", "quantity": 600, "unit": "g" }
  ],
  "instructions": [
    { "stepNumber": 1, "instruction": "Updated instruction" }
  ]
}
```

### DELETE `/api/v1/recipes/:id`

Delete a recipe.

## Data Models

### Recipe

```typescript
interface Recipe {
  id: string;
  title: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  creatorId: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}
```

### RecipeIngredient

```typescript
interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}
```

### RecipeInstruction

```typescript
interface RecipeInstruction {
  id: string;
  stepNumber: number;
  instruction: string;
}
```

## Service Methods

```typescript
class RecipesService {
  async createRecipe(householdId: string, userId: string, dto: CreateRecipeDto): Promise<Recipe>
  async getRecipes(householdId: string, category?: string): Promise<Recipe[]>
  async getRecipe(householdId: string, recipeId: string): Promise<Recipe>
  async updateRecipe(householdId: string, recipeId: string, dto: UpdateRecipeDto): Promise<Recipe>
  async deleteRecipe(householdId: string, recipeId: string): Promise<void>
}
```

## Frontend Integration

```typescript
// src/shared/api/recipes.api.ts
export const recipesApi = {
  createRecipe: async (data: CreateRecipeData) => {
    const response = await apiClient.post('/recipes', data);
    return response.data;
  },

  getRecipes: async (category?: string) => {
    const params = category ? `?category=${category}` : '';
    const response = await apiClient.get(`/recipes${params}`);
    return response.data;
  },

  getRecipe: async (id: string) => {
    const response = await apiClient.get(`/recipes/${id}`);
    return response.data;
  },

  updateRecipe: async (id: string, data: Partial<CreateRecipeData>) => {
    const response = await apiClient.patch(`/recipes/${id}`, data);
    return response.data;
  },

  deleteRecipe: async (id: string) => {
    await apiClient.delete(`/recipes/${id}`);
  }
};
```

## Implementation Notes

- When updating a recipe, ingredients and instructions are deleted and recreated
- Ingredients are ordered by their array index (order field)
- Instructions are ordered by stepNumber
- Category field maps to `difficulty` in the database schema

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Recipe not found |
