import { useState, useEffect, useCallback } from 'react';
import { allocationsAPI } from '../api/allocations';

/**
 * Custom hook for managing allocations
 */
export const useAllocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all allocations
  const fetchAllocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await allocationsAPI.getAll();
      setAllocations(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching allocations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get allocations by project
  const getAllocationsByProject = useCallback((projectId) => {
    return allocations.filter(allocation => allocation.project_id === projectId);
  }, [allocations]);

  // Get allocations by employee
  const getAllocationsByEmployee = useCallback((employeeId) => {
    return allocations.filter(allocation => allocation.employee_id === employeeId);
  }, [allocations]);

  // Create allocation
  const createAllocation = async (allocationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newAllocation = await allocationsAPI.create(allocationData);
      setAllocations(prev => [...prev, newAllocation]);
      return newAllocation;
    } catch (err) {
      setError(err.message);
      console.error('Error creating allocation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create multiple allocations
  const createBatchAllocations = async (allocationsList) => {
    setLoading(true);
    setError(null);
    
    try {
      const newAllocations = await allocationsAPI.createBatch(allocationsList);
      setAllocations(prev => [...prev, ...newAllocations]);
      return newAllocations;
    } catch (err) {
      setError(err.message);
      console.error('Error creating batch allocations:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update allocation
  const updateAllocation = async (allocationId, allocationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedAllocation = await allocationsAPI.update(allocationId, allocationData);
      setAllocations(prev => 
        prev.map(a => a.allocation_id === allocationId ? updatedAllocation : a)
      );
      return updatedAllocation;
    } catch (err) {
      setError(err.message);
      console.error('Error updating allocation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete allocation
  const deleteAllocation = async (allocationId) => {
    setLoading(true);
    setError(null);
    
    try {
      await allocationsAPI.delete(allocationId);
      setAllocations(prev => prev.filter(a => a.allocation_id !== allocationId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting allocation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  return {
    allocations,
    loading,
    error,
    fetchAllocations,
    getAllocationsByProject,
    getAllocationsByEmployee,
    createAllocation,
    createBatchAllocations,
    updateAllocation,
    deleteAllocation
  };
};
