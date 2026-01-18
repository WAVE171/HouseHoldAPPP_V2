import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
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
import type { Pet } from '../types/pets.types';

const petSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.enum(['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'reptile', 'other']),
  breed: z.string().optional(),
  gender: z.enum(['male', 'female', 'unknown']),
  dateOfBirth: z.string().optional(),
  color: z.string().optional(),
  weight: z.number().min(0).optional(),
  weightUnit: z.enum(['lbs', 'kg']).optional(),
  microchipNumber: z.string().optional(),
  notes: z.string().optional(),
});

type PetFormData = z.infer<typeof petSchema>;

interface AddPetDialogProps {
  onAddPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function AddPetDialog({ onAddPet }: AddPetDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      species: 'dog',
      breed: '',
      gender: 'unknown',
      dateOfBirth: '',
      color: '',
      weight: undefined,
      weightUnit: 'lbs',
      microchipNumber: '',
      notes: '',
    },
  });

  const species = watch('species');
  const gender = watch('gender');
  const weightUnit = watch('weightUnit');

  const onSubmit = async (data: PetFormData) => {
    setIsLoading(true);
    try {
      await onAddPet({
        ...data,
        householdId: '1',
        weight: data.weight || undefined,
        weightUnit: data.weight ? data.weightUnit : undefined,
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add pet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Pet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Pet</DialogTitle>
          <DialogDescription>
            Add a new pet to your household.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Pet Name</Label>
            <Input id="name" placeholder="Enter pet name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Species</Label>
              <Select value={species} onValueChange={(v) => setValue('species', v as Pet['species'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="bird">Bird</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="rabbit">Rabbit</SelectItem>
                  <SelectItem value="hamster">Hamster</SelectItem>
                  <SelectItem value="reptile">Reptile</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={(v) => setValue('gender', v as Pet['gender'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input id="breed" placeholder="e.g., Golden Retriever" {...register('breed')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" placeholder="e.g., Golden" {...register('color')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
            </div>

            <div className="space-y-2">
              <Label>Weight</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0"
                  className="flex-1"
                  {...register('weight', { valueAsNumber: true })}
                />
                <Select value={weightUnit} onValueChange={(v) => setValue('weightUnit', v as 'lbs' | 'kg')}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchipNumber">Microchip Number</Label>
            <Input id="microchipNumber" placeholder="Enter microchip number" {...register('microchipNumber')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about your pet..."
              className="resize-none"
              {...register('notes')}
            />
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
                'Add Pet'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
