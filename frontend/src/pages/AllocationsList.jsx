import React from 'react';
import { useAllocations } from '../hooks/useAllocations';
import { useEmployees } from '../hooks/useEmployees';
import { useProjects } from '../hooks/useProjects';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';

/**
 * Allocations List Page
 * Displays all allocations with employee and project details
 */
export const AllocationsList = () => {
  const { allocations, loading: allocationsLoading } = useAllocations();
  const { employees, getEmployee } = useEmployees();
  const { projects } = useProjects();

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.project_id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getEmployeeName = (employeeId) => {
    const employee = getEmployee(employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };

  if (allocationsLoading) {
    return <LoadingSpinner message="Loading allocations..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Allocations Overview</h1>
      </div>

      {allocations.length === 0 ? (
        <Card>
          <p className="empty-message">No allocations found</p>
        </Card>
      ) : (
        <Card title={`Total Allocations: ${allocations.length}`}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Project</th>
                  <th>Weekly Hours</th>
                  <th>Weekly Tasks</th>
                  <th>Effective Week</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map(allocation => (
                  <tr key={allocation.allocation_id}>
                    <td>{getEmployeeName(allocation.employee_id)}</td>
                    <td>{getProjectName(allocation.project_id)}</td>
                    <td>{allocation.weekly_hours_allocated}h</td>
                    <td>{allocation.weekly_tasks_allocated}</td>
                    <td>{allocation.effective_week}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
