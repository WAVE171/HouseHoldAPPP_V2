# Calendar Module Documentation

## Overview

The Calendar module manages household events and scheduling, supporting all-day events, recurring events, event categories, and attendee management.

## Location

```
apps/api/src/modules/calendar/
├── dto/
│   ├── create-event.dto.ts
│   └── update-event.dto.ts
├── calendar.controller.ts
├── calendar.service.ts
└── calendar.module.ts
```

## Endpoints

### POST `/api/v1/calendar/events`

Create a new calendar event.

**Request Body:**
```json
{
  "title": "Family Dinner",
  "description": "Monthly family gathering",
  "startDate": "2026-02-14T18:00:00.000Z",
  "endDate": "2026-02-14T21:00:00.000Z",
  "allDay": false,
  "location": "Home",
  "category": "MEETING",
  "color": "#4CAF50",
  "isRecurring": true,
  "attendeeIds": ["clx...", "clx..."]
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "title": "Family Dinner",
    "description": "Monthly family gathering",
    "startDate": "2026-02-14T18:00:00.000Z",
    "endDate": "2026-02-14T21:00:00.000Z",
    "allDay": false,
    "location": "Home",
    "category": "MEETING",
    "color": "#4CAF50",
    "isRecurring": true,
    "attendeeIds": ["clx...", "clx..."],
    "creatorId": "clx...",
    "householdId": "clx...",
    "createdAt": "2026-01-26T00:00:00.000Z",
    "updatedAt": "2026-01-26T00:00:00.000Z"
  }
}
```

### GET `/api/v1/calendar/events`

Get all events for the household.

**Query Parameters:**
- `startDate` - Filter events starting from this date
- `endDate` - Filter events up to this date

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "title": "Family Dinner",
      "description": "Monthly family gathering",
      "startDate": "2026-02-14T18:00:00.000Z",
      "endDate": "2026-02-14T21:00:00.000Z",
      "allDay": false,
      "location": "Home",
      "category": "MEETING",
      "createdAt": "2026-01-26T00:00:00.000Z"
    }
  ]
}
```

### GET `/api/v1/calendar/events/:id`

Get a specific event.

### PATCH `/api/v1/calendar/events/:id`

Update an event.

**Request Body:**
```json
{
  "title": "Updated Event Title",
  "location": "New Location"
}
```

### DELETE `/api/v1/calendar/events/:id`

Delete an event.

## Enums

### EventCategory

```typescript
enum EventCategory {
  BIRTHDAY = 'BIRTHDAY',
  APPOINTMENT = 'APPOINTMENT',
  MEETING = 'MEETING',
  HOLIDAY = 'HOLIDAY',
  SCHOOL = 'SCHOOL',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER'
}
```

## Data Models

### Event

```typescript
interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  category: EventCategory;
  color?: string;
  isRecurring: boolean;
  recurrenceRule?: string;
  attendeeIds: string[];
  creatorId: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Service Methods

```typescript
class CalendarService {
  async createEvent(householdId: string, userId: string, dto: CreateEventDto): Promise<Event>
  async getEvents(householdId: string, startDate?: string, endDate?: string): Promise<Event[]>
  async getEvent(householdId: string, eventId: string): Promise<Event>
  async updateEvent(householdId: string, eventId: string, dto: UpdateEventDto): Promise<Event>
  async deleteEvent(householdId: string, eventId: string): Promise<void>
}
```

## Frontend Integration

```typescript
// src/shared/api/calendar.api.ts
export const calendarApi = {
  createEvent: async (data: CreateEventData) => {
    const response = await apiClient.post('/calendar/events', data);
    return response.data;
  },

  getEvents: async (options?: { startDate?: string; endDate?: string }) => {
    const params = new URLSearchParams();
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    const response = await apiClient.get(`/calendar/events?${params.toString()}`);
    return response.data;
  },

  getEvent: async (id: string) => {
    const response = await apiClient.get(`/calendar/events/${id}`);
    return response.data;
  },

  updateEvent: async (id: string, data: Partial<CreateEventData>) => {
    const response = await apiClient.patch(`/calendar/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    await apiClient.delete(`/calendar/events/${id}`);
  }
};
```

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Event not found |
