// API Base URL - Update this with your actual backend URL
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  
  // Employees
  EMPLOYEES: '/employees',
  EMPLOYEE_BY_ID: (id) => `/employees/${id}`,
  
  // Allocations
  ALLOCATIONS: '/allocations',
  ALLOCATION_BY_ID: (id) => `/allocations/${id}`,
  ALLOCATIONS_BY_PROJECT: (projectId) => `/allocations/project/${projectId}`,
  ALLOCATIONS_BY_EMPLOYEE: (employeeId) => `/allocations/employee/${employeeId}`,
  
  // Leaves
  LEAVES: '/leaves',
  LEAVES_BY_EMPLOYEE: (employeeId) => `/leaves/employee/${employeeId}`,
  
  // Productivity
  PRODUCTIVITY: '/productivity',
  PRODUCTIVITY_BY_EMPLOYEE: (employeeId) => `/productivity/employee/${employeeId}`,
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// API Headers
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  // Add authorization headers here if needed
  // 'Authorization': `Bearer ${getAuthToken()}`
});

// API Request Handler
export const apiRequest = async (endpoint, method = HTTP_METHODS.GET, data = null) => {
  const config = {
    method,
    headers: getHeaders(),
  };

  if (data && (method === HTTP_METHODS.POST || method === HTTP_METHODS.PUT || method === HTTP_METHODS.PATCH)) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
