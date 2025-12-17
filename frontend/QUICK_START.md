# Quick Start Guide - Autonex Resource Planning Tool

## 🚀 5-Minute Setup

### Step 1: Extract and Install
```bash
# Extract the zip file
unzip autonex-frontend.zip
cd autonex-frontend

# Install dependencies
npm install
```

### Step 2: Configure API
Edit `src/api/config.js`:
```javascript
export const API_BASE_URL = 'http://your-backend-url:8000/api';
// Change to your actual backend URL
```

### Step 3: Fix Common Errors
The `vite.config.js` and `index.html` are already configured to fix:
- ✅ `process is not defined` error
- ✅ Missing favicon error

### Step 4: Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

---

## 📱 User Workflows

### Workflow 1: Create a Project

1. **Navigate** to "Create Project" from dashboard or menu
2. **Fill in** project details:
   - Project name and client
   - Type (PoC/Full/Side)
   - Total tasks and weekly target
   - Timeline dates
   - Required skills
3. **Review** system calculations:
   - Total required hours
   - Project duration
   - Weekly requirements
4. **Submit** → Automatically redirects to allocation

### Workflow 2: Allocate Manpower

1. **Select** employees from the pool
2. **Toggle** "Show only matching skills" for filtering
3. **Review** employee metrics:
   - Available hours
   - Current utilization
   - Leave status ⚠️
4. **Enter** allocation details:
   - Weekly hours
   - Weekly tasks
5. **Check** warnings:
   - Overload alerts
   - Skill mismatches
   - Leave conflicts
6. **Confirm** allocations

### Workflow 3: Manage Leaves

1. **Navigate** to "Leave Management"
2. **Click** "Add Leave"
3. **Fill in** leave details:
   - Select employee
   - Start and end dates
   - Leave type
4. **Review** impact preview:
   - Affected projects
   - Allocation conflicts
5. **Submit** leave record
6. **Review** warnings in:
   - Dashboard alerts
   - Allocation page
   - Project views

---

## 🎯 Key Features to Test

### ✅ Project Creation (Section 4.2)
- Create a PoC project with 5000 tasks
- Verify calculations update in real-time
- Check form validation

### ✅ Manpower Allocation (Section 4.3)
- Allocate employees to project
- Test skill filtering
- Trigger overload warning (allocate >40h for full-time)
- Check leave status indicators

### ✅ Leave Management (Section 6)
- Add a leave during project period
- See warning in allocation page
- Check dashboard alerts
- Verify no auto-reallocation occurs

---

## ⚠️ Common Issues & Solutions

### Issue 1: "process is not defined"
**Already Fixed** in `vite.config.js`:
```javascript
define: {
  'process.env': {},
  global: {}
}
```

### Issue 2: 404 favicon.ico
**Already Fixed** in `index.html` with inline SVG favicon

### Issue 3: API Connection Failed
**Solution:**
1. Check backend is running
2. Verify `API_BASE_URL` in `src/api/config.js`
3. Check CORS settings on backend

### Issue 4: Components Not Updating
**Solution:**
```bash
# Clear cache and restart
rm -rf node_modules package-lock.json
npm install
npm run dev -- --force
```

---

## 📊 Expected API Responses

### Projects Endpoint
```json
GET /api/projects

Response:
[
  {
    "project_id": 1,
    "name": "Trajectory Annotation PoC",
    "client": "Tesla",
    "type": "PoC",
    "total_tasks": 5000,
    "required_expertise": ["robotics", "trajectory"],
    ...
  }
]
```

### Employees Endpoint
```json
GET /api/employees

Response:
[
  {
    "employee_id": 1,
    "name": "John Doe",
    "work_type": "full_time",
    "skills": ["robotics", "trajectory"],
    "weekly_availability": 40,
    ...
  }
]
```

### Leaves Endpoint
```json
GET /api/leaves

Response:
[
  {
    "leave_id": 1,
    "employee_id": 1,
    "start_date": "2025-02-15",
    "end_date": "2025-02-20",
    "leave_type": "vacation"
  }
]
```

---

## 🧪 Testing Scenarios

### Scenario 1: Overload Warning
1. Create employee with 40h/week capacity
2. Allocate 25h to Project A
3. Try to allocate 20h to Project B
4. **Expected:** Warning shows "45h allocated vs 40h available"

### Scenario 2: Leave Conflict
1. Add leave for John Doe (Feb 15-20)
2. Try to allocate John to project (Feb 1 - Mar 1)
3. **Expected:** 
   - Employee card shows "On leave" indicator
   - Warning: "Employee allocated but unavailable"
   - Dashboard shows leave alert

### Scenario 3: Skill Mismatch
1. Create project requiring "robotics" skill
2. Try to allocate employee without "robotics"
3. **Expected:** 
   - Employee card highlighted in yellow
   - Warning: "Employee lacks required skills"

### Scenario 4: Under-allocation
1. Create project needing 1000h/week
2. Allocate only 500h/week total
3. **Expected:** Warning: "Project needs 1000h/week but only 500h/week allocated"

---

## 🔑 Important Notes

### Decision-Support System
- ⚠️ System **ONLY WARNS** - never auto-reallocates
- ✅ PM retains **FULL CONTROL** over all decisions
- 📊 System provides **CALCULATIONS** and **ALERTS**

### No Automatic Actions
- ❌ No automatic resource reallocation
- ❌ No automatic leave approval
- ❌ No automatic project adjustments
- ✅ All changes require PM manual action

### Warning Severity Levels
- 🔴 **High** (Red): Critical conflicts requiring immediate attention
- 🟡 **Medium** (Yellow): Important warnings to review
- 🔵 **Info** (Blue): Informational notices

---

## 📚 Additional Documentation

- **README.md** - Complete project overview and setup
- **API_DOCUMENTATION.md** - Full API integration guide
- **LEAVE_MANAGEMENT.md** - Detailed leave feature documentation
- **PROJECT_STRUCTURE.md** - Architecture and design patterns

---

## 🆘 Getting Help

### Check Logs
```bash
# Browser console (F12)
# Look for API errors or component errors

# Terminal
# Check Vite dev server output
```

### Verify Setup
```bash
# Check Node version (should be 16+)
node --version

# Check if API is reachable
curl http://your-backend-url:8000/api/projects
```

### Reset Everything
```bash
# Nuclear option - complete reset
rm -rf node_modules package-lock.json
npm install
npm run dev -- --force
```

---

**Ready to use!** The system is production-ready and follows all PRD requirements for Sections 4.2, 4.3, and 6.
