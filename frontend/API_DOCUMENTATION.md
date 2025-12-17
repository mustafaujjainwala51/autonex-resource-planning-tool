# API Documentation

## Overview

This document describes the API integration for the Autonex Resource Planning frontend.

## Base Configuration

**File:** `src/api/config.js`

```javascript
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
```

Set environment variable:
```bash
VITE_API_BASE_URL=http://your-backend-url:8000/api
```

## API Services

### Projects API (`src/api/projects.js`)

#### Create Project
```javascript
const projectData = {
  name: "Trajectory Annotation PoC",
  client: "Tesla",
  type: "PoC",
  total_tasks: 5000,
  sla_deadline: "2025-03-10",
  required_expertise: ["robotics", "trajectory"],
  estimated_time_per_task: 1.5,
  weekly_target: 700,
  start_date: "2025-02-01",
  end_date: "2025-03-10"
};

const newProject = await projectsAPI.create(projectData);
```

#### Get All Projects
```javascript
const projects = await projectsAPI.getAll();
```

#### Get Project by ID
```javascript
const project = await projectsAPI.getById(projectId);
```

#### Update Project
```javascript
const updated = await projectsAPI.update(projectId, projectData);
```

#### Delete Project
```javascript
await projectsAPI.delete(projectId);
```

### Employees API (`src/api/employees.js`)

#### Get All Employees
```javascript
const employees = await employeesAPI.getAll();
```

#### Get Employee by ID
```javascript
const employee = await employeesAPI.getById(employeeId);
```

#### Filter by Skills
```javascript
const filtered = await employeesAPI.filterBySkills(employees, ['robotics', 'trajectory']);
```

### Allocations API (`src/api/allocations.js`)

#### Create Allocation
```javascript
const allocationData = {
  employee_id: 1,
  project_id: 5,
  weekly_hours_allocated: 20,
  weekly_tasks_allocated: 100,
  effective_week: "2025-02-01"
};

const allocation = await allocationsAPI.create(allocationData);
```

#### Get Allocations by Project
```javascript
const allocations = await allocationsAPI.getByProject(projectId);
```

#### Get Allocations by Employee
```javascript
const allocations = await allocationsAPI.getByEmployee(employeeId);
```

#### Batch Create
```javascript
const allocations = [
  { employee_id: 1, project_id: 5, weekly_hours_allocated: 20, ... },
  { employee_id: 2, project_id: 5, weekly_hours_allocated: 15, ... }
];

await allocationsAPI.createBatch(allocations);
```

### Leaves API (`src/api/leaves.js`)

#### Get All Leaves
```javascript
const leaves = await leavesAPI.getAll();
```

#### Get Leaves by Employee
```javascript
const leaves = await leavesAPI.getByEmployee(employeeId);
```

## Expected Backend Responses

### Project Response
```json
{
  "project_id": 1,
  "name": "Trajectory Annotation PoC",
  "client": "Tesla",
  "type": "PoC",
  "total_tasks": 5000,
  "sla_deadline": "2025-03-10",
  "required_expertise": ["robotics", "trajectory"],
  "estimated_time_per_task": 1.5,
  "weekly_target": 700,
  "start_date": "2025-02-01",
  "end_date": "2025-03-10",
  "project_status": "active",
  "created_at": "2025-01-15T10:00:00Z"
}
```

### Employee Response
```json
{
  "employee_id": 1,
  "name": "John Doe",
  "role": "Annotator",
  "work_type": "full_time",
  "hours_per_day": 8,
  "skills": ["robotics", "trajectory"],
  "skill_ratings": {
    "robotics": 4,
    "trajectory": 5
  },
  "global_productivity": 1.2,
  "weekly_availability": 40,
  "active_status": true
}
```

### Allocation Response
```json
{
  "allocation_id": 1,
  "employee_id": 1,
  "project_id": 5,
  "weekly_hours_allocated": 20,
  "weekly_tasks_allocated": 100,
  "productivity_override": null,
  "effective_week": "2025-02-01"
}
```

### Leave Response
```json
{
  "leave_id": 1,
  "employee_id": 1,
  "start_date": "2025-02-15",
  "end_date": "2025-02-20",
  "leave_type": "vacation"
}
```

## Error Handling

All API calls include error handling:

```javascript
try {
  const project = await projectsAPI.create(projectData);
  // Handle success
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error (show user notification, etc.)
}
```

### Expected Error Format
```json
{
  "error": true,
  "message": "Validation error: missing required field 'name'",
  "status": 400
}
```

## Custom Hooks Integration

Use custom hooks for automatic state management:

```javascript
import { useProjects } from '../hooks/useProjects';

function MyComponent() {
  const { projects, loading, error, createProject } = useProjects();
  
  // projects are automatically fetched and updated
  // loading and error states are managed
  // createProject handles API call and state update
}
```

## CORS Configuration

Backend must allow CORS from frontend origin:

```python
# Example for FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Authentication (Future)

To add authentication, modify `src/api/config.js`:

```javascript
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

function getAuthToken() {
  return localStorage.getItem('auth_token');
}
```
