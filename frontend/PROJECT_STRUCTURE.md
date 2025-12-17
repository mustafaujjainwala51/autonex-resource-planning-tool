# Project Structure Documentation

## Complete File Tree

```
autonex-frontend/
├── public/                           # Static assets (if needed)
├── src/
│   ├── api/                          # API Layer - Backend Communication
│   │   ├── config.js                 # API configuration and request handler
│   │   ├── projects.js               # Projects CRUD operations
│   │   ├── employees.js              # Employees data management
│   │   ├── allocations.js            # Allocations operations
│   │   └── leaves.js                 # Leaves management
│   │
│   ├── components/                   # Reusable UI Components
│   │   ├── Button.jsx                # Button component with variants
│   │   ├── Card.jsx                  # Card container component
│   │   ├── Input.jsx                 # Text/number input component
│   │   ├── LoadingSpinner.jsx        # Loading indicator
│   │   ├── MultiSelect.jsx           # Multi-selection checkbox component
│   │   ├── Navigation.jsx            # App navigation bar
│   │   ├── Select.jsx                # Dropdown selection component
│   │   └── WarningAlert.jsx          # System warnings display
│   │
│   ├── constants/                    # Application Constants
│   │   └── index.js                  # All constants (types, skills, thresholds)
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useProjects.js            # Projects state management
│   │   ├── useEmployees.js           # Employees state management
│   │   ├── useAllocations.js         # Allocations state management
│   │   └── useLeaves.js              # Leaves state management
│   │
│   ├── pages/                        # Page Components
│   │   ├── Dashboard.jsx             # Dashboard page
│   │   ├── ProjectCreate.jsx         # Project creation (Section 4.2)
│   │   ├── ProjectList.jsx           # Projects listing page
│   │   ├── ProjectAllocation.jsx     # Allocation page (Section 4.3)
│   │   └── AllocationsList.jsx       # Allocations overview
│   │
│   ├── styles/                       # Stylesheets
│   │   └── main.css                  # Main stylesheet
│   │
│   ├── utils/                        # Utility Functions
│   │   └── calculations.js           # All calculation and validation functions
│   │
│   ├── App.jsx                       # Main app component with routing
│   └── main.jsx                      # Application entry point
│
├── index.html                        # HTML template
├── package.json                      # Dependencies and scripts
├── vite.config.js                    # Vite configuration
├── .gitignore                        # Git ignore rules
├── .env.example                      # Environment variables template
├── README.md                         # Main documentation
└── API_DOCUMENTATION.md              # API integration guide
```

## Module Responsibilities

### API Layer (`src/api/`)
**Purpose:** Centralized backend communication

- **config.js** - Base URL, headers, request handler with error handling
- **projects.js** - Project CRUD + calculation helpers
- **employees.js** - Employee management + filtering utilities
- **allocations.js** - Allocation CRUD + batch operations
- **leaves.js** - Leave management

**Key Features:**
- Consistent error handling
- Type validation before API calls
- Reusable request handler
- Environment-based configuration

---

### Custom Hooks (`src/hooks/`)
**Purpose:** State management and data fetching logic

Each hook provides:
- `loading` state - Indicates API calls in progress
- `error` state - Captures and exposes errors
- `data` - The actual data (projects, employees, etc.)
- CRUD operations - Create, read, update, delete functions

**Benefits:**
- Automatic data fetching on component mount
- Centralized state management
- Reusable across multiple components
- Separation of concerns

---

### Components (`src/components/`)
**Purpose:** Reusable, presentation-only UI elements

**Design Principles:**
- Single responsibility
- Prop-based configuration
- No business logic
- Consistent styling

**Component Breakdown:**

1. **Input.jsx** - Text/number/date inputs with validation
2. **Select.jsx** - Dropdown with options
3. **MultiSelect.jsx** - Checkbox-based multi-selection
4. **Button.jsx** - Action button with variants (primary, secondary)
5. **Card.jsx** - Content container with optional header/actions
6. **WarningAlert.jsx** - Color-coded alerts (danger, warning, info)
7. **LoadingSpinner.jsx** - Loading indicator
8. **Navigation.jsx** - Top navigation bar

---

### Pages (`src/pages/`)
**Purpose:** Complete page views with business logic

1. **Dashboard.jsx**
   - Overview statistics
   - Quick actions
   - Recent projects list

2. **ProjectCreate.jsx** ⭐ **Section 4.2**
   - Project creation form
   - Real-time calculations
   - Validation
   - Skills selection

3. **ProjectAllocation.jsx** ⭐ **Section 4.3**
   - Employee selection
   - Skill filtering
   - Warning system
   - Allocation inputs
   - Real-time metrics

4. **ProjectList.jsx**
   - All projects view
   - Type filtering
   - Project cards

5. **AllocationsList.jsx**
   - Allocations table
   - Employee-project mappings

---

### Utilities (`src/utils/`)
**Purpose:** Pure functions for calculations and validation

**calculations.js includes:**

**Calculation Functions:**
- `calculateAvailableHours()` - Weekly capacity
- `calculateRequiredHours()` - Project total
- `calculateWeeklyRequiredHours()` - Weekly distribution
- `calculateProjectDuration()` - Duration in weeks
- `calculateTotalAllocatedHours()` - Current allocations

**Validation Functions:**
- `validateProjectForm()` - Form validation
- `hasRequiredSkills()` - Skill matching

**Warning Generation:**
- `generateAllocationWarnings()` - Employee-level warnings
- `checkProjectUnderAllocation()` - Project-level warnings

**Helper Functions:**
- `formatDate()` - Date formatting
- `isOnLeave()` - Leave checking

---

### Constants (`src/constants/`)
**Purpose:** Single source of truth for app-wide values

**Categories:**
- Project types (PoC, Full, Side)
- Skills (robotics, trajectory, medical_imaging, etc.)
- Work types (full_time, part_time)
- Hours per day (8 for FT, 4 for PT)
- Warning thresholds
- Warning types

**Benefits:**
- Easy to modify
- Type safety
- Consistency across app

---

### Styles (`src/styles/`)
**Purpose:** Professional, responsive styling

**main.css includes:**
- CSS variables for easy theming
- Component-specific styles
- Responsive breakpoints
- Utility classes
- Animations

**Color Scheme:**
- Primary: Blue (#2563eb)
- Danger: Red (#ef4444)
- Warning: Orange (#f59e0b)
- Success: Green (#10b981)

---

## Data Flow

### Project Creation Flow
```
User Input → ProjectCreate.jsx
           ↓
     validateProjectForm()
           ↓
     useProjects.createProject()
           ↓
     projectsAPI.create()
           ↓
     API Request
           ↓
     Update Local State
           ↓
     Navigate to Allocation
```

### Allocation Flow
```
ProjectAllocation.jsx
           ↓
   Load: useProjects, useEmployees,
         useAllocations, useLeaves
           ↓
   User Selects Employee
           ↓
   calculateAvailableHours()
           ↓
   User Enters Allocation Data
           ↓
   generateAllocationWarnings()
           ↓
   Display Warnings
           ↓
   User Confirms
           ↓
   allocationsAPI.create()
           ↓
   Update State
```

## Key Design Patterns

### 1. Separation of Concerns
- **API Layer** - Backend communication only
- **Hooks** - State management only
- **Components** - Presentation only
- **Utils** - Pure business logic
- **Pages** - Composition and orchestration

### 2. Single Responsibility
Each module has ONE job:
- `Input.jsx` renders an input field
- `useProjects.js` manages project state
- `calculations.js` performs calculations

### 3. Prop Drilling Avoidance
Use custom hooks instead of passing props through multiple levels:
```javascript
// ❌ Prop drilling
<Parent projects={projects}>
  <Child projects={projects}>
    <GrandChild projects={projects} />

// ✅ Custom hooks
function GrandChild() {
  const { projects } = useProjects();
}
```

### 4. Error Boundaries
All API calls wrapped in try-catch:
```javascript
try {
  const data = await api.call();
} catch (error) {
  setError(error.message);
}
```

## Performance Considerations

### 1. Memoization
Use `useMemo` for expensive calculations:
```javascript
const filteredEmployees = useMemo(() => {
  return employees.filter(/* ... */);
}, [employees, filters]);
```

### 2. Callback Optimization
Use `useCallback` for event handlers:
```javascript
const handleChange = useCallback((e) => {
  // handler logic
}, [dependencies]);
```

### 3. Lazy Loading
Routes can be lazy-loaded:
```javascript
const ProjectCreate = lazy(() => import('./pages/ProjectCreate'));
```

## Testing Strategy (Recommended)

### Unit Tests
- Utility functions (`calculations.js`)
- API services
- Custom hooks

### Integration Tests
- Component interactions
- Form submissions
- API integration

### E2E Tests
- Complete user flows
- Project creation → Allocation → Confirmation

## Extensibility

### Adding New Features

**New Page:**
1. Create page in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Navigation.jsx`

**New API Endpoint:**
1. Add function in appropriate `src/api/*.js`
2. Update custom hook if needed

**New Calculation:**
1. Add function to `src/utils/calculations.js`
2. Export and use in components

**New Component:**
1. Create in `src/components/`
2. Follow existing patterns
3. Add prop types/validation

## Common Tasks

### Update API URL
```javascript
// src/api/config.js
export const API_BASE_URL = 'http://new-url:8000/api';
```

### Add New Skill
```javascript
// src/constants/index.js
export const SKILLS = {
  // ... existing
  NEW_SKILL: 'new_skill'
};
```

### Modify Theme Colors
```css
/* src/styles/main.css */
:root {
  --primary-color: #your-color;
}
```

### Add New Warning Type
```javascript
// src/constants/index.js
export const WARNING_TYPES = {
  // ... existing
  NEW_WARNING: 'new_warning'
};

// src/utils/calculations.js
// Add logic in generateAllocationWarnings()
```

## Best Practices

1. **Always use hooks** - Don't call API directly from components
2. **Validate input** - Use validation functions before API calls
3. **Handle errors** - Always wrap API calls in try-catch
4. **Keep components small** - One component = one responsibility
5. **Use constants** - Never hardcode values
6. **Comment complex logic** - Explain the "why", not the "what"
7. **Follow naming conventions** - Be consistent
8. **Test edge cases** - Empty states, errors, loading

## Troubleshooting Guide

### Issue: Components not updating
**Solution:** Check if hooks are being called correctly

### Issue: API errors
**Solution:** Verify API_BASE_URL and backend is running

### Issue: Warnings not showing
**Solution:** Check calculation logic in `generateAllocationWarnings()`

### Issue: Form validation failing
**Solution:** Check `validateProjectForm()` logic

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Implements:** PRD Sections 4.2 & 4.3
