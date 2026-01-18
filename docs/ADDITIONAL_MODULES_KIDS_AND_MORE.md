# Additional Modules - Enhanced Household Management

Comprehensive specifications for additional high-value modules to extend Household Hero v2.

---

## Table of Contents

1. [Kids/Children Module](#1-kidschildren-module) ⭐ NEW
2. [Education & School Module](#2-education--school-module)
3. [Health & Medical Module](#3-health--medical-module)
4. [Home Maintenance Module](#4-home-maintenance-module)
5. [Documents & Files Module](#5-documents--files-module)
6. [Contacts & Relationships Module](#6-contacts--relationships-module)
7. [Goals & Habits Module](#7-goals--habits-module)
8. [Shopping & Wishlists Module](#8-shopping--wishlists-module)

---

## 1. Kids/Children Module ⭐

### Purpose
Comprehensive child management covering education, health, activities, and development

### Overview
A dedicated module for managing all aspects of children's lives, integrated with other household modules (tasks, calendar, health, finance).

---

### 1.1 Child Profiles

**User Story:** As a parent, I want to manage detailed profiles for each child.

**Child Profile Fields:**

**Basic Information:**
- Full name
- Nickname
- Photo
- Date of birth / Age (auto-calculated)
- Gender
- Blood type
- Allergies
- Medical conditions

**Emergency Information:**
- Emergency contacts (parent 1, parent 2, other)
- Doctor information
- Hospital preference
- Insurance information

**School Information:**
- Current school
- Grade level
- Student ID
- School year (e.g., "2024-2025")
- Homeroom teacher
- School contact info

**Profile Tabs:**
1. Overview
2. Schedule
3. School & Education
4. Health & Medical
5. Activities & Sports
6. Friends & Social
7. Milestones & Growth
8. Documents

---

### 1.2 Daily Schedule

**User Story:** As a parent, I want to manage my child's daily routine.

**Features:**

**Weekly Schedule:**
- Day-by-day schedule builder
- Time blocks (Morning routine, School, After-school, Evening)
- Recurring activities
- Multiple children comparison view

**Schedule Templates:**
- School days
- Weekends
- Vacation days
- Custom templates

**Schedule Items:**
- Wake-up time
- Breakfast
- School hours
- After-school activities
- Homework time
- Dinner time
- Bedtime routine
- Sleep time

**Example Schedule:**
```
Monday - Sophia (Age 8)
7:00 AM  - Wake up & Breakfast
8:00 AM  - School (Elementary)
3:00 PM  - Soccer Practice
5:00 PM  - Homework Time
6:00 PM  - Dinner
7:00 PM  - Free Play
8:00 PM  - Bedtime Routine
8:30 PM  - Lights Out
```

**Dashboard Widget:**
- Today's schedule per child
- Upcoming activities
- Schedule conflicts

---

### 1.3 School & Education Management

**User Story:** As a parent, I want to track my child's education and school activities.

**Features:**

**School Information:**
- School profile (name, address, phone, website)
- School calendar (import or manual)
- School year dates
- Holiday schedule
- Early dismissal days

**Teachers & Staff:**
- Teacher profiles
  - Name
  - Subject
  - Email
  - Phone
  - Office hours
  - Photo
- Support staff (counselor, principal, nurse)
- Communication log with teachers

**Class Schedule:**
- Period-by-period schedule
- Subject names
- Room numbers
- Teacher assignments

**Example:**
```
Grade 3 - Room 204
Period 1 (8:00-9:00)   - Math (Mrs. Johnson)
Period 2 (9:00-10:00)  - Reading (Mrs. Johnson)
Recess   (10:00-10:15)
Period 3 (10:15-11:15) - Science (Mr. Davis)
Lunch    (11:15-12:00)
Period 4 (12:00-1:00)  - Art (Ms. Garcia)
Period 5 (1:00-2:00)   - P.E. (Coach Miller)
Period 6 (2:00-3:00)   - Social Studies (Mrs. Johnson)
```

**Homework Tracker:**
- Assignment list
  - Subject
  - Description
  - Due date
  - Status (Not Started, In Progress, Completed)
  - Grade received
  - Attachments
- Homework calendar view
- Overdue homework alerts
- Time spent tracking

**Grades & Report Cards:**
- Subject grades
- Progress reports
- Report cards (upload PDFs)
- Grade trends (charts)
- GPA calculation
- Parent-teacher conference notes

**School Events:**
- Field trips
- Parent-teacher conferences
- School performances
- Sports events
- Back-to-school night
- Open house
- Integration with main calendar

**Dashboard Widgets:**
- Upcoming homework
- Recent grades
- Next school event
- Teacher communications

---

### 1.4 Health & Medical Tracking

**User Story:** As a parent, I want to track my child's health and medical information.

**Features:**

**Medical Profile:**
- Primary doctor
- Pediatrician
- Specialists (allergist, dentist, orthodontist, etc.)
- Medical history
- Current medications
- Allergies
- Chronic conditions

**Medications:**
- Medication name
- Dosage
- Frequency (daily, weekly, as needed)
- Time of day
- Start date / End date
- Prescribed by
- Pharmacy
- Refill reminders
- Medication schedule

**Example:**
```
Sophia's Medications:
1. Vitamin D
   - 1000 IU daily
   - Morning with breakfast
   - Refill: Every 3 months

2. Allergy Medicine (Seasonal)
   - 10mg once daily
   - April - September
   - As needed for allergies
```

**Vaccinations:**
- Vaccine name
- Date given
- Next due date
- Clinic/doctor
- Lot number
- Upload vaccination records
- Vaccination schedule tracker

**Health Appointments:**
- Annual checkups
- Dental appointments
- Vision exams
- Specialist visits
- Appointment history
- Notes and recommendations

**Growth Tracking:**
- Height measurements
- Weight measurements
- BMI calculation
- Growth charts (percentiles)
- Developmental milestones

**Medical Documents:**
- Vaccination records
- Prescription copies
- Lab results
- Insurance cards
- Medical release forms

**Dashboard Widgets:**
- Upcoming appointments
- Medication reminders
- Vaccination due dates
- Growth chart

---

### 1.5 Activities & Extracurriculars

**User Story:** As a parent, I want to manage my child's activities and sports.

**Features:**

**Activity Registry:**
- Activity name (Soccer, Piano, Swimming, etc.)
- Type (Sports, Arts, Music, Academic, Social)
- Schedule (days/times)
- Location
- Coach/Instructor
  - Name
  - Contact info
  - Photo
- Season (Fall, Spring, Year-round)
- Cost
- Start/End dates

**Example Activities:**
```
Sophia's Activities:
1. Soccer Team - The Lightning
   - Tuesdays & Thursdays 3:30-5:00 PM
   - Saturdays 9:00 AM (games)
   - Coach: Sarah Martinez (555-0101)
   - Season: Spring 2024
   - Cost: $150/season

2. Piano Lessons
   - Mondays 4:00-4:45 PM
   - Teacher: Ms. Elena Rodriguez
   - Year-round
   - Cost: $80/month

3. Swimming Class
   - Wednesdays 5:00-6:00 PM
   - YMCA Pool
   - Instructor: Coach Mike
   - Cost: $120/session (8 weeks)
```

**Team Information:**
- Team roster
- Game/competition schedule
- Practice schedule
- Team communications
- Carpool coordination

**Achievements:**
- Certificates
- Awards
- Ribbons/Medals
- Competition results
- Skill progress
- Photo gallery

**Equipment & Gear:**
- Required equipment list
- Uniform sizes
- Equipment condition
- Replacement needed alerts

**Dashboard Widgets:**
- This week's activities
- Upcoming games/performances
- Practice schedule
- Achievement highlights

---

### 1.6 Friends & Social Life

**User Story:** As a parent, I want to keep track of my child's friends and social interactions.

**Features:**

**Friend Profiles:**
- Friend's name
- Photo
- Age/Grade
- School (same school or different)
- Parent/Guardian names
- Parent contact info
  - Phone
  - Email
  - Address
- Allergies/dietary restrictions
- Favorite activities

**Playdates & Social Events:**
- Playdate scheduler
- Location (our house, their house, park, etc.)
- Date and time
- Activities planned
- Transportation arrangements
- Playdate history
- Birthday parties
- Social gatherings

**Birthday Tracker:**
- Friend birthdays
- Gift ideas
- Party invitations
- RSVPs
- Gift given (track to avoid duplicates)

**Communication Log:**
- Messages with parents
- Shared photos
- Playdate notes
- Important information

**Carpool Coordination:**
- Regular carpool groups
- Pickup/dropoff schedules
- Driver rotation
- Contact information
- Emergency contacts

**Dashboard Widget:**
- Upcoming playdates
- Friend birthdays this month
- Recent social activities

---

### 1.7 Milestones & Development

**User Story:** As a parent, I want to track my child's growth and achievements.

**Features:**

**Developmental Milestones:**
- Age-appropriate milestone checklists
- Date achieved
- Photos/videos
- Notes

**Categories:**
- Physical (first steps, riding bike, swimming)
- Cognitive (reading level, math skills)
- Social (sharing, making friends)
- Emotional (self-regulation, empathy)
- Life skills (tying shoes, brushing teeth)

**Achievement Tracker:**
- Academic achievements
- Sports accomplishments
- Arts & creativity
- Personal growth
- Character development

**Memory Journal:**
- Funny quotes
- Special moments
- Photos and videos
- Stories and anecdotes
- Yearly highlights

**Progress Reports:**
- Skills development
- Areas of strength
- Areas for improvement
- Goals and objectives
- Parent observations

**Dashboard Widget:**
- Recent milestones
- Current development focus
- Photo memories

---

### 1.8 Behavior & Chores

**User Story:** As a parent, I want to track behavior and assign age-appropriate chores.

**Features:**

**Chore Assignment:**
- Age-appropriate chore templates
- Daily chores
- Weekly chores
- Chore completion tracking
- Reward system
- Chore charts (printable)

**Example Chores by Age:**
```
Ages 5-7:
- Make bed
- Put toys away
- Feed pets
- Set the table
- Water plants

Ages 8-10:
- All of the above, plus:
- Load/unload dishwasher
- Take out trash
- Fold laundry
- Vacuum own room
- Help with meal prep

Ages 11+:
- All of the above, plus:
- Do laundry
- Mow lawn
- Babysit siblings
- Cook simple meals
- Clean bathrooms
```

**Behavior Tracking:**
- Positive behaviors
- Areas needing work
- Behavior charts
- Reward/consequence system
- Notes and observations

**Allowance Management:**
- Chore-based allowance
- Weekly/monthly amounts
- Payment history
- Savings goals
- Spending tracker

**Integration with Tasks Module:**
- Create tasks from chores
- Assign to children
- Track completion
- Automated recurring tasks

---

### 1.9 Screen Time & Digital Management

**User Story:** As a parent, I want to manage and monitor screen time.

**Features:**

**Screen Time Rules:**
- Daily limits by age
- Weekday vs weekend rules
- App/website restrictions
- Time of day restrictions (no screens during homework)

**Screen Time Tracking:**
- Daily usage log
- App/activity breakdown
- Weekly reports
- Trend analysis

**Device Management:**
- Registered devices (tablet, phone, gaming console)
- Device rules
- Bedtime mode
- Educational apps (unlimited)
- Entertainment apps (limited)

**Content Monitoring:**
- Age-appropriate content filters
- Approved websites
- Blocked websites
- App permissions

---

### 1.10 Documents & Records

**User Story:** As a parent, I want to store important documents for each child.

**Document Categories:**

**Medical:**
- Birth certificate
- Vaccination records
- Medical history
- Insurance cards
- Medical release forms
- Prescription copies

**School:**
- Report cards
- Progress reports
- IEP/504 plans
- School registration
- Permission slips
- School photos

**Legal:**
- Passport
- Social security card
- Custody agreements
- Travel consent forms

**Other:**
- Artwork photos
- Awards/certificates
- Photos and videos
- Important letters

**Features:**
- Upload and organize files
- Tag and search
- Expiration date reminders
- Share with authorized people
- Download/print

---

### 1.11 Multi-Child Management

**User Story:** As a parent with multiple children, I want to manage all children efficiently.

**Features:**

**Family View:**
- All children overview
- Side-by-side comparison
- Combined calendars
- Shared schedules

**Sibling Comparison:**
- Schedule conflicts
- Activity overlap
- Carpool coordination
- Fair distribution of activities

**Shared Activities:**
- Activities both children do
- Family events
- Joint playdates

**Individual Views:**
- Child-specific dashboard
- Quick switch between children
- Child profiles

---

### 1.12 Integration with Other Modules

**Calendar Integration:**
- School events
- Activities & sports
- Playdates
- Medical appointments
- Homework due dates

**Tasks Integration:**
- Chores assigned to children
- Homework tasks
- School projects
- Activity preparation

**Finance Integration:**
- Activity costs
- School expenses
- Allowance tracking
- Birthday party budgets

**Health/Medical Integration:**
- Medication schedules
- Doctor appointments
- Vaccination tracking

**Contacts Integration:**
- Teachers
- Coaches
- Friends' parents
- Emergency contacts

---

### 1.13 Dashboard Widgets

**Main Children Dashboard:**

1. **Children Quick View**
   - Photos and ages
   - Quick stats per child

2. **Today's Schedule**
   - All children's activities today
   - Time conflicts highlighted

3. **This Week**
   - Homework due
   - Tests/quizzes
   - Activities/games
   - Playdates

4. **Health Reminders**
   - Medications due
   - Upcoming appointments
   - Vaccination alerts

5. **Upcoming Events**
   - School events
   - Birthday parties
   - Field trips

6. **Recent Achievements**
   - Grades
   - Awards
   - Milestones

---

### 1.14 Mobile Features

**Mobile-Specific:**
- Quick check-in/check-out for activities
- Photo upload (milestones, achievements)
- Medication reminders (push notifications)
- Homework due notifications
- Emergency contact quick-dial
- School calendar sync
- Activity location maps

---

### Database Schema for Kids Module

```prisma
model Child {
  id              String    @id @default(cuid())
  firstName       String
  lastName        String
  nickname        String?
  photo           String?
  dateOfBirth     DateTime
  gender          String?
  bloodType       String?
  allergies       String[]
  medicalConditions String[]

  // Relations
  householdId     String
  household       Household @relation(fields: [householdId], references: [id])

  // Child-specific data
  schools         ChildSchool[]
  teachers        ChildTeacher[]
  classes         ChildClass[]
  homework        Homework[]
  grades          Grade[]
  medications     ChildMedication[]
  vaccinations    ChildVaccination[]
  appointments    ChildAppointment[]
  activities      ChildActivity[]
  friends         ChildFriend[]
  milestones      ChildMilestone[]
  chores          ChildChore[]
  documents       ChildDocument[]
  growthRecords   GrowthRecord[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([householdId])
  @@map("children")
}

model ChildSchool {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  schoolName      String
  gradeLevel      String
  studentId       String?
  schoolYear      String    // "2024-2025"
  startDate       DateTime?
  endDate         DateTime?

  address         String?
  phone           String?
  website         String?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("child_schools")
}

model ChildTeacher {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  firstName       String
  lastName        String
  subject         String?   // "Homeroom", "Math", "Music", etc.
  email           String?
  phone           String?
  officeHours     String?
  photo           String?

  schoolYear      String    // "2024-2025"
  isCurrent       Boolean   @default(true)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("child_teachers")
}

model Homework {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  subject         String
  title           String
  description     String?
  dueDate         DateTime
  status          String    // NOT_STARTED, IN_PROGRESS, COMPLETED
  gradeReceived   String?
  timeSpent       Int?      // minutes
  attachments     String[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  completedAt     DateTime?

  @@index([childId, dueDate])
  @@map("homework")
}

model Grade {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  subject         String
  assignmentName  String
  grade           String    // "A", "95", etc.
  points          Float?
  maxPoints       Float?
  percentage      Float?
  date            DateTime
  term            String    // "Q1", "Semester 1", etc.

  createdAt       DateTime  @default(now())

  @@index([childId, date])
  @@map("grades")
}

model ChildMedication {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  name            String
  dosage          String
  frequency       String    // "Daily", "Twice daily", etc.
  timeOfDay       String[]  // ["Morning", "Evening"]
  startDate       DateTime
  endDate         DateTime?
  prescribedBy    String?
  pharmacy        String?
  refillReminder  Boolean   @default(true)
  notes           String?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("child_medications")
}

model ChildActivity {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  name            String
  type            String    // SPORTS, MUSIC, ARTS, ACADEMIC, etc.
  schedule        String    // "Tuesdays & Thursdays 3:30-5:00 PM"
  location        String?
  instructorName  String?
  instructorPhone String?
  instructorEmail String?
  season          String?   // "Spring 2024", "Year-round"
  cost            Float?
  startDate       DateTime?
  endDate         DateTime?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("child_activities")
}

model ChildFriend {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  firstName       String
  lastName        String
  photo           String?
  age             Int?
  grade           String?
  school          String?
  birthday        DateTime?

  // Parent info
  parentName      String?
  parentPhone     String?
  parentEmail     String?
  address         String?

  // Important info
  allergies       String[]
  dietaryRestrictions String[]

  notes           String?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("child_friends")
}

model ChildMilestone {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  category        String    // PHYSICAL, COGNITIVE, SOCIAL, EMOTIONAL, LIFE_SKILL
  title           String
  description     String?
  dateAchieved    DateTime
  photos          String[]
  notes           String?

  createdAt       DateTime  @default(now())

  @@index([childId, dateAchieved])
  @@map("child_milestones")
}

model ChildChore {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  name            String
  description     String?
  frequency       String    // DAILY, WEEKLY, MONTHLY
  daysOfWeek      Int[]     // For weekly chores
  completed       Boolean   @default(false)
  allowanceAmount Float?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("child_chores")
}

model GrowthRecord {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  date            DateTime
  height          Float?    // cm or inches
  weight          Float?    // kg or lbs
  bmi             Float?
  headCircumference Float?
  notes           String?

  createdAt       DateTime  @default(now())

  @@index([childId, date])
  @@map("growth_records")
}

model ChildDocument {
  id              String    @id @default(cuid())
  childId         String
  child           Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  name            String
  type            String    // MEDICAL, SCHOOL, LEGAL, OTHER
  category        String?   // Birth Certificate, Report Card, etc.
  url             String
  expiryDate      DateTime?
  uploadedAt      DateTime  @default(now())

  @@map("child_documents")
}

// Additional models for vaccinations, appointments, etc.
```

---

## Summary

The **Kids/Children Module** provides comprehensive child management covering:
- ✅ **Education** - Schools, teachers, homework, grades
- ✅ **Health** - Medications, vaccinations, growth tracking
- ✅ **Activities** - Sports, music, arts, extracurriculars
- ✅ **Social** - Friends, playdates, birthday parties
- ✅ **Development** - Milestones, achievements, progress
- ✅ **Daily Life** - Schedules, chores, screen time
- ✅ **Documents** - Records, certificates, important files

**Integration:**
- Calendar (events, activities, appointments)
- Tasks (chores, homework)
- Finance (activity costs, allowances)
- Health (medications, appointments)
- Contacts (teachers, coaches, friends' parents)

**Dashboard:**
- Child-specific views
- Multi-child comparison
- Today's schedule
- Upcoming events
- Health reminders
- Recent achievements

This module transforms the app into a complete family management system! 🏠👨‍👩‍👧‍👦

---

## Additional Complementary Modules

I'll continue with specifications for other valuable modules in the next sections...
