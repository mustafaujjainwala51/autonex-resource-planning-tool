import React, { useState, useMemo } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useLeaves } from '../hooks/useLeaves';
import { useAllocations } from '../hooks/useAllocations';
import { useProjects } from '../hooks/useProjects';
import { leavesAPI } from '../api/leaves';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { WarningAlert } from '../components/WarningAlert';
import { formatDate } from '../utils/calculations';

/**
 * Leave Management Page (Section 6 - PRD)
 * Manual leave entry with impact analysis
 */
export const LeaveManagement = () => {
  const { employees, loading: employeesLoading } = useEmployees();
  const { leaves, fetchLeaves, loading: leavesLoading } = useLeaves();
  const { allocations } = useAllocations();
  const { projects } = useProjects();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    start_date: '',
    end_date: '',
    leave_type: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  // Leave type options
  const leaveTypeOptions = [
    { value: 'casual', label: 'Casual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'vacation', label: 'Vacation' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'emergency', label: 'Emergency Leave' }
  ];

  // Filter leaves by selected employee
  const filteredLeaves = useMemo(() => {
    if (selectedEmployee === 'all') return leaves;
    return leaves.filter(leave => leave.employee_id === parseInt(selectedEmployee));
  }, [leaves, selectedEmployee]);

  // Calculate leave impact for a specific leave
  const calculateLeaveImpact = (leave) => {
    const employee = employees.find(e => e.employee_id === leave.employee_id);
    if (!employee) return { warnings: [], affectedProjects: [] };

    const leaveStart = new Date(leave.start_date);
    const leaveEnd = new Date(leave.end_date);

    // Find allocations for this employee
    const employeeAllocations = allocations.filter(
      a => a.employee_id === leave.employee_id
    );

    const warnings = [];
    const affectedProjectIds = new Set();

    employeeAllocations.forEach(allocation => {
      const project = projects.find(p => p.project_id === allocation.project_id);
      if (!project) return;

      const projectStart = new Date(project.start_date);
      const projectEnd = new Date(project.end_date);

      // Check if leave overlaps with project timeline
      if (leaveStart <= projectEnd && leaveEnd >= projectStart) {
        affectedProjectIds.add(project.project_id);
        
        warnings.push({
          type: 'leave_conflict',
          message: `${employee.name} on leave during ${project.name} (${allocation.weekly_hours_allocated}h/week allocated)`,
          severity: 'high',
          projectId: project.project_id,
          projectName: project.name
        });
      }
    });

    // Check if multiple team members are on leave during same period
    const overlappingLeaves = leaves.filter(l => {
      if (l.leave_id === leave.leave_id) return false;
      const otherStart = new Date(l.start_date);
      const otherEnd = new Date(l.end_date);
      return leaveStart <= otherEnd && leaveEnd >= otherStart;
    });

    if (overlappingLeaves.length > 0) {
      warnings.push({
        type: 'multiple_leaves',
        message: `${overlappingLeaves.length} other employee(s) also on leave during this period`,
        severity: 'medium'
      });
    }

    return {
      warnings,
      affectedProjects: Array.from(affectedProjectIds).map(id => 
        projects.find(p => p.project_id === id)
      ).filter(Boolean)
    };
  };

  // Get employee name
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.employee_id === employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) {
      newErrors.employee_id = 'Employee is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    if (!formData.leave_type) {
      newErrors.leave_type = 'Leave type is required';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const leaveData = {
        ...formData,
        employee_id: parseInt(formData.employee_id)
      };

      if (editingLeave) {
        await leavesAPI.update(editingLeave.leave_id, leaveData);
      } else {
        await leavesAPI.create(leaveData);
      }

      // Refresh leaves
      await fetchLeaves();

      // Reset form
      setFormData({
        employee_id: '',
        start_date: '',
        end_date: '',
        leave_type: ''
      });
      setShowAddForm(false);
      setEditingLeave(null);
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (leave) => {
    setEditingLeave(leave);
    setFormData({
      employee_id: leave.employee_id.toString(),
      start_date: leave.start_date,
      end_date: leave.end_date,
      leave_type: leave.leave_type
    });
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (leaveId) => {
    if (!window.confirm('Are you sure you want to delete this leave?')) {
      return;
    }

    try {
      await leavesAPI.delete(leaveId);
      await fetchLeaves();
    } catch (error) {
      alert('Failed to delete leave: ' + error.message);
    }
  };

  // Cancel form
  const handleCancel = () => {
    setFormData({
      employee_id: '',
      start_date: '',
      end_date: '',
      leave_type: ''
    });
    setShowAddForm(false);
    setEditingLeave(null);
    setErrors({});
  };

  // Get upcoming leaves (next 30 days)
  const upcomingLeaves = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return leaves.filter(leave => {
      const leaveStart = new Date(leave.start_date);
      return leaveStart >= today && leaveStart <= thirtyDaysFromNow;
    });
  }, [leaves]);

  // Get active leaves (currently ongoing)
  const activeLeaves = useMemo(() => {
    const today = new Date();
    return leaves.filter(leave => {
      const leaveStart = new Date(leave.start_date);
      const leaveEnd = new Date(leave.end_date);
      return leaveStart <= today && leaveEnd >= today;
    });
  }, [leaves]);

  if (employeesLoading || leavesLoading) {
    return <LoadingSpinner message="Loading leave management..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Leave Management</h1>
          <p>Section 6 - Manual leave tracking with impact analysis</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          Add Leave
        </Button>
      </div>

      {/* Leave Statistics */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Card className="stat-card stat-blue">
          <div className="stat-content">
            <h3 className="stat-value">{leaves.length}</h3>
            <p className="stat-label">Total Leaves</p>
          </div>
        </Card>
        <Card className="stat-card stat-orange">
          <div className="stat-content">
            <h3 className="stat-value">{activeLeaves.length}</h3>
            <p className="stat-label">Currently On Leave</p>
          </div>
        </Card>
        <Card className="stat-card stat-purple">
          <div className="stat-content">
            <h3 className="stat-value">{upcomingLeaves.length}</h3>
            <p className="stat-label">Upcoming (30 days)</p>
          </div>
        </Card>
      </div>

      {/* Add/Edit Leave Form */}
      {showAddForm && (
        <Card title={editingLeave ? 'Edit Leave' : 'Add New Leave'}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <Select
                label="Employee"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                options={employees.map(emp => ({
                  value: emp.employee_id.toString(),
                  label: emp.name
                }))}
                error={errors.employee_id}
                required
              />

              <Select
                label="Leave Type"
                name="leave_type"
                value={formData.leave_type}
                onChange={handleChange}
                options={leaveTypeOptions}
                error={errors.leave_type}
                required
              />

              <Input
                label="Start Date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                error={errors.start_date}
                required
              />

              <Input
                label="End Date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                error={errors.end_date}
                required
              />
            </div>

            {/* Show impact preview if dates are selected */}
            {formData.employee_id && formData.start_date && formData.end_date && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--gray-700)' }}>
                  Leave Impact Preview:
                </h4>
                <LeaveImpactPreview
                  employeeId={parseInt(formData.employee_id)}
                  startDate={formData.start_date}
                  endDate={formData.end_date}
                  employees={employees}
                  allocations={allocations}
                  projects={projects}
                />
              </div>
            )}

            {errors.submit && (
              <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
                <p>{errors.submit}</p>
              </div>
            )}

            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                {editingLeave ? 'Update Leave' : 'Add Leave'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter */}
      <Card title="Filter Leaves">
        <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
          <Select
            label="Filter by Employee"
            name="filter_employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            options={[
              { value: 'all', label: 'All Employees' },
              ...employees.map(emp => ({
                value: emp.employee_id.toString(),
                label: emp.name
              }))
            ]}
          />
        </div>
      </Card>

      {/* Leaves List */}
      <Card title={`Leave Records (${filteredLeaves.length})`}>
        {filteredLeaves.length === 0 ? (
          <p className="empty-message">No leaves recorded</p>
        ) : (
          <div className="leaves-list">
            {filteredLeaves.map(leave => {
              const impact = calculateLeaveImpact(leave);
              const isActive = activeLeaves.some(l => l.leave_id === leave.leave_id);
              const isUpcoming = upcomingLeaves.some(l => l.leave_id === leave.leave_id);

              return (
                <div key={leave.leave_id} className={`leave-card ${isActive ? 'active-leave' : ''}`}>
                  <div className="leave-header">
                    <div className="leave-info">
                      <h4>{getEmployeeName(leave.employee_id)}</h4>
                      <div className="leave-meta">
                        <span className={`leave-badge leave-${leave.leave_type}`}>
                          {leave.leave_type}
                        </span>
                        {isActive && <span className="status-badge active">Active Now</span>}
                        {isUpcoming && !isActive && <span className="status-badge upcoming">Upcoming</span>}
                      </div>
                    </div>
                    <div className="leave-actions">
                      <Button size="small" variant="secondary" onClick={() => handleEdit(leave)}>
                        Edit
                      </Button>
                      <Button size="small" variant="danger" onClick={() => handleDelete(leave.leave_id)}>
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="leave-dates">
                    <div className="date-item">
                      <span className="date-label">From:</span>
                      <span className="date-value">{formatDate(leave.start_date)}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">To:</span>
                      <span className="date-value">{formatDate(leave.end_date)}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Duration:</span>
                      <span className="date-value">
                        {Math.ceil((new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24)) + 1} days
                      </span>
                    </div>
                  </div>

                  {/* Impact Warnings */}
                  {impact.warnings.length > 0 && (
                    <div className="leave-impact">
                      <h5>⚠️ Leave Impact:</h5>
                      <WarningAlert warnings={impact.warnings} />
                      
                      {impact.affectedProjects.length > 0 && (
                        <div className="affected-projects">
                          <strong>Affected Projects:</strong>
                          <ul>
                            {impact.affectedProjects.map(project => (
                              <li key={project.project_id}>
                                {project.name} ({project.client})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

/**
 * Leave Impact Preview Component
 * Shows impact analysis before submitting leave
 */
const LeaveImpactPreview = ({ employeeId, startDate, endDate, employees, allocations, projects }) => {
  const employee = employees.find(e => e.employee_id === employeeId);
  if (!employee) return null;

  const leaveStart = new Date(startDate);
  const leaveEnd = new Date(endDate);

  const employeeAllocations = allocations.filter(a => a.employee_id === employeeId);
  const affectedProjects = [];
  const warnings = [];

  employeeAllocations.forEach(allocation => {
    const project = projects.find(p => p.project_id === allocation.project_id);
    if (!project) return;

    const projectStart = new Date(project.start_date);
    const projectEnd = new Date(project.end_date);

    if (leaveStart <= projectEnd && leaveEnd >= projectStart) {
      affectedProjects.push(project);
      warnings.push({
        type: 'leave_conflict',
        message: `Will impact ${project.name} - ${allocation.weekly_hours_allocated}h/week currently allocated`,
        severity: 'high'
      });
    }
  });

  if (warnings.length === 0) {
    return (
      <div className="alert alert-info">
        <p>✓ No project conflicts detected for this leave period</p>
      </div>
    );
  }

  return (
    <div>
      <WarningAlert warnings={warnings} />
      <div className="affected-projects" style={{ marginTop: '0.5rem' }}>
        <strong>Projects requiring attention:</strong>
        <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
          {affectedProjects.map(project => (
            <li key={project.project_id}>
              {project.name} ({formatDate(project.start_date)} - {formatDate(project.end_date)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
