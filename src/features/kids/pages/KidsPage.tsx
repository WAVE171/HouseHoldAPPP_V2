import { useState, useEffect } from 'react';
import { ChildCard } from '../components/ChildCard';
import { ChildDetails } from '../components/ChildDetails';
import { AddChildDialog } from '../components/AddChildDialog';
import { EditChildDialog } from '../components/EditChildDialog';
import { useToast } from '@/shared/hooks/use-toast';
import { kidsApi } from '@/shared/api';
import type {
  Child,
  ChildSchool,
  ChildTeacher,
  Homework,
  Grade,
  ChildMedication,
  ChildVaccination,
  ChildAppointment,
  ChildActivity,
  ChildFriend,
  ChildMilestone,
  ChildChore,
  GrowthRecord,
} from '../types/kids.types';
import {
  mockSchools,
  mockTeachers,
  mockHomework,
  mockGrades,
  mockMedications,
  mockVaccinations,
  mockAppointments,
  mockActivities,
  mockFriends,
  mockMilestones,
  mockChores,
  mockGrowthRecords,
  toggleChore,
} from '@/mocks/kids';

export function KidsPage() {
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [schools, setSchools] = useState<ChildSchool[]>([]);
  const [teachers, setTeachers] = useState<ChildTeacher[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [medications, setMedications] = useState<ChildMedication[]>([]);
  const [vaccinations, setVaccinations] = useState<ChildVaccination[]>([]);
  const [appointments, setAppointments] = useState<ChildAppointment[]>([]);
  const [activities, setActivities] = useState<ChildActivity[]>([]);
  const [friends, setFriends] = useState<ChildFriend[]>([]);
  const [milestones, setMilestones] = useState<ChildMilestone[]>([]);
  const [chores, setChores] = useState<ChildChore[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load children from real API
      const childrenData = await kidsApi.getChildren();
      setChildren(childrenData);

      // Load related data from mocks (no backend endpoints yet)
      setSchools([...mockSchools]);
      setTeachers([...mockTeachers]);
      setHomework([...mockHomework]);
      setGrades([...mockGrades]);
      setMedications([...mockMedications]);
      setVaccinations([...mockVaccinations]);
      setAppointments([...mockAppointments]);
      setActivities([...mockActivities]);
      setFriends([...mockFriends]);
      setMilestones([...mockMilestones]);
      setChores([...mockChores]);
      setGrowthRecords([...mockGrowthRecords]);
    } catch (error) {
      console.error('Failed to load kids data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load kids data',
        variant: 'destructive',
      });
      // Set empty children on error
      setChildren([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddChild = async (childData: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newChild = await kidsApi.createChild({
        firstName: childData.firstName,
        lastName: childData.lastName,
        nickname: childData.nickname,
        photo: childData.photo,
        dateOfBirth: childData.dateOfBirth,
        gender: childData.gender,
        bloodType: childData.bloodType,
        allergies: childData.allergies,
        medicalConditions: childData.medicalConditions,
      });
      setChildren(prev => [...prev, newChild]);
      toast({
        title: 'Success',
        description: `${newChild.firstName} has been added`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add child',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
  };

  const handleSaveChild = async (updatedChild: Child) => {
    try {
      const saved = await kidsApi.updateChild(updatedChild.id, {
        firstName: updatedChild.firstName,
        lastName: updatedChild.lastName,
        nickname: updatedChild.nickname,
        photo: updatedChild.photo,
        dateOfBirth: updatedChild.dateOfBirth,
        gender: updatedChild.gender,
        bloodType: updatedChild.bloodType,
        allergies: updatedChild.allergies,
        medicalConditions: updatedChild.medicalConditions,
      });
      setChildren(prev => prev.map(c => c.id === saved.id ? saved : c));
      if (selectedChild?.id === saved.id) {
        setSelectedChild(saved);
      }
      toast({
        title: 'Success',
        description: `${saved.firstName}'s information has been updated`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update child',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDeleteChild = async (child: Child) => {
    if (window.confirm(`Are you sure you want to remove ${child.firstName}?`)) {
      try {
        await kidsApi.deleteChild(child.id);
        setChildren(prev => prev.filter(c => c.id !== child.id));
        if (selectedChild?.id === child.id) {
          setSelectedChild(null);
        }
        toast({
          title: 'Success',
          description: `${child.firstName} has been removed`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to delete child',
          variant: 'destructive',
        });
      }
    }
  };

  const handleToggleChore = async (choreId: string) => {
    const updatedChore = await toggleChore(choreId);
    setChores(prev => prev.map(c => c.id === choreId ? updatedChore : c));
  };

  // Helper functions to get data for specific child
  const getChildData = (childId: string) => ({
    schools: schools.filter(s => s.childId === childId),
    teachers: teachers.filter(t => t.childId === childId),
    homework: homework.filter(h => h.childId === childId),
    grades: grades.filter(g => g.childId === childId),
    medications: medications.filter(m => m.childId === childId),
    vaccinations: vaccinations.filter(v => v.childId === childId),
    appointments: appointments.filter(a => a.childId === childId),
    activities: activities.filter(a => a.childId === childId),
    friends: friends.filter(f => f.childId === childId),
    milestones: milestones.filter(m => m.childId === childId),
    chores: chores.filter(c => c.childId === childId),
    growthRecords: growthRecords.filter(g => g.childId === childId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (selectedChild) {
    const childData = getChildData(selectedChild.id);
    return (
      <ChildDetails
        child={selectedChild}
        schools={childData.schools}
        teachers={childData.teachers}
        homework={childData.homework}
        grades={childData.grades}
        medications={childData.medications}
        vaccinations={childData.vaccinations}
        appointments={childData.appointments}
        activities={childData.activities}
        friends={childData.friends}
        milestones={childData.milestones}
        chores={childData.chores}
        growthRecords={childData.growthRecords}
        onBack={() => setSelectedChild(null)}
        onToggleChore={handleToggleChore}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kids</h1>
          <p className="text-muted-foreground">
            Manage your children's education, health, activities, and more.
          </p>
        </div>
        <AddChildDialog onAddChild={handleAddChild} />
      </div>

      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/10">
          <p className="text-lg font-medium">No children added yet</p>
          <p className="text-sm text-muted-foreground mb-4">Add your first child to get started</p>
          <AddChildDialog onAddChild={handleAddChild} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {children.map((child) => {
            const childData = getChildData(child.id);
            return (
              <ChildCard
                key={child.id}
                child={child}
                homework={childData.homework}
                appointments={childData.appointments}
                chores={childData.chores}
                onSelect={setSelectedChild}
                onEdit={handleEditChild}
                onDelete={handleDeleteChild}
              />
            );
          })}
        </div>
      )}

      {/* Edit Child Dialog */}
      {editingChild && (
        <EditChildDialog
          child={editingChild}
          open={!!editingChild}
          onOpenChange={(open) => !open && setEditingChild(null)}
          onSave={handleSaveChild}
        />
      )}
    </div>
  );
}
