export interface Child {
  id: string;
  householdId: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  photo?: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other';
  bloodType?: string;
  allergies: string[];
  medicalConditions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChildSchool {
  id: string;
  childId: string;
  schoolName: string;
  gradeLevel: string;
  studentId?: string;
  schoolYear: string;
  address?: string;
  phone?: string;
  website?: string;
  startDate?: string;
  endDate?: string;
}

export interface ChildTeacher {
  id: string;
  childId: string;
  firstName: string;
  lastName: string;
  subject?: string;
  email?: string;
  phone?: string;
  officeHours?: string;
  schoolYear: string;
  isCurrent: boolean;
}

export interface Homework {
  id: string;
  childId: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  gradeReceived?: string;
  timeSpent?: number;
  createdAt: string;
  completedAt?: string;
}

export interface Grade {
  id: string;
  childId: string;
  subject: string;
  assignmentName: string;
  grade: string;
  points?: number;
  maxPoints?: number;
  percentage?: number;
  date: string;
  term: string;
}

export interface ChildMedication {
  id: string;
  childId: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  pharmacy?: string;
  refillReminder: boolean;
  notes?: string;
}

export interface ChildVaccination {
  id: string;
  childId: string;
  name: string;
  dateGiven: string;
  nextDueDate?: string;
  clinic?: string;
  notes?: string;
}

export interface ChildAppointment {
  id: string;
  childId: string;
  type: 'checkup' | 'dental' | 'vision' | 'specialist' | 'other';
  date: string;
  time: string;
  doctor?: string;
  clinic?: string;
  reason?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ChildActivity {
  id: string;
  childId: string;
  name: string;
  type: 'SPORTS' | 'MUSIC' | 'ARTS' | 'ACADEMIC' | 'SOCIAL' | 'OTHER';
  schedule: string;
  location?: string;
  instructorName?: string;
  instructorPhone?: string;
  instructorEmail?: string;
  season?: string;
  cost?: number;
  startDate?: string;
  endDate?: string;
}

export interface ChildFriend {
  id: string;
  childId: string;
  firstName: string;
  lastName: string;
  age?: number;
  grade?: string;
  school?: string;
  birthday?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
  allergies: string[];
  notes?: string;
}

export interface ChildMilestone {
  id: string;
  childId: string;
  category: 'PHYSICAL' | 'COGNITIVE' | 'SOCIAL' | 'EMOTIONAL' | 'LIFE_SKILL';
  title: string;
  description?: string;
  dateAchieved: string;
  notes?: string;
}

export interface ChildChore {
  id: string;
  childId: string;
  name: string;
  description?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  daysOfWeek: number[];
  completed: boolean;
  allowanceAmount?: number;
}

export interface GrowthRecord {
  id: string;
  childId: string;
  date: string;
  height?: number;
  weight?: number;
  heightUnit: 'cm' | 'in';
  weightUnit: 'kg' | 'lbs';
  notes?: string;
}
