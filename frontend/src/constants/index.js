// Project Types
export const PROJECT_TYPES = {
  POC: 'PoC',
  FULL: 'Full',
  SIDE: 'Side'
};

// Skill Categories
export const SKILLS = {
  ROBOTICS: 'robotics',
  TRAJECTORY: 'trajectory',
  MEDICAL_IMAGING: 'medical_imaging',
  CODING: 'coding',
  DATA_ANNOTATION: 'data_annotation',
  QUALITY_ASSURANCE: 'quality_assurance'
};

// Work Types
export const WORK_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time'
};

// Hours per day
export const HOURS_PER_DAY = {
  FULL_TIME: 8,
  PART_TIME: 4
};

// Working days per week
export const WORKING_DAYS_PER_WEEK = 5;

// Warning thresholds
export const WARNING_THRESHOLDS = {
  PRODUCTIVITY_DEVIATION: 0.3, // 30%
  OVERLOAD_THRESHOLD: 1.0 // 100% of available hours
};

// Leave Status
export const LEAVE_STATUS = {
  ON_LEAVE: 'on_leave',
  AVAILABLE: 'available'
};

// Allocation Warning Types
export const WARNING_TYPES = {
  OVERLOAD: 'overload',
  UNDER_ALLOCATION: 'under_allocation',
  SKILL_MISMATCH: 'skill_mismatch',
  ON_LEAVE: 'on_leave',
  PRODUCTIVITY_MISMATCH: 'productivity_mismatch'
};
