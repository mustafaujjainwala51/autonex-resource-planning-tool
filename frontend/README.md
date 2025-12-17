# Autonex Resource Planning & Allocation Tool

A comprehensive React-based frontend application for managing projects, employees, and resource allocation in data annotation workflows.

## 📋 Project Overview

This application implements **Sections 4.2 (Project Setup), 4.3 (Manpower & Allocation Engine), and 6 (Leave Management)** from the Autonex PRD, providing:

- **Project Creation**: Create and configure projects with detailed requirements
- **Manpower Allocation**: Allocate employees to projects with intelligent warnings
- **Leave Management**: Track employee leaves with comprehensive impact analysis
- **System Calculations**: Automatic calculation of required hours, weekly targets, and resource utilization
- **Warning System**: Real-time alerts for overload, skill mismatches, leave conflicts, and project risks

## 🏗️ Architecture

The application follows a modular architecture with clear separation of concerns:

```
frontend/
├── src/
│   ├── api/              # API services (projects, employees, allocations, leaves)
│   ├── components/       # Reusable UI components
│   ├── constants/        # Application constants and enums
│   ├── hooks/            # Custom React hooks for data management
│   ├── pages/            # Page-level components
│   ├── styles/           # CSS stylesheets
│   ├── utils/            # Utility functions and calculations
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (update API_BASE_URL in `src/api/config.js`)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API endpoint:**
   Edit `src/api/config.js` and update the API base URL:
   ```javascript
   export const API_BASE_URL = 'http://your-backend-url:8000/api';
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📦 Module Breakdown

### API Layer (`src/api/`)

**Purpose**: Handles all backend communication

- `config.js` - API configuration and request handler
- `projects.js` - Project CRUD operations
- `employees.js` - Employee data management
- `allocations.js` - Allocation operations
- `leaves.js` - Leave management

### Custom Hooks (`src/hooks/`)

**Purpose**: Manages state and provides data to components

- `useProjects.js` - Project data and operations
- `useEmployees.js` - Employee data and filtering
- `useAllocations.js` - Allocation management
- `useLeaves.js` - Leave tracking

### Components (`src/components/`)

**Purpose**: Reusable UI building blocks

- `Input.jsx` - Text/number input fields
- `Select.jsx` - Dropdown selection
- `MultiSelect.jsx` - Checkbox-based multi-selection
- `Button.jsx` - Action buttons with variants
- `Card.jsx` - Content container
- `WarningAlert.jsx` - System warnings display
- `LoadingSpinner.jsx` - Loading indicator
- `Navigation.jsx` - App navigation bar

### Pages (`src/pages/`)

**Purpose**: Complete page views

- `Dashboard.jsx` - Overview, statistics, and leave alerts
- `ProjectCreate.jsx` - **Section 4.2** - Project creation form
- `ProjectAllocation.jsx` - **Section 4.3** - Employee allocation interface with leave status
- `ProjectList.jsx` - All projects view
- `AllocationsList.jsx` - Allocations overview
- `LeaveManagement.jsx` - **Section 6** - Leave tracking and impact analysis

### Utilities (`src/utils/`)

**Purpose**: Business logic and calculations

- `calculations.js` - All calculation functions:
  - Available hours calculation
  - Required hours calculation
  - Weekly distribution
  - Warning generation
  - Form validation

### Constants (`src/constants/`)

**Purpose**: Application-wide constants

- Project types (PoC, Full, Side)
- Skills and expertise areas
- Work types (Full-time, Part-time)
- Warning types and thresholds

## 🎯 Key Features

### 1. Project Creation (Section 4.2)

**Features:**
- Form with all required fields per PRD
- Real-time calculation of:
  - Total required hours
  - Project duration in weeks
  - Weekly required hours
- Input validation
- Skills multi-selection

**API Contract:**
```json
{
  "name": "Trajectory Annotation PoC",
  "client": "Tesla",
  "type": "PoC",
  "total_tasks": 5000,
  "sla_deadline": "2025-03-10",
  "required_expertise": ["robotics", "trajectory"],
  "estimated_time_per_task": 1.5,
  "weekly_target": 700,
  "start_date": "2025-02-01",
  "end_date": "2025-03-10"
}
```

### 2. Manpower Allocation (Section 4.3)

**Features:**
- Employee selection with skill filtering
- Per-employee metrics:
  - Available hours
  - Current allocations
  - Remaining capacity
  - Utilization percentage
  - **Leave status indicator**
- Real-time warning generation
- Multiple allocation support

**Warning Types:**
- ⚠️ **Overload** - Employee allocated beyond available hours
- ⚠️ **Skill Mismatch** - Missing required expertise
- ⚠️ **Leave Conflict** - Allocated during leave period
- ⚠️ **Under-allocation** - Project needs more resources

### 3. Leave Management (Section 6) 🆕

**Features:**
- Manual leave entry by PMs
- Complete CRUD operations
- Leave types: Casual, Sick, Vacation, Personal, Emergency
- Real-time impact analysis
- Visual leave indicators
- Dashboard alerts for active/upcoming leaves

**Impact Analysis:**
- Identifies affected projects
- Shows allocation conflicts
- Warns about resource unavailability
- Detects overlapping team leaves
- **Decision-support only - NO auto-reallocation**

**Leave Status Visibility:**
- ✅ Employee pool (allocation page)
- ✅ Allocation warnings
- ✅ Dashboard alerts
- ✅ Leave management page

### 4. System Calculations

**Automatic Calculations:**
```javascript
// Available Hours = Days × Hours per Day
Full-time: 5 days × 8 hours = 40 hours/week
Part-time: 5 days × 4 hours = 20 hours/week

// Required Hours = Total Tasks × Time per Task
5000 tasks × 1.5 hours = 7500 hours

// Weekly Required = Required Hours ÷ Duration (weeks)
7500 hours ÷ 6 weeks = 1250 hours/week
```

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Clean Interface** - Minimalist, professional design
- **Color-coded Warnings** - Visual severity indicators
- **Loading States** - Smooth transitions and feedback
- **Form Validation** - Real-time error checking
- **Hover Effects** - Interactive feedback

## 🔧 Customization

### Adding New Skills

Edit `src/constants/index.js`:
```javascript
export const SKILLS = {
  ROBOTICS: 'robotics',
  // Add new skills here
  NEW_SKILL: 'new_skill'
};
```

### Modifying Warning Thresholds

Edit `src/constants/index.js`:
```javascript
export const WARNING_THRESHOLDS = {
  PRODUCTIVITY_DEVIATION: 0.3, // 30%
  OVERLOAD_THRESHOLD: 1.0 // 100%
};
```

### Styling Customization

All styles are in `src/styles/main.css`. Modify CSS variables:
```css
:root {
  --primary-color: #2563eb;
  --danger-color: #ef4444;
  /* ... more variables */
}
```

## 📝 API Integration

The frontend expects these backend endpoints:

```
POST   /api/projects              - Create project
GET    /api/projects              - List projects
GET    /api/projects/:id          - Get project
PUT    /api/projects/:id          - Update project
DELETE /api/projects/:id          - Delete project

GET    /api/employees             - List employees
POST   /api/allocations           - Create allocation
GET    /api/allocations           - List allocations
GET    /api/leaves                - List leaves
GET    /api/leaves/employee/:id   - Employee leaves
```

## 🐛 Troubleshooting

### API Connection Issues
- Check `API_BASE_URL` in `src/api/config.js`
- Verify backend is running
- Check CORS settings on backend

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Development Server Issues
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

## 📄 License

Proprietary - AutonexAI

## 👥 Contact

For questions or support, contact the AutonexAI development team.

---

**Built with React + Vite** | **Implements PRD Sections 4.2, 4.3 & 6**  
**Decision-Support System** | **PM Retains Full Control**
