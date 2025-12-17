# Leave Management Feature - Section 6

## Overview

The Leave Management system provides manual leave tracking with comprehensive impact analysis on project allocations. This is a **decision-support system** that alerts PMs about conflicts but does not automatically reallocate resources.

## Key Features

### ✅ Manual Leave Entry
- PMs manually enter leave records
- No automatic integration with external systems
- Full CRUD operations (Create, Read, Update, Delete)

### ✅ Leave Impact Analysis
- Real-time conflict detection
- Project impact warnings
- Overlapping leave detection
- Resource availability tracking

### ✅ Visual Indicators
- Color-coded leave status
- Active vs. upcoming leaves
- Leave type badges
- Warning severity levels

### ❌ No Auto-Reallocation
- System only warns and alerts
- PM must manually reassign resources
- Decision remains with PM

## Leave Data Structure

```javascript
{
  leave_id: 1,
  employee_id: 5,
  start_date: "2025-02-15",
  end_date: "2025-02-20",
  leave_type: "vacation" // casual, sick, vacation, personal, emergency
}
```

## API Endpoints

### Create Leave
```javascript
POST /api/leaves
{
  "employee_id": 5,
  "start_date": "2025-02-15",
  "end_date": "2025-02-20",
  "leave_type": "vacation"
}
```

### Get All Leaves
```javascript
GET /api/leaves
```

### Get Leaves by Employee
```javascript
GET /api/leaves/employee/{employee_id}
```

### Update Leave
```javascript
PUT /api/leaves/{leave_id}
{
  "start_date": "2025-02-16",
  "end_date": "2025-02-21",
  "leave_type": "sick"
}
```

### Delete Leave
```javascript
DELETE /api/leaves/{leave_id}
```

## Impact Analysis Logic

### Leave Conflict Detection

The system checks for conflicts when:
1. A leave is added/edited
2. An allocation is created/modified
3. Dashboard is loaded

**Conflict occurs when:**
```
Leave Start Date ≤ Project End Date
AND
Leave End Date ≥ Project Start Date
```

### Warning Generation

**High Severity Warnings:**
- Employee allocated to project during leave period
- Critical project understaffed due to leave

**Medium Severity Warnings:**
- Multiple employees on leave simultaneously
- Upcoming leaves affecting project timelines

**Info Level:**
- No conflicts detected
- Leave outside all project timelines

## UI Integration

### 1. Leave Management Page (`/leaves`)

**Features:**
- Complete leave CRUD interface
- Leave statistics dashboard
- Impact preview before submission
- Filter by employee
- Active/upcoming leave indicators

**Components:**
- Leave entry form
- Leave records list
- Impact analysis display
- Leave statistics cards

### 2. Project Allocation Page

**Integration:**
- Employee cards show leave status
- Visual indicator for employees on leave
- Leave warnings in allocation warnings
- Color-coded employee cards:
  - 🟢 Available
  - 🟡 Skill mismatch
  - 🔴 On leave

### 3. Dashboard

**Leave Alerts Section:**
- Currently on leave count
- Upcoming leaves (next 7 days)
- Employee names and dates
- Quick link to leave management

## Warning System

### Warning Types

```javascript
// Leave Conflict
{
  type: 'leave_conflict',
  message: 'John Doe on leave during Project X (20h/week allocated)',
  severity: 'high',
  projectId: 5,
  projectName: 'Project X'
}

// Multiple Leaves
{
  type: 'multiple_leaves',
  message: '3 other employee(s) also on leave during this period',
  severity: 'medium'
}
```

### Visual Indicators

**Colors:**
- 🔴 High Severity: Red background (#fee2e2)
- 🟡 Medium Severity: Yellow background (#fef3c7)
- 🔵 Info: Blue background (#dbeafe)

**Icons:**
- ⚠️ Warning
- 🚫 Block/Unavailable
- 📅 Upcoming
- ✓ No conflicts

## Usage Examples

### Example 1: Adding Leave with Impact

**Scenario:** PM adds vacation leave for John Doe

**System Response:**
1. Checks all active allocations for John
2. Identifies overlapping projects
3. Shows preview of affected projects
4. Displays warnings before submission
5. After creation, shows full impact analysis

**PM Action Required:**
- Review affected projects
- Manually reassign workload
- Update project timelines if needed

### Example 2: Allocation During Leave

**Scenario:** PM tries to allocate employee who has leave

**System Response:**
1. Employee card shows "On leave" indicator
2. Warning generated: "Employee allocated but unavailable"
3. Color-coded card (yellow/orange)
4. Warning persists but allows allocation

**PM Action Required:**
- Consider alternative employee
- Or acknowledge and plan accordingly

### Example 3: Dashboard Alerts

**Scenario:** PM opens dashboard

**System Response:**
1. Shows count of currently on-leave employees
2. Lists upcoming leaves (next 7 days)
3. Provides quick navigation to leave management

**PM Action Required:**
- Review alerts
- Plan for upcoming absences
- Adjust allocations proactively

## Leave Statistics

The system tracks and displays:

- **Total Leaves**: All recorded leaves
- **Currently On Leave**: Leaves active today
- **Upcoming Leaves**: Leaves starting in next 30 days
- **Leave Duration**: Calculated in days
- **Affected Projects**: Projects impacted by each leave

## Best Practices

### For PMs

1. **Enter leaves as soon as known** - Don't wait until the last minute
2. **Review impact analysis** - Check all affected projects
3. **Reallocate proactively** - Don't wait for conflicts
4. **Monitor dashboard alerts** - Check regularly for upcoming leaves
5. **Update project timelines** - Adjust deadlines if needed

### For System Usage

1. **Always check allocation warnings** - Including leave conflicts
2. **Filter by employee** - For focused leave management
3. **Use leave type appropriately** - Categorize correctly
4. **Verify dates carefully** - Ensure correct leave periods
5. **Review before delete** - Check impact before removing leaves

## Technical Implementation

### State Management

```javascript
// Custom hook for leaves
const { leaves, fetchLeaves, getLeavesByEmployee, isEmployeeOnLeave } = useLeaves();

// Usage in components
const employeeLeaves = getLeavesByEmployee(employeeId);
const onLeave = isEmployeeOnLeave(employeeId, new Date());
```

### Calculation Functions

```javascript
// Check leave overlap
const hasLeaveConflict = (leave, project) => {
  const leaveStart = new Date(leave.start_date);
  const leaveEnd = new Date(leave.end_date);
  const projectStart = new Date(project.start_date);
  const projectEnd = new Date(project.end_date);
  
  return leaveStart <= projectEnd && leaveEnd >= projectStart;
};

// Calculate impact
const calculateLeaveImpact = (leave) => {
  // Find affected allocations
  // Generate warnings
  // Return impact summary
};
```

### Component Structure

```
LeaveManagement.jsx
├── Leave Statistics
├── Add/Edit Form
│   ├── Employee Selection
│   ├── Date Inputs
│   ├── Leave Type
│   └── Impact Preview
├── Filter
└── Leave Records List
    └── Leave Card
        ├── Employee Info
        ├── Leave Details
        ├── Impact Warnings
        └── Actions (Edit/Delete)
```

## Styling

### CSS Classes

```css
.leave-card              /* Main card container */
.leave-card.active-leave /* Currently active leave */
.leave-badge             /* Leave type badge */
.status-badge.active     /* Active status */
.status-badge.upcoming   /* Upcoming status */
.leave-impact            /* Impact section */
.affected-projects       /* Project list */
.employee-card.on-leave  /* Employee on leave indicator */
.leave-indicator         /* Warning indicator */
```

### Color Scheme

- **Casual Leave**: Blue (#dbeafe)
- **Sick Leave**: Red (#fee2e2)
- **Vacation**: Green (#dcfce7)
- **Personal**: Yellow (#fef3c7)
- **Emergency**: Pink (#fce7f3)

## Future Enhancements (Phase 2)

Potential additions:
- Leave balance tracking
- Automatic email notifications
- Leave approval workflow
- Calendar view of leaves
- Team leave calendar
- Export leave reports
- Integration with external HR systems
- Recurring leave patterns

## Troubleshooting

### Issue: Leave not showing in allocation warnings
**Solution:** Ensure dates overlap with project timeline

### Issue: Impact analysis not updating
**Solution:** Refresh leaves with `fetchLeaves()`

### Issue: Cannot delete leave
**Solution:** Check backend for referential constraints

### Issue: Warnings not visible
**Solution:** Verify warning generation logic and CSS

## Testing Checklist

- [ ] Create leave with valid data
- [ ] Create leave with overlapping dates
- [ ] Edit existing leave
- [ ] Delete leave
- [ ] View leave impact on projects
- [ ] Check allocation warnings for leave
- [ ] Verify dashboard alerts
- [ ] Filter leaves by employee
- [ ] Check active leave indicators
- [ ] Verify upcoming leave notifications

---

**Implemented:** PRD Section 6 - Leave Management  
**Decision-Support:** ✅ Warnings only, no auto-reallocation  
**Manual Control:** ✅ PM retains full control
