# Notifications Module Documentation

## Overview

The Notifications module manages user notifications across the application, including task assignments, due dates, low stock alerts, expiring items, and other important events.

## Location

```
apps/api/src/modules/notifications/
├── dto/
│   └── notification.dto.ts
├── notifications.controller.ts
├── notifications.service.ts
└── notifications.module.ts
```

## Endpoints

### GET `/api/v1/notifications`

Get notifications for the current user with filtering and pagination.

**Query Parameters:**
- `type` - Filter by notification type
- `unreadOnly` - Show only unread notifications
- `limit` - Number of records (default: 50)
- `offset` - Skip records for pagination

**Response:**
```json
{
  "data": {
    "data": [
      {
        "id": "clx...",
        "userId": "clx...",
        "type": "TASK_ASSIGNED",
        "title": "New Task Assigned",
        "message": "You have been assigned to: Clean the garage",
        "read": false,
        "actionUrl": "/tasks/clx...",
        "createdAt": "2026-01-26T10:00:00.000Z"
      }
    ],
    "meta": {
      "total": 25,
      "unreadCount": 5,
      "limit": 50,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

### GET `/api/v1/notifications/unread-count`

Get count of unread notifications.

**Response:**
```json
{
  "data": {
    "count": 5
  }
}
```

### GET `/api/v1/notifications/:id`

Get a specific notification.

### POST `/api/v1/notifications`

Create a new notification.

**Request Body:**
```json
{
  "userId": "clx...",
  "type": "TASK_ASSIGNED",
  "title": "New Task Assigned",
  "message": "You have been assigned to: Clean the garage",
  "actionUrl": "/tasks/clx..."
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "userId": "clx...",
    "type": "TASK_ASSIGNED",
    "title": "New Task Assigned",
    "message": "You have been assigned to: Clean the garage",
    "read": false,
    "actionUrl": "/tasks/clx...",
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

### PATCH `/api/v1/notifications/:id/read`

Mark a notification as read.

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "read": true
  }
}
```

### POST `/api/v1/notifications/mark-all-read`

Mark all notifications as read for the current user.

**Response:**
```json
{
  "data": {
    "count": 5
  }
}
```

### DELETE `/api/v1/notifications/:id`

Delete a specific notification.

### DELETE `/api/v1/notifications/read/all`

Delete all read notifications.

**Response:**
```json
{
  "data": {
    "count": 20
  }
}
```

## Notification Types

```typescript
type NotificationType =
  | 'TASK_ASSIGNED'     // User assigned to a task
  | 'TASK_DUE'          // Task is due soon
  | 'BILL_DUE'          // Bill payment due soon
  | 'LOW_STOCK'         // Inventory item below threshold
  | 'EXPIRING_ITEM'     // Inventory item expiring soon
  | 'UPCOMING_EVENT'    // Calendar event approaching
  | 'VACCINATION_DUE'   // Pet vaccination due
  | 'MAINTENANCE_DUE'   // Vehicle maintenance due
  | 'GENERAL';          // General notification
```

## Data Models

### Notification

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}
```

### NotificationResponse

```typescript
interface NotificationResponse {
  data: Notification[];
  meta: {
    total: number;
    unreadCount: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
```

## Service Methods

```typescript
class NotificationsService {
  // Core operations
  async createNotification(dto: CreateNotificationDto): Promise<Notification>
  async createBulkNotifications(userIds: string[], type: string, title: string, message: string, actionUrl?: string): Promise<{ count: number }>
  async getNotifications(userId: string, query: NotificationQueryDto): Promise<NotificationResponse>
  async getNotificationById(userId: string, notificationId: string): Promise<Notification>
  async markAsRead(userId: string, notificationId: string): Promise<Notification>
  async markAllAsRead(userId: string): Promise<{ count: number }>
  async deleteNotification(userId: string, notificationId: string): Promise<void>
  async deleteAllRead(userId: string): Promise<{ count: number }>
  async getUnreadCount(userId: string): Promise<{ count: number }>

  // Helper methods for common notifications
  async notifyTaskAssigned(userId: string, taskTitle: string, taskId: string): Promise<Notification>
  async notifyTaskDue(userId: string, taskTitle: string, taskId: string): Promise<Notification>
  async notifyBillDue(userId: string, billName: string, amount: number): Promise<Notification>
  async notifyLowStock(userId: string, itemName: string, quantity: number): Promise<Notification>
  async notifyExpiringItem(userId: string, itemName: string, daysUntilExpiry: number): Promise<Notification>
  async notifyUpcomingEvent(userId: string, eventTitle: string, eventId: string): Promise<Notification>
  async notifyVaccinationDue(userId: string, petName: string, vaccineName: string): Promise<Notification>
  async notifyMaintenanceDue(userId: string, vehicleName: string, maintenanceType: string): Promise<Notification>
}
```

## Frontend Integration

```typescript
// src/shared/api/notifications.api.ts
export const notificationsApi = {
  getNotifications: async (query?: NotificationQuery) => {
    const params: Record<string, string> = {};
    if (query?.type) params.type = query.type;
    if (query?.unreadOnly) params.unreadOnly = 'true';
    if (query?.limit) params.limit = query.limit.toString();
    if (query?.offset) params.offset = query.offset.toString();

    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  getNotificationById: async (id: string) => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data;
  },

  createNotification: async (data: CreateNotificationData) => {
    const response = await apiClient.post('/notifications', data);
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.post('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (id: string) => {
    await apiClient.delete(`/notifications/${id}`);
  },

  deleteAllRead: async () => {
    const response = await apiClient.delete('/notifications/read/all');
    return response.data;
  }
};
```

## Usage in Other Modules

Other modules can inject `NotificationsService` to send notifications:

```typescript
// In TasksService
@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async assignTask(taskId: string, assigneeId: string) {
    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: { assigneeId },
    });

    // Send notification to assigned user
    await this.notificationsService.notifyTaskAssigned(
      assigneeId,
      task.title,
      task.id,
    );

    return task;
  }
}
```

## Bulk Notifications

For sending notifications to multiple users:

```typescript
// Notify all household members about an event
await notificationsService.createBulkNotifications(
  ['userId1', 'userId2', 'userId3'],
  'UPCOMING_EVENT',
  'Family Dinner Tomorrow',
  'Reminder: Family dinner scheduled for tomorrow at 6 PM',
  '/calendar?event=eventId'
);
```

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Not authenticated |
| 404 | Not Found | Notification not found or not owned by user |
