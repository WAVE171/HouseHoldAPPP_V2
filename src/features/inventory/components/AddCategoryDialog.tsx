import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FolderPlus, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryDialogProps {
  onAddCategory: (category: { name: string; icon: string; color: string }) => Promise<void>;
}

const iconOptions = [
  { value: 'Package', label: 'Package' },
  { value: 'ShoppingCart', label: 'Shopping Cart' },
  { value: 'Utensils', label: 'Utensils' },
  { value: 'Refrigerator', label: 'Refrigerator' },
  { value: 'Shirt', label: 'Clothing' },
  { value: 'Pill', label: 'Medicine' },
  { value: 'Sparkles', label: 'Cleaning' },
  { value: 'Wrench', label: 'Tools' },
  { value: 'Baby', label: 'Baby' },
  { value: 'Heart', label: 'Health' },
  { value: 'Car', label: 'Auto' },
  { value: 'Home', label: 'Home' },
];

const colorOptions = [
  { value: 'bg-blue-100', label: 'Blue' },
  { value: 'bg-green-100', label: 'Green' },
  { value: 'bg-yellow-100', label: 'Yellow' },
  { value: 'bg-red-100', label: 'Red' },
  { value: 'bg-purple-100', label: 'Purple' },
  { value: 'bg-pink-100', label: 'Pink' },
  { value: 'bg-orange-100', label: 'Orange' },
  { value: 'bg-teal-100', label: 'Teal' },
  { value: 'bg-gray-100', label: 'Gray' },
];

export function AddCategoryDialog({ onAddCategory }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      icon: 'Package',
      color: 'bg-blue-100',
    },
  });

  const icon = watch('icon');
  const color = watch('color');

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      await onAddCategory(data);
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FolderPlus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your inventory items.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="Enter category name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select
                value={icon}
                onValueChange={(value) => setValue('icon', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <Select
                value={color}
                onValueChange={(value) => setValue('color', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${opt.value}`} />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className={`p-4 rounded-lg ${color} flex items-center justify-center`}>
              <span className="font-medium">{watch('name') || 'Category Name'}</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Category'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
