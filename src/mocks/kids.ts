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
} from '@/features/kids/types/kids.types';

export const mockChildren: Child[] = [
  {
    id: '1',
    householdId: '1',
    firstName: 'Sophia',
    lastName: 'Smith',
    nickname: 'Sophie',
    dateOfBirth: '2016-05-15',
    gender: 'female',
    bloodType: 'A+',
    allergies: ['Peanuts'],
    medicalConditions: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    householdId: '1',
    firstName: 'Ethan',
    lastName: 'Smith',
    nickname: 'E',
    dateOfBirth: '2018-09-22',
    gender: 'male',
    bloodType: 'O+',
    allergies: [],
    medicalConditions: ['Asthma'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockSchools: ChildSchool[] = [
  {
    id: '1',
    childId: '1',
    schoolName: 'Springfield Elementary',
    gradeLevel: '3rd Grade',
    studentId: 'SE2024-1234',
    schoolYear: '2024-2025',
    address: '123 School Street, Springfield, IL 62701',
    phone: '(555) 123-4567',
    website: 'https://springfield-elementary.edu',
  },
  {
    id: '2',
    childId: '2',
    schoolName: 'Springfield Elementary',
    gradeLevel: '1st Grade',
    studentId: 'SE2024-5678',
    schoolYear: '2024-2025',
    address: '123 School Street, Springfield, IL 62701',
    phone: '(555) 123-4567',
    website: 'https://springfield-elementary.edu',
  },
];

export const mockTeachers: ChildTeacher[] = [
  {
    id: '1',
    childId: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    subject: 'Homeroom',
    email: 'sjohnson@springfield-elementary.edu',
    phone: '(555) 123-4567 ext. 204',
    officeHours: 'Mon-Fri 3:00-3:30 PM',
    schoolYear: '2024-2025',
    isCurrent: true,
  },
  {
    id: '2',
    childId: '1',
    firstName: 'Michael',
    lastName: 'Davis',
    subject: 'Science',
    email: 'mdavis@springfield-elementary.edu',
    schoolYear: '2024-2025',
    isCurrent: true,
  },
  {
    id: '3',
    childId: '2',
    firstName: 'Emily',
    lastName: 'Brown',
    subject: 'Homeroom',
    email: 'ebrown@springfield-elementary.edu',
    phone: '(555) 123-4567 ext. 105',
    schoolYear: '2024-2025',
    isCurrent: true,
  },
];

export const mockHomework: Homework[] = [
  {
    id: '1',
    childId: '1',
    subject: 'Math',
    title: 'Chapter 5 Practice Problems',
    description: 'Complete problems 1-20 on pages 45-46',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'IN_PROGRESS',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    childId: '1',
    subject: 'Reading',
    title: 'Book Report',
    description: 'Write a 1-page summary of Charlotte\'s Web',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    childId: '1',
    subject: 'Science',
    title: 'Plant Growth Observation',
    description: 'Record daily observations of plant growth',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'COMPLETED',
    gradeReceived: 'A',
    createdAt: new Date().toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockGrades: Grade[] = [
  { id: '1', childId: '1', subject: 'Math', assignmentName: 'Chapter 4 Test', grade: 'A', percentage: 95, date: '2024-01-15', term: 'Q2' },
  { id: '2', childId: '1', subject: 'Reading', assignmentName: 'Comprehension Quiz', grade: 'A-', percentage: 92, date: '2024-01-18', term: 'Q2' },
  { id: '3', childId: '1', subject: 'Science', assignmentName: 'Lab Report', grade: 'B+', percentage: 88, date: '2024-01-20', term: 'Q2' },
  { id: '4', childId: '2', subject: 'Math', assignmentName: 'Number Recognition', grade: 'A', percentage: 100, date: '2024-01-16', term: 'Q2' },
  { id: '5', childId: '2', subject: 'Reading', assignmentName: 'Phonics Test', grade: 'A', percentage: 98, date: '2024-01-19', term: 'Q2' },
];

export const mockMedications: ChildMedication[] = [
  {
    id: '1',
    childId: '1',
    name: 'Vitamin D',
    dosage: '1000 IU',
    frequency: 'Daily',
    timeOfDay: ['Morning'],
    startDate: '2024-01-01',
    prescribedBy: 'Dr. Williams',
    refillReminder: true,
    notes: 'Give with breakfast',
  },
  {
    id: '2',
    childId: '2',
    name: 'Albuterol Inhaler',
    dosage: '2 puffs',
    frequency: 'As needed',
    timeOfDay: ['As needed'],
    startDate: '2023-06-01',
    prescribedBy: 'Dr. Chen',
    refillReminder: true,
    notes: 'Use before physical activity if needed',
  },
];

export const mockVaccinations: ChildVaccination[] = [
  { id: '1', childId: '1', name: 'Flu Shot', dateGiven: '2024-10-15', nextDueDate: '2025-10-15', clinic: 'Springfield Pediatrics' },
  { id: '2', childId: '1', name: 'Tdap', dateGiven: '2023-05-20', nextDueDate: '2033-05-20', clinic: 'Springfield Pediatrics' },
  { id: '3', childId: '2', name: 'Flu Shot', dateGiven: '2024-10-15', nextDueDate: '2025-10-15', clinic: 'Springfield Pediatrics' },
  { id: '4', childId: '2', name: 'DTaP', dateGiven: '2023-09-22', nextDueDate: '2028-09-22', clinic: 'Springfield Pediatrics' },
];

export const mockAppointments: ChildAppointment[] = [
  {
    id: '1',
    childId: '1',
    type: 'checkup',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '09:00',
    doctor: 'Dr. Williams',
    clinic: 'Springfield Pediatrics',
    reason: 'Annual checkup',
    status: 'scheduled',
  },
  {
    id: '2',
    childId: '1',
    type: 'dental',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:00',
    doctor: 'Dr. Martinez',
    clinic: 'Smile Dental',
    reason: '6-month cleaning',
    status: 'scheduled',
  },
  {
    id: '3',
    childId: '2',
    type: 'specialist',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:30',
    doctor: 'Dr. Chen',
    clinic: 'Pediatric Pulmonology',
    reason: 'Asthma follow-up',
    status: 'scheduled',
  },
];

export const mockActivities: ChildActivity[] = [
  {
    id: '1',
    childId: '1',
    name: 'Soccer',
    type: 'SPORTS',
    schedule: 'Tuesdays & Thursdays 3:30-5:00 PM',
    location: 'Springfield Soccer Fields',
    instructorName: 'Coach Martinez',
    instructorPhone: '(555) 555-0101',
    season: 'Spring 2025',
    cost: 150,
    startDate: '2025-03-01',
    endDate: '2025-05-31',
  },
  {
    id: '2',
    childId: '1',
    name: 'Piano Lessons',
    type: 'MUSIC',
    schedule: 'Mondays 4:00-4:45 PM',
    location: 'Music Academy',
    instructorName: 'Ms. Rodriguez',
    instructorEmail: 'elena@musicacademy.com',
    cost: 80,
  },
  {
    id: '3',
    childId: '2',
    name: 'Swimming',
    type: 'SPORTS',
    schedule: 'Wednesdays 5:00-6:00 PM',
    location: 'YMCA Pool',
    instructorName: 'Coach Mike',
    cost: 120,
    season: 'Year-round',
  },
];

export const mockFriends: ChildFriend[] = [
  {
    id: '1',
    childId: '1',
    firstName: 'Emma',
    lastName: 'Wilson',
    age: 8,
    grade: '3rd',
    school: 'Springfield Elementary',
    parentName: 'Jennifer Wilson',
    parentPhone: '(555) 555-0201',
    parentEmail: 'jwilson@email.com',
    allergies: [],
    notes: 'Best friend, in same class',
  },
  {
    id: '2',
    childId: '1',
    firstName: 'Olivia',
    lastName: 'Garcia',
    age: 8,
    grade: '3rd',
    school: 'Springfield Elementary',
    parentName: 'Maria Garcia',
    parentPhone: '(555) 555-0202',
    allergies: ['Dairy'],
    notes: 'Soccer teammate',
  },
];

export const mockMilestones: ChildMilestone[] = [
  {
    id: '1',
    childId: '1',
    category: 'COGNITIVE',
    title: 'Read first chapter book',
    dateAchieved: '2024-09-15',
    notes: 'Finished Charlotte\'s Web independently!',
  },
  {
    id: '2',
    childId: '1',
    category: 'PHYSICAL',
    title: 'Learned to ride bike without training wheels',
    dateAchieved: '2024-06-20',
  },
  {
    id: '3',
    childId: '2',
    category: 'LIFE_SKILL',
    title: 'Tied shoes independently',
    dateAchieved: '2024-08-10',
  },
];

export const mockChores: ChildChore[] = [
  { id: '1', childId: '1', name: 'Make bed', frequency: 'DAILY', daysOfWeek: [1, 2, 3, 4, 5, 6, 0], completed: false, allowanceAmount: 1 },
  { id: '2', childId: '1', name: 'Set the table', frequency: 'DAILY', daysOfWeek: [1, 2, 3, 4, 5, 6, 0], completed: false, allowanceAmount: 0.5 },
  { id: '3', childId: '1', name: 'Feed the pets', frequency: 'DAILY', daysOfWeek: [1, 2, 3, 4, 5, 6, 0], completed: true, allowanceAmount: 1 },
  { id: '4', childId: '1', name: 'Clean room', frequency: 'WEEKLY', daysOfWeek: [6], completed: false, allowanceAmount: 5 },
  { id: '5', childId: '2', name: 'Put toys away', frequency: 'DAILY', daysOfWeek: [1, 2, 3, 4, 5, 6, 0], completed: false, allowanceAmount: 0.5 },
  { id: '6', childId: '2', name: 'Help water plants', frequency: 'WEEKLY', daysOfWeek: [3], completed: false, allowanceAmount: 2 },
];

export const mockGrowthRecords: GrowthRecord[] = [
  { id: '1', childId: '1', date: '2024-01-15', height: 48, weight: 55, heightUnit: 'in', weightUnit: 'lbs' },
  { id: '2', childId: '1', date: '2024-07-15', height: 49.5, weight: 58, heightUnit: 'in', weightUnit: 'lbs' },
  { id: '3', childId: '1', date: '2025-01-15', height: 51, weight: 62, heightUnit: 'in', weightUnit: 'lbs' },
  { id: '4', childId: '2', date: '2024-01-20', height: 40, weight: 38, heightUnit: 'in', weightUnit: 'lbs' },
  { id: '5', childId: '2', date: '2024-07-20', height: 42, weight: 42, heightUnit: 'in', weightUnit: 'lbs' },
  { id: '6', childId: '2', date: '2025-01-20', height: 44, weight: 45, heightUnit: 'in', weightUnit: 'lbs' },
];

// Mock API functions
export async function addChild(child: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>): Promise<Child> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newChild: Child = {
    ...child,
    id: String(mockChildren.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockChildren.push(newChild);
  return newChild;
}

export async function updateChild(id: string, updates: Partial<Child>): Promise<Child> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockChildren.findIndex(c => c.id === id);
  if (index !== -1) {
    mockChildren[index] = { ...mockChildren[index], ...updates, updatedAt: new Date().toISOString() };
    return mockChildren[index];
  }
  throw new Error('Child not found');
}

export async function deleteChild(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockChildren.findIndex(c => c.id === id);
  if (index !== -1) {
    mockChildren.splice(index, 1);
  }
}

export async function addHomework(homework: Omit<Homework, 'id' | 'createdAt'>): Promise<Homework> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newHomework: Homework = {
    ...homework,
    id: String(mockHomework.length + 1),
    createdAt: new Date().toISOString(),
  };
  mockHomework.push(newHomework);
  return newHomework;
}

export async function updateHomework(id: string, updates: Partial<Homework>): Promise<Homework> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockHomework.findIndex(h => h.id === id);
  if (index !== -1) {
    mockHomework[index] = { ...mockHomework[index], ...updates };
    return mockHomework[index];
  }
  throw new Error('Homework not found');
}

export async function toggleChore(id: string): Promise<ChildChore> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const index = mockChores.findIndex(c => c.id === id);
  if (index !== -1) {
    mockChores[index] = { ...mockChores[index], completed: !mockChores[index].completed };
    return mockChores[index];
  }
  throw new Error('Chore not found');
}
