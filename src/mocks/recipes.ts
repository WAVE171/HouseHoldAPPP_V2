export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'beverage';
  cuisine?: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  imageUrl?: string;
  isFavorite: boolean;
  rating?: number;
  createdBy: string;
  householdId: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  notes?: string;
}

export interface MealPlan {
  id: string;
  date: string;
  meals: {
    breakfast?: string; // recipe ID
    lunch?: string;
    dinner?: string;
    snacks?: string[];
  };
  notes?: string;
  householdId: string;
}

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
    category: 'dinner',
    cuisine: 'Italian',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'medium',
    ingredients: [
      { name: 'Spaghetti', amount: '400', unit: 'g' },
      { name: 'Pancetta', amount: '200', unit: 'g' },
      { name: 'Eggs', amount: '4', unit: 'large' },
      { name: 'Parmesan cheese', amount: '100', unit: 'g', notes: 'freshly grated' },
      { name: 'Black pepper', amount: '2', unit: 'tsp' },
      { name: 'Salt', amount: '', unit: 'to taste' },
    ],
    instructions: [
      'Bring a large pot of salted water to boil and cook spaghetti according to package directions.',
      'While pasta cooks, cut pancetta into small cubes and fry until crispy.',
      'In a bowl, whisk together eggs, grated Parmesan, and black pepper.',
      'When pasta is ready, reserve 1 cup of pasta water, then drain.',
      'Add hot pasta to the pancetta pan (off heat), then quickly pour in egg mixture, tossing constantly.',
      'Add pasta water as needed to create a creamy sauce. Serve immediately.',
    ],
    nutrition: {
      calories: 650,
      protein: 28,
      carbs: 72,
      fat: 26,
    },
    tags: ['pasta', 'quick', 'comfort food'],
    isFavorite: true,
    rating: 5,
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '2',
    title: 'Avocado Toast',
    description: 'Simple and nutritious breakfast with mashed avocado on toasted bread',
    category: 'breakfast',
    prepTime: 5,
    cookTime: 3,
    servings: 2,
    difficulty: 'easy',
    ingredients: [
      { name: 'Bread', amount: '2', unit: 'slices', notes: 'sourdough recommended' },
      { name: 'Avocado', amount: '1', unit: 'large', notes: 'ripe' },
      { name: 'Lemon juice', amount: '1', unit: 'tbsp' },
      { name: 'Red pepper flakes', amount: '1/4', unit: 'tsp' },
      { name: 'Salt', amount: '', unit: 'to taste' },
      { name: 'Eggs', amount: '2', unit: '', notes: 'optional, poached' },
    ],
    instructions: [
      'Toast bread until golden brown.',
      'Cut avocado in half, remove pit, and scoop flesh into a bowl.',
      'Mash avocado with a fork, adding lemon juice and salt.',
      'Spread mashed avocado on toast.',
      'Top with red pepper flakes and optional poached egg.',
    ],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 24,
      fat: 18,
    },
    tags: ['healthy', 'quick', 'vegetarian'],
    isFavorite: true,
    rating: 4,
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '3',
    title: 'Chicken Stir Fry',
    description: 'Quick and healthy Asian-inspired dish with vegetables',
    category: 'dinner',
    cuisine: 'Asian',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    ingredients: [
      { name: 'Chicken breast', amount: '500', unit: 'g', notes: 'sliced thin' },
      { name: 'Broccoli', amount: '2', unit: 'cups', notes: 'florets' },
      { name: 'Bell peppers', amount: '2', unit: '', notes: 'mixed colors, sliced' },
      { name: 'Soy sauce', amount: '3', unit: 'tbsp' },
      { name: 'Garlic', amount: '3', unit: 'cloves', notes: 'minced' },
      { name: 'Ginger', amount: '1', unit: 'tbsp', notes: 'freshly grated' },
      { name: 'Vegetable oil', amount: '2', unit: 'tbsp' },
      { name: 'Rice', amount: '2', unit: 'cups', notes: 'cooked, for serving' },
    ],
    instructions: [
      'Heat oil in a wok or large skillet over high heat.',
      'Add chicken and stir-fry until cooked through, about 5-6 minutes. Remove and set aside.',
      'Add more oil if needed, then stir-fry vegetables until crisp-tender.',
      'Add garlic and ginger, cook for 30 seconds.',
      'Return chicken to wok, add soy sauce, and toss to combine.',
      'Serve over rice.',
    ],
    nutrition: {
      calories: 420,
      protein: 35,
      carbs: 38,
      fat: 14,
    },
    tags: ['healthy', 'quick', 'protein'],
    isFavorite: false,
    rating: 4,
    createdBy: 'John Smith',
    householdId: '1',
  },
  {
    id: '4',
    title: 'Chocolate Chip Cookies',
    description: 'Classic homemade cookies that are crispy on the outside and chewy inside',
    category: 'dessert',
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: 'easy',
    ingredients: [
      { name: 'All-purpose flour', amount: '2.25', unit: 'cups' },
      { name: 'Butter', amount: '1', unit: 'cup', notes: 'softened' },
      { name: 'Sugar', amount: '0.75', unit: 'cup' },
      { name: 'Brown sugar', amount: '0.75', unit: 'cup', notes: 'packed' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Vanilla extract', amount: '1', unit: 'tsp' },
      { name: 'Baking soda', amount: '1', unit: 'tsp' },
      { name: 'Salt', amount: '1', unit: 'tsp' },
      { name: 'Chocolate chips', amount: '2', unit: 'cups' },
    ],
    instructions: [
      'Preheat oven to 375°F (190°C).',
      'Cream together butter and sugars until fluffy.',
      'Beat in eggs and vanilla.',
      'In a separate bowl, whisk flour, baking soda, and salt.',
      'Gradually add dry ingredients to wet ingredients.',
      'Fold in chocolate chips.',
      'Drop rounded tablespoons onto baking sheets.',
      'Bake 9-12 minutes until golden brown.',
      'Cool on baking sheet for 2 minutes, then transfer to wire rack.',
    ],
    nutrition: {
      calories: 180,
      protein: 2,
      carbs: 24,
      fat: 9,
    },
    tags: ['baking', 'kid-friendly', 'dessert'],
    isFavorite: true,
    rating: 5,
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
  {
    id: '5',
    title: 'Greek Salad',
    description: 'Fresh Mediterranean salad with feta cheese and olives',
    category: 'lunch',
    cuisine: 'Mediterranean',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'easy',
    ingredients: [
      { name: 'Cucumber', amount: '1', unit: 'large', notes: 'diced' },
      { name: 'Tomatoes', amount: '4', unit: 'medium', notes: 'cut into wedges' },
      { name: 'Red onion', amount: '0.5', unit: '', notes: 'thinly sliced' },
      { name: 'Feta cheese', amount: '200', unit: 'g', notes: 'cubed' },
      { name: 'Kalamata olives', amount: '0.5', unit: 'cup' },
      { name: 'Olive oil', amount: '4', unit: 'tbsp' },
      { name: 'Red wine vinegar', amount: '2', unit: 'tbsp' },
      { name: 'Dried oregano', amount: '1', unit: 'tsp' },
    ],
    instructions: [
      'Combine cucumber, tomatoes, and onion in a large bowl.',
      'Add olives and feta cheese.',
      'Whisk together olive oil, vinegar, and oregano.',
      'Pour dressing over salad and toss gently.',
      'Season with salt and pepper to taste.',
    ],
    nutrition: {
      calories: 220,
      protein: 8,
      carbs: 12,
      fat: 16,
    },
    tags: ['healthy', 'vegetarian', 'no-cook'],
    isFavorite: false,
    rating: 4,
    createdBy: 'Sarah Smith',
    householdId: '1',
  },
];

const today = new Date();
const getDate = (daysOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const mockMealPlans: MealPlan[] = [
  {
    id: '1',
    date: getDate(0),
    meals: {
      breakfast: '2',
      lunch: '5',
      dinner: '1',
    },
    householdId: '1',
  },
  {
    id: '2',
    date: getDate(1),
    meals: {
      breakfast: '2',
      dinner: '3',
    },
    householdId: '1',
  },
  {
    id: '3',
    date: getDate(2),
    meals: {
      lunch: '5',
      dinner: '3',
      snacks: ['4'],
    },
    householdId: '1',
  },
];

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getRecipes(): Promise<Recipe[]> {
  await delay(300);
  return mockRecipes;
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  await delay(300);
  return mockRecipes.find(r => r.id === id);
}

export async function getMealPlans(): Promise<MealPlan[]> {
  await delay(300);
  return mockMealPlans;
}

export async function toggleFavorite(recipeId: string): Promise<Recipe> {
  await delay(300);
  const recipe = mockRecipes.find(r => r.id === recipeId);
  if (!recipe) throw new Error('Recipe not found');
  recipe.isFavorite = !recipe.isFavorite;
  return recipe;
}

export async function addRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
  await delay(500);
  const newRecipe: Recipe = {
    ...recipe,
    id: String(mockRecipes.length + 1),
  };
  mockRecipes.push(newRecipe);
  return newRecipe;
}

export async function updateMealPlan(
  date: string,
  meals: MealPlan['meals']
): Promise<MealPlan> {
  await delay(300);
  const existingPlan = mockMealPlans.find(p => p.date === date);
  if (existingPlan) {
    existingPlan.meals = meals;
    return existingPlan;
  }
  const newPlan: MealPlan = {
    id: String(mockMealPlans.length + 1),
    date,
    meals,
    householdId: '1',
  };
  mockMealPlans.push(newPlan);
  return newPlan;
}
