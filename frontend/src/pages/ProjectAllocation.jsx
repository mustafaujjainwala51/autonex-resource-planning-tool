import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useEmployees } from '../hooks/useEmployees';
import { useAllocations } from '../hooks/useAllocations';
import { useLeaves } from '../hooks/useLeaves';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { WarningAlert } from '../components/WarningAlert';
import { 
  calculateAvailableHours, 
  calculateTotalAllocatedHours,
  generateAllocationWarnings,
  checkProjectUnderAllocation,
  hasRequiredSkills
} from '../utils/calculations';

/**
 * Project Allocation Page (Section 4.3 - PRD)
 * Allows PM to allocate manpower to projects
 */
export const ProjectAllocation = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const { projects, loading: projectsLoading } = useProjects();
  const { employees, loading: employeesLoading } = useEmployees();
  const { allocations, createAllocation, getAllocationsByProject, loading: allocationsLoading } = useAllocations();
  const { leaves, getLeavesByEmployee } = useLeaves();

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [allocationData, setAllocationData] = useState({});
  const [warnings, setWarnings] = useState({});
  const [projectWarnings, setProjectWarnings] = useState([]);
  const [showSkillFilter, setShowSkillFilter] = useState(false);

  // Get current project
  const project = useMemo(() => {
    return projects.find(p => p.project_id === parseInt(projectId));
  }, [projects, projectId]);

  // Filter employees based on skills if filter is enabled
  const filteredEmployees = useMemo(() => {
    if (!showSkillFilter || !project) {
      return employees;
    }
    return employees.filter(emp => 
      hasRequiredSkills(emp.skills, project.required_expertise)
    );
  }, [employees, project, showSkillFilter]);

  // Get existing allocations for this project
  const existingAllocations = useMemo(() => {
    return getAllocationsByProject(parseInt(projectId));
  }, [allocations, projectId, getAllocationsByProject]);

  // Check project under-allocation
  useEffect(() => {
    if (project && allocations) {
      const underAllocationCheck = checkProjectUnderAllocation(project, existingAllocations);
      
      if (underAllocationCheck.isUnderAllocated) {
        setProjectWarnings([{
          type: 'under_allocation',
          message: `Project needs ${underAllocationCheck.required.toFixed(2)}h/week but only ${underAllocationCheck.allocated.toFixed(2)}h/week allocated. Shortage: ${underAllocationCheck.shortage.toFixed(2)}h/week`,
          severity: 'high'
        }]);
      } else {
        setProjectWarnings([]);
      }
    }
  }, [project, existingAllocations, allocations]);

  // Handle employee selection
  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        // Remove employee
        const newSelected = prev.filter(id => id !== employeeId);
        
        // Remove allocation data
        const newAllocationData = { ...allocationData };
        delete newAllocationData[employeeId];
        setAllocationData(newAllocationData);
        
        // Remove warnings
        const newWarnings = { ...warnings };
        delete newWarnings[employeeId];
        setWarnings(newWarnings);
        
        return newSelected;
      } else {
        // Add employee
        return [...prev, employeeId];
      }
    });
  };

  // Handle allocation data change
  const handleAllocationChange = (employeeId, field, value) => {
    setAllocationData(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: value
      }
    }));

    // Recalculate warnings for this employee
    const employee = employees.find(e => e.employee_id === employeeId);
    if (employee) {
      const allocation = {
        ...allocationData[employeeId],
        [field]: value,
        employee_id: employeeId,
        project_id: parseInt(projectId)
      };

      const employeeLeaves = getLeavesByEmployee(employeeId);
      const allocationWarnings = generateAllocationWarnings(
        employee,
        allocation,
        project,
        existingAllocations,
        employeeLeaves
      );

      setWarnings(prev => ({
        ...prev,
        [employeeId]: allocationWarnings
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const allocationsToCreate = selectedEmployees.map(employeeId => ({
        employee_id: employeeId,
        project_id: parseInt(projectId),
        weekly_hours_allocated: parseFloat(allocationData[employeeId]?.weekly_hours || 0),
        weekly_tasks_allocated: parseInt(allocationData[employeeId]?.weekly_tasks || 0),
        effective_week: new Date().toISOString().split('T')[0] // Current week
      }));

      await Promise.all(allocationsToCreate.map(allocation => createAllocation(allocation)));
      
      navigate('/projects');
    } catch (error) {
      console.error('Error creating allocations:', error);
      alert('Failed to create allocations. Please try again.');
    }
  };

  // Calculate employee metrics
  const getEmployeeMetrics = (employee) => {
    const availableHours = calculateAvailableHours(employee.work_type);
    const allocatedHours = calculateTotalAllocatedHours(existingAllocations, employee.employee_id);
    const remainingHours = availableHours - allocatedHours;
    const utilizationPercent = (allocatedHours / availableHours) * 100;

    return {
      availableHours,
      allocatedHours,
      remainingHours,
      utilizationPercent
    };
  };

  if (projectsLoading || employeesLoading || allocationsLoading) {
    return <LoadingSpinner message="Loading allocation data..." />;
  }

  if (!project) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">
          <p>Project not found</p>
        </div>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manpower Allocation</h1>
        <p>Section 4.3 - Allocation Engine</p>
      </div>

      {/* Project Information */}
      <Card title={`Project: ${project.name}`}>
        <div className="project-info-grid">
          <div className="info-item">
            <label>Client:</label>
            <span>{project.client}</span>
          </div>
          <div className="info-item">
            <label>Type:</label>
            <span>{project.type}</span>
          </div>
          <div className="info-item">
            <label>Total Tasks:</label>
            <span>{project.total_tasks}</span>
          </div>
          <div className="info-item">
            <label>Required Skills:</label>
            <span>{project.required_expertise.join(', ')}</span>
          </div>
        </div>
      </Card>

      {/* Project-level warnings */}
      {projectWarnings.length > 0 && (
        <WarningAlert warnings={projectWarnings} />
      )}

      {/* Employee Selection */}
      <Card 
        title="Select Employees" 
        actions={
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={showSkillFilter}
              onChange={(e) => setShowSkillFilter(e.target.checked)}
            />
            <span>Show only matching skills</span>
          </label>
        }
      >
        <div className="employee-list">
          {filteredEmployees.length === 0 ? (
            <p className="empty-message">No employees available</p>
          ) : (
            filteredEmployees.map(employee => {
              const metrics = getEmployeeMetrics(employee);
              const isSelected = selectedEmployees.includes(employee.employee_id);
              const matchesSkills = hasRequiredSkills(employee.skills, project.required_expertise);
              
              // Check if employee is on leave during project period
              const employeeLeaves = getLeavesByEmployee(employee.employee_id);
              const hasLeaveConflict = employeeLeaves.some(leave => {
                const leaveStart = new Date(leave.start_date);
                const leaveEnd = new Date(leave.end_date);
                const projectStart = new Date(project.start_date);
                const projectEnd = new Date(project.end_date);
                return leaveStart <= projectEnd && leaveEnd >= projectStart;
              });

              return (
                <div 
                  key={employee.employee_id} 
                  className={`employee-card ${isSelected ? 'selected' : ''} ${!matchesSkills ? 'skill-mismatch' : ''} ${hasLeaveConflict ? 'on-leave' : ''}`}
                >
                  <div className="employee-header">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleEmployeeSelect(employee.employee_id)}
                      id={`emp-${employee.employee_id}`}
                    />
                    <label htmlFor={`emp-${employee.employee_id}`} className="employee-name">
                      {employee.name}
                    </label>
                    <span className="employee-type">{employee.work_type}</span>
                  </div>

                  <div className="employee-details">
                    <div className="detail-row">
                      <span className="label">Skills:</span>
                      <span className="value">{employee.skills.join(', ')}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Available:</span>
                      <span className="value">{metrics.remainingHours}h / {metrics.availableHours}h ({metrics.utilizationPercent.toFixed(0)}% utilized)</span>
                    </div>
                    {hasLeaveConflict && (
                      <div className="detail-row leave-indicator">
                        <span className="label">⚠️ Leave Status:</span>
                        <span className="value" style={{ color: 'var(--danger-color)', fontWeight: 600 }}>
                          On leave during project period
                        </span>
                      </div>
                    )}
                  </div>

                  {isSelected && (
                    <div className="allocation-inputs">
                      <div className="input-group">
                        <label>Weekly Hours:</label>
                        <input
                          type="number"
                          min="0"
                          max={metrics.availableHours}
                          step="0.5"
                          value={allocationData[employee.employee_id]?.weekly_hours || ''}
                          onChange={(e) => handleAllocationChange(employee.employee_id, 'weekly_hours', e.target.value)}
                          placeholder="Hours"
                        />
                      </div>
                      <div className="input-group">
                        <label>Weekly Tasks:</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={allocationData[employee.employee_id]?.weekly_tasks || ''}
                          onChange={(e) => handleAllocationChange(employee.employee_id, 'weekly_tasks', e.target.value)}
                          placeholder="Tasks"
                        />
                      </div>
                    </div>
                  )}

                  {warnings[employee.employee_id] && warnings[employee.employee_id].length > 0 && (
                    <WarningAlert warnings={warnings[employee.employee_id]} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="form-actions">
        <Button variant="secondary" onClick={() => navigate('/projects')}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={selectedEmployees.length === 0}
        >
          Confirm Allocations ({selectedEmployees.length} employees)
        </Button>
      </div>
    </div>
  );
};
