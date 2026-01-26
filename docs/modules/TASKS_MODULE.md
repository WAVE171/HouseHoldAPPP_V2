# Tasks Module Documentation

## Overview

The Tasks module provides comprehensive task management for households, including task creation, assignment, status tracking, subtasks, and comments.

## Location

```
apps/api/src/modules/tasks/
├── dto/
│   ├── create-task.dto.ts
│   └── update-task.dto.ts
├── tasks.controller.ts
├── tasks.service.ts
└── tasks.module.ts
```

## Endpoints

### POST `/api/v1/tasks`

Create a new task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Clean the garage",
  "description": "Organize tools and dispose of old items",
  "priority": "HIGH",
  "dueDate": "2026-02-01T10:00:00.000Z",
  "assigneeId": "clx...",
  "tags": ["cleaning", "home"]
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "title": "Clean the garage",
    "description": "Organize tools and dispose of old items",
    "priority": "HIGH",
    "status": "PENDING",
    "dueDate": "2026-02-01T10:00:00.000Z",
    "creatorId": "clx...",
    "assigneeId": "clx...",
    "householdId": "clx...",
    "tags": ["cleaning", "home"],
    "isRecurring": false,
    "createdAt": "2026-01-26T00:00:00.000Z",
    "updatedAt": "2026-01-26T00:00:00.000Z"
  }
}
```

### GET `/api/v1/tasks`

Get all tasks for the household.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` - Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `priority` - Filter by priority (LOW, MEDIUM, HIGH)
- `assigneeId` - Filter by assignee

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "title": "Clean the garage",
      "description": "...",
      "priority": "HIGH",
      "status": "PENDING",
      "dueDate": "2026-02-01T10:00:00.000Z",
      "creatorId": "clx...",
      "assigneeId": "clx...",
      "tags": ["cleaning", "home"],
      "createdAt": "2026-01-26T00:00:00.000Z"
    }
  ]
}
```

### GET `/api/v1/tasks/:id`

Get a specific task with details.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "title": "Clean the garage",
    "description": "Organize tools and dispose of old items",
    "priority": "HIGH",
    "status": "PENDING",
    "dueDate": "2026-02-01T10:00:00.000Z",
    "creatorId": "clx...",
    "creator": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "assigneeId": "clx...",
    "assignee": {
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "subtasks": [
      {
        "id": "clx...",
        "title": "Sort tools",
        "completed": false,
        "order": 1
      }
    ],
    "comments": [
      {
        "id": "clx...",
        "content": "Started working on this",
        "authorId": "clx...",
        "createdAt": "2026-01-26T12:00:00.000Z"
      }
    ],
    "tags": ["cleaning", "home"],
    "createdAt": "2026-01-26T00:00:00.000Z"
  }
}
```

### PATCH `/api/v1/tasks/:id`

Update a task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "title": "Clean the garage",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "updatedAt": "2026-01-26T14:00:00.000Z"
  }
}
```

### DELETE `/api/v1/tasks/:id`

Delete a task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": {
    "message": "Task deleted successfully"
  }
}
```

## Enums

### TaskStatus

```typescript
enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
```

### Priority

```typescript
enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}
```

## Data Models

### Task

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  creatorId: string;
  assigneeId?: string;
  householdId: string;
  tags: string[];
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

### Subtask

```typescript
interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  taskId: string;
}
```

## Service Methods

```typescript
class TasksService {
  // Create task
  async create(householdId: string, userId: string, dto: CreateTaskDto): Promise<Task>

  // Get all tasks
  async findAll(householdId: string, filters?: TaskFilters): Promise<Task[]>

  // Get task by ID
  async findOne(householdId: string, id: string): Promise<Task>

  // Update task
  async update(householdId: string, id: string, dto: UpdateTaskDto): Promise<Task>

  // Delete task
  async remove(householdId: string, id: string): Promise<void>
}
```

## Frontend Integration

```typescript
// src/shared/api/tasks.api.ts
export const tasksApi = {
  getTasks: async (filters?: TaskFilters) => {
    const response = await apiClient.get('/tasks', { params: filters });
    return response.data;
  },

  getTaskById: async (id: string) => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskData) => {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskData) => {
    const response = await apiClient.patch(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    await apiClient.delete(`/tasks/${id}`);
  }
};
```

## Frontend Page Integration

The `TasksPage.tsx` component fetches tasks from the API and maps them to local types:

```typescript
useEffect(() => {
  const fetchTasks = async () => {
    const data = await tasksApi.getTasks();
    const mappedTasks = data.map(task => ({
      id: task.id,
      title: task.title,
      status: task.status.toLowerCase(),
      priority: task.priority.toLowerCase(),
      dueDate: task.dueDate,
      // ... other mappings
    }));
    setTasks(mappedTasks);
  };
  fetchTasks();
}, []);
```

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | No access to this task |
| 404 | Not Found | Task not found |
