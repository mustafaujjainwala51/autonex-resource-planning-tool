import { apiRequest, API_ENDPOINTS, HTTP_METHODS } from './config';

/**
 * Employees API Service
 * Handles all employee-related API calls
 */

export const employeesAPI = {
  /**
   * Get all employees
   */
  getAll: async () => {
    return await apiRequest(API_ENDPOINTS.EMPLOYEES, HTTP_METHODS.GET);
  },

  /**
   * Get employee by ID
   */
  getById: async (employeeId) => {
    return await apiRequest(API_ENDPOINTS.EMPLOYEE_BY_ID(employeeId), HTTP_METHODS.GET);
  },

  /**
   * Create new employee
   */
  create: async (employeeData) => {
    return await apiRequest(API_ENDPOINTS.EMPLOYEES, HTTP_METHODS.POST, employeeData);
  },

  /**
   * Update employee
   */
  update: async (employeeId, employeeData) => {
    return await apiRequest(
      API_ENDPOINTS.EMPLOYEE_BY_ID(employeeId),
      HTTP_METHODS.PUT,
      employeeData
    );
  },

  /**
   * Delete employee
   */
  delete: async (employeeId) => {
    return await apiRequest(
      API_ENDPOINTS.EMPLOYEE_BY_ID(employeeId),
      HTTP_METHODS.DELETE
    );
  },

  /**
   * Filter employees by skills
   */
  filterBySkills: async (employees, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) {
      return employees;
    }

    return employees.filter(employee => 
      requiredSkills.every(skill => employee.skills.includes(skill))
    );
  },

  /**
   * Get available employees (not on leave)
   */
  getAvailable: async (employees, leaves, date = new Date()) => {
    return employees.filter(employee => {
      const employeeLeaves = leaves.filter(leave => leave.employee_id === employee.employee_id);
      
      return !employeeLeaves.some(leave => {
        const leaveStart = new Date(leave.start_date);
        const leaveEnd = new Date(leave.end_date);
        return date >= leaveStart && date <= leaveEnd;
      });
    });
  }
};
