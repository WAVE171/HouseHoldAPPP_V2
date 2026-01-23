// Stub file - API integration pending

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  location?: string;
  category: string;
  color?: string;
  attendeeIds?: string[];
}

export const mockEvents: CalendarEvent[] = [];

export async function getEvents(): Promise<CalendarEvent[]> {
  return [];
}

export async function createEvent(_data: Partial<CalendarEvent>): Promise<CalendarEvent> {
  throw new Error('API integration required');
}

export async function updateEvent(_id: string, _data: Partial<CalendarEvent>): Promise<CalendarEvent> {
  throw new Error('API integration required');
}

export async function deleteEvent(_id: string): Promise<void> {
  return;
}
