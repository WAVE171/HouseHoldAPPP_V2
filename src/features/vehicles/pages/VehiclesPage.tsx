import { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleDetails } from '../components/VehicleDetails';
import { AddVehicleDialog } from '../components/AddVehicleDialog';
import type { Vehicle, MaintenanceRecord, FuelRecord } from '../types/vehicles.types';
import {
  mockVehicles,
  mockMaintenanceRecords,
  mockFuelRecords,
  addVehicle,
} from '@/mocks/vehicles';
import { mockMembers } from '@/mocks/household';

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVehicles(mockVehicles);
      setMaintenanceRecords(mockMaintenanceRecords);
      setFuelRecords(mockFuelRecords);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleAddVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle = await addVehicle(vehicleData);
    setVehicles(prev => [...prev, newVehicle]);
  };

  const householdMembers = mockMembers.map(m => ({
    id: m.id,
    name: `${m.firstName} ${m.lastName}`,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (selectedVehicle) {
    const vehicleMaintenanceRecords = maintenanceRecords.filter(
      r => r.vehicleId === selectedVehicle.id
    );
    const vehicleFuelRecords = fuelRecords.filter(
      r => r.vehicleId === selectedVehicle.id
    );

    return (
      <VehicleDetails
        vehicle={selectedVehicle}
        maintenanceRecords={vehicleMaintenanceRecords}
        fuelRecords={vehicleFuelRecords}
        onBack={() => setSelectedVehicle(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage your household vehicles, maintenance, and fuel tracking.
          </p>
        </div>
        <AddVehicleDialog
          householdMembers={householdMembers}
          onAddVehicle={handleAddVehicle}
        />
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
          <Car className="h-12 w-12 mb-4" />
          <p className="text-lg">No vehicles yet</p>
          <p className="text-sm">Add your first vehicle to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={setSelectedVehicle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
