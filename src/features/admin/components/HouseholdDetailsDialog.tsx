import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Users, Home, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useToast } from '@/shared/hooks/use-toast';
import { adminApi } from '@/shared/api/admin.api';
import type { SystemHousehold, HouseholdMember, HouseholdInfo } from '@/shared/api/admin.api';
import { format } from 'date-fns';

const updateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type UpdateFormData = z.infer<typeof updateSchema>;

interface HouseholdDetailsDialogProps {
  household: SystemHousehold;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-red-100 text-red-800',
  PARENT: 'bg-blue-100 text-blue-800',
  MEMBER: 'bg-green-100 text-green-800',
  STAFF: 'bg-yellow-100 text-yellow-800',
};

export function HouseholdDetailsDialog({
  household,
  open,
  onOpenChange,
  onUpdate,
}: HouseholdDetailsDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [details, setDetails] = useState<HouseholdInfo | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: household.name,
      address: household.address || '',
      phone: household.phone || '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: household.name,
        address: household.address || '',
        phone: household.phone || '',
      });
      fetchDetails();
    }
  }, [open, household]);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const [householdDetails, householdMembers] = await Promise.all([
        adminApi.getHouseholdById(household.id),
        adminApi.getHouseholdMembers(household.id),
      ]);
      setDetails(householdDetails);
      setMembers(householdMembers);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UpdateFormData) => {
    setIsSaving(true);
    try {
      await adminApi.updateHousehold(household.id, {
        name: data.name,
        address: data.address || undefined,
        phone: data.phone || undefined,
      });
      toast({
        title: 'Success',
        description: 'Household updated successfully',
      });
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update household',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {household.name}
          </DialogTitle>
          <DialogDescription>
            View and manage household details
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="details" className="mt-4">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Household Name *</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Address
                    </Label>
                    <Input id="address" {...register('address')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone
                    </Label>
                    <Input id="phone" {...register('phone')} />
                  </div>
                </div>

                {details && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Creator: {details.creatorEmail}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created: {format(new Date(details.createdAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="members" className="mt-4">
              {members.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Users className="h-12 w-12 mb-4" />
                  <p>No members found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.firstName?.[0] || member.email[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {member.firstName && member.lastName
                                ? `${member.firstName} ${member.lastName}`
                                : 'Unknown'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge className={roleColors[member.role] || ''}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              {details && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Tasks" value={details.stats.tasks} />
                  <StatCard label="Events" value={details.stats.events} />
                  <StatCard label="Inventory Items" value={details.stats.inventoryItems} />
                  <StatCard label="Transactions" value={details.stats.transactions} />
                  <StatCard label="Vehicles" value={details.stats.vehicles} />
                  <StatCard label="Pets" value={details.stats.pets} />
                  <StatCard label="Employees" value={details.stats.employees} />
                  <StatCard label="Recipes" value={details.stats.recipes} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 border rounded-lg">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
