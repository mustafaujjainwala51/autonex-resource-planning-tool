import { useState, useEffect, useCallback } from 'react';
import { employeesAPI } from '../api/employees';

/**
 * Custom hook for managing employees
 */
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await employeesAPI.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get employee by ID
  const getEmployee = useCallback((employeeId) => {
    return employees.find(emp => emp.employee_id === employeeId);
  }, [employees]);

  // Filter employees by skills
  const filterBySkills = useCallback((requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) {
      return employees;
    }
    return employees.filter(employee => 
      requiredSkills.every(skill => employee.skills.includes(skill))
    );
  }, [employees]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    getEmployee,
    filterBySkills
  };
};
