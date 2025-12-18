import { apiRequest, API_ENDPOINTS, HTTP_METHODS } from './config';

/**
 * Allocations API Service
 * Handles all allocation-related API calls
 */

export const allocationsAPI = {
  /**
   * Get all allocations
   */
  getAll: async () => {
    return await apiRequest(API_ENDPOINTS.ALLOCATIONS, HTTP_METHODS.GET);
  },

  /**
   * Get allocation by ID
   */
  getById: async (allocationId) => {
    return await apiRequest(API_ENDPOINTS.ALLOCATION_BY_ID(allocationId), HTTP_METHODS.GET);
  },

  /**
   * Get allocations by project
   */
  getByProject: async (projectId) => {
    return await apiRequest(API_ENDPOINTS.ALLOCATIONS_BY_PROJECT(projectId), HTTP_METHODS.GET);
  },

  /**
   * Get allocations by employee
   */
  getByEmployee: async (employeeId) => {
    return await apiRequest(API_ENDPOINTS.ALLOCATIONS_BY_EMPLOYEE(employeeId), HTTP_METHODS.GET);
  },

  /**
   * Create new allocation
   * @param {Object} allocationData - Allocation data
   * @returns {Promise<Object>} Created allocation
   */
  create: async (allocationData) => {
    // Validate required fields
    const requiredFields = [
      'employee_id',
      'project_id',
      'weekly_hours_allocated',
      'weekly_tasks_allocated',
      'effective_week'
    ];

    const missingFields = requiredFields.filter(field => !allocationData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return await apiRequest(API_ENDPOINTS.ALLOCATIONS, HTTP_METHODS.POST, allocationData);
  },

  /**
   * Update allocation
   */
  update: async (allocationId, allocationData) => {
    return await apiRequest(
      API_ENDPOINTS.ALLOCATION_BY_ID(allocationId),
      HTTP_METHODS.PUT,
      allocationData
    );
  },

  /**
   * Delete allocation
   */
  delete: async (allocationId) => {
    return await apiRequest(
      API_ENDPOINTS.ALLOCATION_BY_ID(allocationId),
      HTTP_METHODS.DELETE
    );
  },

  /**
   * Batch create allocations
   */
  createBatch: async (allocations) => {
    const promises = allocations.map(allocation => 
      allocationsAPI.create(allocation)
    );
    return await Promise.all(promises);
  }
};
