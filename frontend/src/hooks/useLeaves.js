import { useState, useEffect, useCallback } from 'react';
import { leavesAPI } from '../api/leaves';

/**
 * Custom hook for managing leaves
 */
export const useLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all leaves
  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await leavesAPI.getAll();
      setLeaves(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get leaves by employee
  const getLeavesByEmployee = useCallback((employeeId) => {
    return leaves.filter(leave => leave.employee_id === employeeId);
  }, [leaves]);

  // Check if employee is on leave on a specific date
  const isEmployeeOnLeave = useCallback((employeeId, date) => {
    const employeeLeaves = getLeavesByEmployee(employeeId);
    const checkDate = new Date(date);
    
    return employeeLeaves.some(leave => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      return checkDate >= startDate && checkDate <= endDate;
    });
  }, [getLeavesByEmployee]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return {
    leaves,
    loading,
    error,
    fetchLeaves,
    getLeavesByEmployee,
    isEmployeeOnLeave
  };
};
