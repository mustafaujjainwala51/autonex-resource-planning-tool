import { apiRequest, API_ENDPOINTS, HTTP_METHODS } from './config';

/**
 * Leaves API Service
 * Handles all leave-related API calls
 */

export const leavesAPI = {
  /**
   * Get all leaves
   */
  getAll: async () => {
    return await apiRequest(API_ENDPOINTS.LEAVES, HTTP_METHODS.GET);
  },

  /**
   * Get leaves by employee
   */
  getByEmployee: async (employeeId) => {
    return await apiRequest(API_ENDPOINTS.LEAVES_BY_EMPLOYEE(employeeId), HTTP_METHODS.GET);
  },

  /**
   * Create new leave
   */
  create: async (leaveData) => {
    return await apiRequest(API_ENDPOINTS.LEAVES, HTTP_METHODS.POST, leaveData);
  },

  /**
   * Update leave
   */
  update: async (leaveId, leaveData) => {
    return await apiRequest(
      `${API_ENDPOINTS.LEAVES}/${leaveId}`,
      HTTP_METHODS.PUT,
      leaveData
    );
  },

  /**
   * Delete leave
   */
  delete: async (leaveId) => {
    return await apiRequest(
      `${API_ENDPOINTS.LEAVES}/${leaveId}`,
      HTTP_METHODS.DELETE
    );
  }
};
