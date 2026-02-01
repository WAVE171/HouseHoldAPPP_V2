import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2, Copy, Check } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { adminApi } from '@/shared/api/admin.api';
import type { HouseholdCreatedResponse } from '@/shared/api/admin.api';

const householdSchema = z.object({
  name: z.string().min(1, 'Household name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
  adminEmail: z.string().email('Invalid email address'),
  adminFirstName: z.string().min(1, 'First name is required'),
  adminLastName: z.string().min(1, 'Last name is required'),
  adminPassword: z.string().optional(),
});

type HouseholdFormData = z.infer<typeof householdSchema>;

interface AddHouseholdDialogProps {
  onHouseholdCreated: () => void;
}

export function AddHouseholdDialog({ onHouseholdCreated }: AddHouseholdDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdHousehold, setCreatedHousehold] = useState<HouseholdCreatedResponse | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HouseholdFormData>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      adminEmail: '',
      adminFirstName: '',
      adminLastName: '',
      adminPassword: '',
    },
  });

  const onSubmit = async (data: HouseholdFormData) => {
    setIsLoading(true);
    try {
      const response = await adminApi.createHousehold({
        ...data,
        adminPassword: data.adminPassword || undefined,
      });
      setCreatedHousehold(response);
      toast({
        title: 'Success',
        description: `Household "${response.name}" has been created`,
      });
      onHouseholdCreated();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create household',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCreatedHousehold(null);
    setCopiedPassword(false);
    reset();
  };

  const copyPassword = () => {
    if (createdHousehold?.tempPassword) {
      navigator.clipboard.writeText(createdHousehold.tempPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => o ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Household
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {createdHousehold ? 'Household Created' : 'Create New Household'}
          </DialogTitle>
          <DialogDescription>
            {createdHousehold
              ? 'The household has been created successfully.'
              : 'Create a new household with an administrator account.'}
          </DialogDescription>
        </DialogHeader>

        {createdHousehold ? (
          <div className="space-y-4">
            <Alert>
              <AlertTitle>Household Details</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p><strong>Name:</strong> {createdHousehold.name}</p>
                <p><strong>Admin:</strong> {createdHousehold.adminName}</p>
                <p><strong>Email:</strong> {createdHousehold.adminEmail}</p>
                {createdHousehold.address && (
                  <p><strong>Address:</strong> {createdHousehold.address}</p>
                )}
              </AlertDescription>
            </Alert>

            {createdHousehold.tempPassword && (
              <Alert variant="destructive">
                <AlertTitle>Temporary Password</AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="mb-2">
                    A temporary password was generated for the admin account. Make sure to save it
                    as it will not be shown again.
                  </p>
                  <div className="flex items-center gap-2 bg-background p-2 rounded border">
                    <code className="flex-1 font-mono text-sm">
                      {createdHousehold.tempPassword}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copyPassword}>
                      {copiedPassword ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Household Info */}
            <div className="space-y-2">
              <Label htmlFor="name">Household Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Smith Family"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address"
                  {...register('address')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+244 XXX XXX XXX"
                  {...register('phone')}
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">Administrator Account</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminFirstName">First Name *</Label>
                  <Input
                    id="adminFirstName"
                    placeholder="First name"
                    {...register('adminFirstName')}
                  />
                  {errors.adminFirstName && (
                    <p className="text-sm text-destructive">{errors.adminFirstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminLastName">Last Name *</Label>
                  <Input
                    id="adminLastName"
                    placeholder="Last name"
                    {...register('adminLastName')}
                  />
                  {errors.adminLastName && (
                    <p className="text-sm text-destructive">{errors.adminLastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="adminEmail">Email *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  {...register('adminEmail')}
                />
                {errors.adminEmail && (
                  <p className="text-sm text-destructive">{errors.adminEmail.message}</p>
                )}
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="adminPassword">Password (optional)</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Leave blank to auto-generate"
                  {...register('adminPassword')}
                />
                <p className="text-xs text-muted-foreground">
                  If left blank, a temporary password will be generated
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Household'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
