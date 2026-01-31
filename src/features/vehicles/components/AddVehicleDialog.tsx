import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2 } from 'lucide-react';
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
import type { Vehicle, VehicleType } from '../types/vehicles.types';

const vehicleTypes: { value: VehicleType; label: string }[] = [
  { value: 'CAR', label: 'Car' },
  { value: 'TRUCK', label: 'Truck' },
  { value: 'SUV', label: 'SUV' },
  { value: 'VAN', label: 'Van' },
  { value: 'MOTORCYCLE', label: 'Motorcycle' },
  { value: 'OTHER', label: 'Other' },
];

const vehicleSchema = z.object({
  type: z.enum(['CAR', 'TRUCK', 'SUV', 'VAN', 'MOTORCYCLE', 'OTHER'] as const),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().optional(),
  licensePlate: z.string().optional(),
  vin: z.string().optional(),
  mileage: z.number().min(0).optional(),
  fuelType: z.enum(['gasoline', 'diesel', 'electric', 'hybrid']).optional(),
  insuranceProvider: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  registrationExpiry: z.string().optional(),
  primaryDriver: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface AddVehicleDialogProps {
  householdMembers: { id: string; name: string }[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
}

export function AddVehicleDialog({ householdMembers, onAddVehicle }: AddVehicleDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: 'CAR',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      licensePlate: '',
      vin: '',
      mileage: 0,
      fuelType: 'gasoline',
      insuranceProvider: '',
      insuranceExpiry: '',
      registrationExpiry: '',
      primaryDriver: '',
    },
  });

  const vehicleType = watch('type');
  const fuelType = watch('fuelType');
  const primaryDriver = watch('primaryDriver');

  const onSubmit = async (data: VehicleFormData) => {
    setIsLoading(true);
    try {
      await onAddVehicle({
        ...data,
        vin: data.vin || undefined,
        insuranceProvider: data.insuranceProvider || undefined,
        insuranceExpiry: data.insuranceExpiry || undefined,
        registrationExpiry: data.registrationExpiry || undefined,
        primaryDriver: data.primaryDriver || undefined,
        householdId: '1',
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Vehicle</DialogTitle>
          <DialogDescription>
            Add a new vehicle to your household fleet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <Select
              value={vehicleType}
              onValueChange={(value) => setValue('type', value as VehicleType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((vt) => (
                  <SelectItem key={vt.value} value={vt.value}>
                    {vt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                {...register('year', { valueAsNumber: true })}
              />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                placeholder="e.g., Honda"
                {...register('make')}
              />
              {errors.make && (
                <p className="text-sm text-destructive">{errors.make.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="e.g., Accord"
                {...register('model')}
              />
              {errors.model && (
                <p className="text-sm text-destructive">{errors.model.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="e.g., Silver"
                {...register('color')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                placeholder="e.g., ABC-1234"
                {...register('licensePlate')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fuel Type</Label>
              <Select
                value={fuelType}
                onValueChange={(value) => setValue('fuelType', value as VehicleFormData['fuelType'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                id="mileage"
                type="number"
                min="0"
                {...register('mileage', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN (optional)</Label>
            <Input
              id="vin"
              placeholder="Vehicle Identification Number"
              {...register('vin')}
            />
          </div>

          <div className="space-y-2">
            <Label>Primary Driver</Label>
            <Select
              value={primaryDriver || 'none'}
              onValueChange={(value) => setValue('primaryDriver', value === 'none' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not assigned</SelectItem>
                {householdMembers.map(member => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Input
                id="insuranceProvider"
                placeholder="e.g., State Farm"
                {...register('insuranceProvider')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
              <Input
                id="insuranceExpiry"
                type="date"
                {...register('insuranceExpiry')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationExpiry">Registration Expiry</Label>
            <Input
              id="registrationExpiry"
              type="date"
              {...register('registrationExpiry')}
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
                'Add Vehicle'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
