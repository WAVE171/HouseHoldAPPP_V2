import {
  Clock,
  Users,
  Star,
  Heart,
  ChefHat,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { Recipe } from '../types/recipes.types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string) => void;
}

const categoryColors: Record<Recipe['category'], string> = {
  breakfast: 'bg-yellow-100 text-yellow-700',
  lunch: 'bg-green-100 text-green-700',
  dinner: 'bg-blue-100 text-blue-700',
  snack: 'bg-orange-100 text-orange-700',
  dessert: 'bg-pink-100 text-pink-700',
  beverage: 'bg-cyan-100 text-cyan-700',
};

const difficultyColors: Record<Recipe['difficulty'], string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export function RecipeCard({ recipe, onSelect, onToggleFavorite }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
      onClick={() => onSelect(recipe)}
    >
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
        <ChefHat className="h-16 w-16 text-primary/40" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
        >
          <Heart
            className={cn(
              'h-5 w-5',
              recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            )}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold line-clamp-1">{recipe.title}</h3>
          {recipe.rating && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm">{recipe.rating}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {recipe.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={cn('text-xs', categoryColors[recipe.category])}>
            {recipe.category}
          </Badge>
          <Badge className={cn('text-xs', difficultyColors[recipe.difficulty])}>
            {recipe.difficulty}
          </Badge>
          {recipe.cuisine && (
            <Badge variant="outline" className="text-xs">
              {recipe.cuisine}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
