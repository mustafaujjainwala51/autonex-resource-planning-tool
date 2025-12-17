import { HOURS_PER_DAY, WORKING_DAYS_PER_WEEK, WORK_TYPES, WARNING_TYPES } from '../constants';

/**
 * Calculate available hours per week for an employee
 */
export const calculateAvailableHours = (workType) => {
  const hoursPerDay = workType === WORK_TYPES.FULL_TIME 
    ? HOURS_PER_DAY.FULL_TIME 
    : HOURS_PER_DAY.PART_TIME;
  
  return WORKING_DAYS_PER_WEEK * hoursPerDay;
};

/**
 * Calculate total required hours for a project
 */
export const calculateRequiredHours = (totalTasks, timePerTask) => {
  return totalTasks * timePerTask;
};

/**
 * Calculate weekly required hours
 */
export const calculateWeeklyRequiredHours = (requiredHours, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.ceil(diffDays / 7);
  
  return weeks > 0 ? requiredHours / weeks : requiredHours;
};

/**
 * Calculate project duration in weeks
 */
export const calculateProjectDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
};

/**
 * Check if employee has required skills
 */
export const hasRequiredSkills = (employeeSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return true;
  return requiredSkills.every(skill => employeeSkills.includes(skill));
};

/**
 * Calculate total allocated hours for an employee across all projects
 */
export const calculateTotalAllocatedHours = (allocations, employeeId) => {
  return allocations
    .filter(allocation => allocation.employee_id === employeeId)
    .reduce((total, allocation) => total + allocation.weekly_hours_allocated, 0);
};

/**
 * Check if date falls within leave period
 */
export const isOnLeave = (date, leaves) => {
  const checkDate = new Date(date);
  return leaves.some(leave => {
    const startDate = new Date(leave.start_date);
    const endDate = new Date(leave.end_date);
    return checkDate >= startDate && checkDate <= endDate;
  });
};

/**
 * Generate allocation warnings
 */
export const generateAllocationWarnings = (
  employee,
  allocation,
  project,
  existingAllocations,
  leaves
) => {
  const warnings = [];
  
  // Calculate available hours
  const availableHours = calculateAvailableHours(employee.work_type);
  
  // Calculate total allocated hours including this allocation
  const totalAllocated = calculateTotalAllocatedHours(existingAllocations, employee.employee_id) 
    + allocation.weekly_hours_allocated;
  
  // Check overload
  if (totalAllocated > availableHours) {
    warnings.push({
      type: WARNING_TYPES.OVERLOAD,
      message: `Employee overloaded: ${totalAllocated}h allocated vs ${availableHours}h available`,
      severity: 'high'
    });
  }
  
  // Check skill mismatch
  if (!hasRequiredSkills(employee.skills, project.required_expertise)) {
    warnings.push({
      type: WARNING_TYPES.SKILL_MISMATCH,
      message: `Employee lacks required skills: ${project.required_expertise.join(', ')}`,
      severity: 'medium'
    });
  }
  
  // Check leave status
  if (leaves && leaves.length > 0) {
    const projectStart = new Date(project.start_date);
    const projectEnd = new Date(project.end_date);
    
    const hasLeaveConflict = leaves.some(leave => {
      const leaveStart = new Date(leave.start_date);
      const leaveEnd = new Date(leave.end_date);
      return (leaveStart <= projectEnd && leaveEnd >= projectStart);
    });
    
    if (hasLeaveConflict) {
      warnings.push({
        type: WARNING_TYPES.ON_LEAVE,
        message: `Employee has scheduled leave during project period`,
        severity: 'high'
      });
    }
  }
  
  return warnings;
};

/**
 * Check project under-allocation
 */
export const checkProjectUnderAllocation = (project, allocations) => {
  const requiredHours = calculateRequiredHours(project.total_tasks, project.estimated_time_per_task);
  const weeklyRequired = calculateWeeklyRequiredHours(requiredHours, project.start_date, project.end_date);
  
  const totalAllocatedHours = allocations
    .filter(allocation => allocation.project_id === project.project_id)
    .reduce((total, allocation) => total + allocation.weekly_hours_allocated, 0);
  
  if (totalAllocatedHours < weeklyRequired) {
    return {
      isUnderAllocated: true,
      required: weeklyRequired,
      allocated: totalAllocatedHours,
      shortage: weeklyRequired - totalAllocatedHours
    };
  }
  
  return { isUnderAllocated: false };
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Validate project form data
 */
export const validateProjectForm = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Project name is required';
  }
  
  if (!formData.client || formData.client.trim() === '') {
    errors.client = 'Client name is required';
  }
  
  if (!formData.type) {
    errors.type = 'Project type is required';
  }
  
  if (!formData.total_tasks || formData.total_tasks <= 0) {
    errors.total_tasks = 'Total tasks must be greater than 0';
  }
  
  if (!formData.sla_deadline) {
    errors.sla_deadline = 'SLA deadline is required';
  }
  
  if (!formData.estimated_time_per_task || formData.estimated_time_per_task <= 0) {
    errors.estimated_time_per_task = 'Time per task must be greater than 0';
  }
  
  if (!formData.start_date) {
    errors.start_date = 'Start date is required';
  }
  
  if (!formData.end_date) {
    errors.end_date = 'End date is required';
  }
  
  if (formData.start_date && formData.end_date) {
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    if (end <= start) {
      errors.end_date = 'End date must be after start date';
    }
  }
  
  return errors;
};
