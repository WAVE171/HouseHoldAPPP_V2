import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Loader2, Copy, Check } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { adminApi } from '@/shared/api/admin.api';
import type { SystemHousehold } from '@/shared/api/admin.api';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'PARENT', 'MEMBER', 'STAFF']),
  householdId: z.string().optional(),
  phone: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface CreatedUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  householdId?: string;
  tempPassword?: string;
  createdAt: string;
}

interface AddUserDialogProps {
  onUserCreated: () => void;
}

export function AddUserDialog({ onUserCreated }: AddUserDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreatedUserResponse | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [households, setHouseholds] = useState<SystemHousehold[]>([]);
  const [loadingHouseholds, setLoadingHouseholds] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'MEMBER',
      householdId: '',
      phone: '',
    },
  });

  const selectedRole = watch('role');

  // Load households when dialog opens
  useEffect(() => {
    if (open) {
      loadHouseholds();
    }
  }, [open]);

  const loadHouseholds = async () => {
    setLoadingHouseholds(true);
    try {
      const response = await adminApi.getAllHouseholds(1, 100);
      setHouseholds(response.data);
    } catch (error) {
      console.error('Failed to load households:', error);
    } finally {
      setLoadingHouseholds(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      // For SUPER_ADMIN, don't require householdId
      const submitData = {
        ...data,
        password: data.password || undefined,
        householdId: data.role === 'SUPER_ADMIN' ? undefined : data.householdId || undefined,
      };

      const response = await adminApi.createUser(submitData);
      setCreatedUser(response);
      toast({
        title: 'Success',
        description: `User "${response.firstName} ${response.lastName}" has been created`,
      });
      onUserCreated();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCreatedUser(null);
    setCopiedPassword(false);
    reset();
  };

  const copyPassword = () => {
    if (createdUser?.tempPassword) {
      navigator.clipboard.writeText(createdUser.tempPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => o ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {createdUser ? 'User Created' : 'Create New User'}
          </DialogTitle>
          <DialogDescription>
            {createdUser
              ? 'The user has been created successfully.'
              : 'Create a new user account in the system.'}
          </DialogDescription>
        </DialogHeader>

        {createdUser ? (
          <div className="space-y-4">
            <Alert>
              <AlertTitle>User Details</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p><strong>Name:</strong> {createdUser.firstName} {createdUser.lastName}</p>
                <p><strong>Email:</strong> {createdUser.email}</p>
                <p><strong>Role:</strong> {createdUser.role}</p>
              </AlertDescription>
            </Alert>

            {createdUser.tempPassword && (
              <Alert variant="destructive">
                <AlertTitle>Temporary Password</AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="mb-2">
                    A temporary password was generated. Make sure to save it
                    as it will not be shown again.
                  </p>
                  <div className="flex items-center gap-2 bg-background p-2 rounded border">
                    <code className="flex-1 font-mono text-sm">
                      {createdUser.tempPassword}
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
            {/* User Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+244 XXX XXX XXX"
                {...register('phone')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setValue('role', value as UserFormData['role'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="PARENT">Parent</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            {selectedRole !== 'SUPER_ADMIN' && (
              <div className="space-y-2">
                <Label htmlFor="householdId">Household *</Label>
                <Select
                  value={watch('householdId')}
                  onValueChange={(value) => setValue('householdId', value)}
                  disabled={loadingHouseholds}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingHouseholds ? 'Loading...' : 'Select a household'} />
                  </SelectTrigger>
                  <SelectContent>
                    {households.map((household) => (
                      <SelectItem key={household.id} value={household.id}>
                        {household.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRole !== 'SUPER_ADMIN' && !watch('householdId') && (
                  <p className="text-xs text-muted-foreground">
                    Non-Super Admin users must be assigned to a household
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password (optional)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Leave blank to auto-generate"
                {...register('password')}
              />
              <p className="text-xs text-muted-foreground">
                If left blank, a temporary password will be generated
              </p>
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
                  'Create User'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
