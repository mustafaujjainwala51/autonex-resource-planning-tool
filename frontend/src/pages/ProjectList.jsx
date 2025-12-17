import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatDate } from '../utils/calculations';

/**
 * Project List Page
 * Displays all projects with filtering options
 */
export const ProjectList = () => {
  const navigate = useNavigate();
  const { projects, loading } = useProjects();
  const [filterType, setFilterType] = useState('all');

  const filteredProjects = filterType === 'all' 
    ? projects 
    : projects.filter(p => p.type === filterType);

  if (loading) {
    return <LoadingSpinner message="Loading projects..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Projects</h1>
        <Button onClick={() => navigate('/projects/create')}>
          Create New Project
        </Button>
      </div>

      <Card title="Filter Projects">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Projects
          </button>
          <button
            className={`filter-btn ${filterType === 'PoC' ? 'active' : ''}`}
            onClick={() => setFilterType('PoC')}
          >
            PoC
          </button>
          <button
            className={`filter-btn ${filterType === 'Full' ? 'active' : ''}`}
            onClick={() => setFilterType('Full')}
          >
            Full Project
          </button>
          <button
            className={`filter-btn ${filterType === 'Side' ? 'active' : ''}`}
            onClick={() => setFilterType('Side')}
          >
            Side Project
          </button>
        </div>
      </Card>

      {filteredProjects.length === 0 ? (
        <Card>
          <p className="empty-message">No projects found</p>
        </Card>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <Card key={project.project_id} className="project-card">
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <span className={`badge badge-${project.type.toLowerCase()}`}>
                  {project.type}
                </span>
              </div>

              <div className="project-card-body">
                <div className="project-detail">
                  <label>Client:</label>
                  <span>{project.client}</span>
                </div>
                <div className="project-detail">
                  <label>Total Tasks:</label>
                  <span>{project.total_tasks}</span>
                </div>
                <div className="project-detail">
                  <label>Weekly Target:</label>
                  <span>{project.weekly_target}</span>
                </div>
                <div className="project-detail">
                  <label>Timeline:</label>
                  <span>{formatDate(project.start_date)} to {formatDate(project.end_date)}</span>
                </div>
                <div className="project-detail">
                  <label>SLA Deadline:</label>
                  <span>{formatDate(project.sla_deadline)}</span>
                </div>
                <div className="project-detail">
                  <label>Required Skills:</label>
                  <span>{project.required_expertise.join(', ')}</span>
                </div>
              </div>

              <div className="project-card-actions">
                <Button 
                  size="small" 
                  variant="primary"
                  onClick={() => navigate(`/projects/${project.project_id}/allocate`)}
                >
                  Manage Allocations
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
