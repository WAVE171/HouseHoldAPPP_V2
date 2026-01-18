import { Dog, Cat, Bird, Fish, Rabbit, MoreHorizontal, Calendar, Syringe, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { Pet, Vaccination, VetAppointment } from '../types/pets.types';

interface PetCardProps {
  pet: Pet;
  vaccinations: Vaccination[];
  appointments: VetAppointment[];
  onSelect: (pet: Pet) => void;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
}

const speciesIcons = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
  hamster: Rabbit,
  reptile: Fish,
  other: Dog,
};

export function PetCard({ pet, vaccinations, appointments, onSelect, onEdit, onDelete }: PetCardProps) {
  const SpeciesIcon = speciesIcons[pet.species] || Dog;

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'Unknown age';
    const birth = new Date(dateOfBirth);
    const now = new Date();
    const years = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor(((now.getTime() - birth.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));

    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''} old`;
    }
    return `${years} year${years !== 1 ? 's' : ''} old`;
  };

  const upcomingVaccinations = vaccinations.filter(v => {
    if (!v.nextDueDate) return false;
    const dueDate = new Date(v.nextDueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 30 && daysUntilDue > 0;
  });

  const upcomingAppointments = appointments.filter(a => {
    return a.status === 'scheduled' && new Date(a.date) >= new Date();
  });

  const hasAlerts = upcomingVaccinations.length > 0 || upcomingAppointments.length > 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect(pet)}>
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            {pet.photo ? (
              <Avatar className="h-24 w-24">
                <AvatarImage src={pet.photo} alt={pet.name} />
                <AvatarFallback>
                  <SpeciesIcon className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <SpeciesIcon className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
          {hasAlerts && (
            <div className="absolute top-2 left-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(pet); }}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(pet); }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pet.breed || pet.species.charAt(0).toUpperCase() + pet.species.slice(1)} • {calculateAge(pet.dateOfBirth)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
            </Badge>
            {pet.weight && (
              <Badge variant="outline" className="text-xs">
                {pet.weight} {pet.weightUnit}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            {upcomingVaccinations.length > 0 && (
              <div className="flex items-center gap-1 text-orange-500">
                <Syringe className="h-3 w-3" />
                <span>{upcomingVaccinations.length} due soon</span>
              </div>
            )}
            {upcomingAppointments.length > 0 && (
              <div className="flex items-center gap-1 text-blue-500">
                <Calendar className="h-3 w-3" />
                <span>{upcomingAppointments.length} upcoming</span>
              </div>
            )}
            {!hasAlerts && (
              <span className="text-green-500">All up to date</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
