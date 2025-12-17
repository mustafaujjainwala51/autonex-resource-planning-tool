import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useEmployees } from '../hooks/useEmployees';
import { useAllocations } from '../hooks/useAllocations';
import { useLeaves } from '../hooks/useLeaves';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatDate } from '../utils/calculations';

/**
 * Dashboard Page
 * Overview of projects, employees, and allocations
 */
export const Dashboard = () => {
  const navigate = useNavigate();
  const { projects, loading: projectsLoading } = useProjects();
  const { employees, loading: employeesLoading } = useEmployees();
  const { allocations, loading: allocationsLoading } = useAllocations();
  const { leaves, loading: leavesLoading } = useLeaves();

  // Calculate active leaves
  const activeLeaves = useMemo(() => {
    const today = new Date();
    return leaves.filter(leave => {
      const leaveStart = new Date(leave.start_date);
      const leaveEnd = new Date(leave.end_date);
      return leaveStart <= today && leaveEnd >= today;
    });
  }, [leaves]);

  // Calculate upcoming leaves (next 7 days)
  const upcomingLeaves = useMemo(() => {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    return leaves.filter(leave => {
      const leaveStart = new Date(leave.start_date);
      return leaveStart >= today && leaveStart <= sevenDaysFromNow;
    });
  }, [leaves]);

  // Get employee name
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.employee_id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  if (projectsLoading || employeesLoading || allocationsLoading || leavesLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const activeProjects = projects.filter(p => p.project_status === 'active').length;
  const totalEmployees = employees.length;
  const totalAllocations = allocations.length;

  const stats = [
    { label: 'Total Projects', value: projects.length, color: 'blue' },
    { label: 'Active Projects', value: activeProjects, color: 'green' },
    { label: 'Total Employees', value: totalEmployees, color: 'purple' },
    { label: 'Active Allocations', value: totalAllocations, color: 'orange' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Button onClick={() => navigate('/projects/create')}>
          Create New Project
        </Button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Leave Warnings Section */}
      {(activeLeaves.length > 0 || upcomingLeaves.length > 0) && (
        <div className="leave-warning-section">
          <h3>
            <span>⚠️</span>
            Leave Alerts
          </h3>
          <div className="leave-warning-list">
            {activeLeaves.length > 0 && (
              <div className="leave-warning-item">
                <span className="icon">🚫</span>
                <div>
                  <strong>{activeLeaves.length} employee(s) currently on leave:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    {activeLeaves.map(leave => (
                      <span key={leave.leave_id} style={{ display: 'inline-block', marginRight: '1rem' }}>
                        {getEmployeeName(leave.employee_id)} (until {formatDate(leave.end_date)})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {upcomingLeaves.length > 0 && (
              <div className="leave-warning-item">
                <span className="icon">📅</span>
                <div>
                  <strong>{upcomingLeaves.length} upcoming leave(s) in next 7 days:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    {upcomingLeaves.map(leave => (
                      <span key={leave.leave_id} style={{ display: 'inline-block', marginRight: '1rem' }}>
                        {getEmployeeName(leave.employee_id)} (from {formatDate(leave.start_date)})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button 
            size="small" 
            variant="secondary" 
            onClick={() => navigate('/leaves')}
            style={{ marginTop: '1rem' }}
          >
            Manage Leaves
          </Button>
        </div>
      )}

      <div className="dashboard-grid">
        <Card title="Recent Projects">
          {projects.length === 0 ? (
            <p className="empty-message">No projects yet</p>
          ) : (
            <div className="project-list">
              {projects.slice(0, 5).map(project => (
                <div key={project.project_id} className="list-item">
                  <div className="item-content">
                    <h4>{project.name}</h4>
                    <p className="item-meta">{project.client} • {project.type}</p>
                  </div>
                  <Button 
                    size="small" 
                    variant="secondary"
                    onClick={() => navigate(`/projects/${project.project_id}/allocate`)}
                  >
                    Allocate
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Quick Actions">
          <div className="action-list">
            <Button 
              fullWidth 
              variant="primary"
              onClick={() => navigate('/projects/create')}
            >
              Create New Project
            </Button>
            <Button 
              fullWidth 
              variant="secondary"
              onClick={() => navigate('/projects')}
            >
              View All Projects
            </Button>
            <Button 
              fullWidth 
              variant="secondary"
              onClick={() => navigate('/allocations')}
            >
              Manage Allocations
            </Button>
            <Button 
              fullWidth 
              variant="secondary"
              onClick={() => navigate('/leaves')}
            >
              Manage Leaves
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
