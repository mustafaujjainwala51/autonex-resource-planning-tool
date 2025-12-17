import { apiRequest, API_ENDPOINTS, HTTP_METHODS } from './config';

/**
 * Projects API Service
 * Handles all project-related API calls
 */

export const projectsAPI = {
  /**
   * Get all projects
   */
  getAll: async () => {
    return await apiRequest(API_ENDPOINTS.PROJECTS, HTTP_METHODS.GET);
  },

  /**
   * Get project by ID
   */
  getById: async (projectId) => {
    return await apiRequest(API_ENDPOINTS.PROJECT_BY_ID(projectId), HTTP_METHODS.GET);
  },

  /**
   * Create new project
   * @param {Object} projectData - Project data matching the PRD schema
   * @returns {Promise<Object>} Created project
   */
  create: async (projectData) => {
    // Validate required fields as per PRD Section 4.2
    const requiredFields = [
      'name',
      'client',
      'type',
      'total_tasks',
      'sla_deadline',
      'required_expertise',
      'estimated_time_per_task',
      'weekly_target',
      'start_date',
      'end_date'
    ];

    const missingFields = requiredFields.filter(field => !projectData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return await apiRequest(API_ENDPOINTS.PROJECTS, HTTP_METHODS.POST, projectData);
  },

  /**
   * Update project
   */
  update: async (projectId, projectData) => {
    return await apiRequest(
      API_ENDPOINTS.PROJECT_BY_ID(projectId),
      HTTP_METHODS.PUT,
      projectData
    );
  },

  /**
   * Delete project
   */
  delete: async (projectId) => {
    return await apiRequest(
      API_ENDPOINTS.PROJECT_BY_ID(projectId),
      HTTP_METHODS.DELETE
    );
  },

  /**
   * Calculate project requirements
   * Helper function for frontend calculations
   */
  calculateRequirements: (projectData) => {
    const { total_tasks, estimated_time_per_task, start_date, end_date } = projectData;
    
    const requiredHours = total_tasks * estimated_time_per_task;
    
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(diffDays / 7);
    
    const weeklyRequiredHours = weeks > 0 ? requiredHours / weeks : requiredHours;
    
    return {
      requiredHours,
      projectDurationWeeks: weeks,
      weeklyRequiredHours
    };
  }
};
