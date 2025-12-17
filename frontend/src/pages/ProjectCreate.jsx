import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { MultiSelect } from '../components/MultiSelect';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PROJECT_TYPES, SKILLS } from '../constants';
import { validateProjectForm, calculateRequiredHours, calculateWeeklyRequiredHours, calculateProjectDuration } from '../utils/calculations';

/**
 * Project Creation Page (Section 4.2 - PRD)
 * Allows PM to create a new project with all required details
 */
export const ProjectCreate = () => {
  const navigate = useNavigate();
  const { createProject, loading } = useProjects();

  const [formData, setFormData] = useState({
    name: '',
    client: '',
    type: '',
    total_tasks: '',
    sla_deadline: '',
    required_expertise: [],
    estimated_time_per_task: '',
    weekly_target: '',
    start_date: '',
    end_date: ''
  });

  const [errors, setErrors] = useState({});
  const [calculations, setCalculations] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // ✅ ADDED THIS LINE
  const [submitting, setSubmitting] = useState(false); // ✅ ADDED THIS LINE

  // Project type options
  const projectTypeOptions = Object.entries(PROJECT_TYPES).map(([key, value]) => ({
    value,
    label: value
  }));

  // Skills options
  const skillOptions = Object.entries(SKILLS).map(([key, value]) => ({
    value,
    label: value.replace(/_/g, ' ').toUpperCase()
  }));

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Recalculate if relevant fields change
    if (['total_tasks', 'estimated_time_per_task', 'start_date', 'end_date'].includes(name)) {
      calculateProjectRequirements({
        ...formData,
        [name]: value
      });
    }
  };

  // Calculate project requirements
  const calculateProjectRequirements = (data) => {
    if (data.total_tasks && data.estimated_time_per_task && data.start_date && data.end_date) {
      const totalTasks = parseFloat(data.total_tasks);
      const timePerTask = parseFloat(data.estimated_time_per_task);
      
      const requiredHours = calculateRequiredHours(totalTasks, timePerTask);
      const weeklyRequired = calculateWeeklyRequiredHours(requiredHours, data.start_date, data.end_date);
      const duration = calculateProjectDuration(data.start_date, data.end_date);

      setCalculations({
        requiredHours: requiredHours.toFixed(2),
        weeklyRequiredHours: weeklyRequired.toFixed(2),
        projectDurationWeeks: duration
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateProjectForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true); // ✅ Set submitting state

    try {
      // ✅ Transform data to match backend field names
      const projectData = {
        name: formData.name,
        client: formData.client,
        type: formData.type, 
        total_tasks: parseInt(formData.total_tasks),
        sla_deadline: formData.sla_deadline,
        required_expertise: formData.required_expertise,
        estimated_time_per_task: parseFloat(formData.estimated_time_per_task),
        start_date: formData.start_date,
        end_date: formData.end_date,
        weekly_target: formData.weekly_target ? parseInt(formData.weekly_target) : 0
      };

      const newProject = await createProject(projectData);
      
      // ✅ Show success message
      setSuccessMessage(
        `Project "${newProject.name}" for ${formData.client} has been created successfully! Project ID: ${newProject.id}`
      );
      
      // Clear any errors
      setErrors({});
      
      // Reset form after short delay
      setTimeout(() => {
        setFormData({
          name: '',
          client: '',
          type: '',
          total_tasks: '',
          sla_deadline: '',
          required_expertise: [],
          estimated_time_per_task: '',
          weekly_target: '',
          start_date: '',
          end_date: ''
        });
        setCalculations(null); // ✅ Also reset calculations
      }, 500);
      
      // Navigate to projects list after 3 seconds
      setTimeout(() => {
        navigate('/projects');
      }, 3000);
      
    } catch (error) {
      setErrors({ submit: error.message });
      setSuccessMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/projects');
  };

  if (loading) {
    return <LoadingSpinner message="Creating project..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Project</h1>
        <p>Section 4.2 - Project Setup</p>
      </div>

      {/* ✅ SUCCESS MESSAGE DISPLAY */}
      {successMessage && (
        <div style={{
          position: 'relative',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          backgroundColor: '#dcfce7',
          border: '2px solid #22c55e',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(34, 197, 94, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>✅</span>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#166534',
                fontSize: '1.125rem',
                fontWeight: '700'
              }}>
                Success!
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#166534',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
                {successMessage}
              </p>
              <p style={{ 
                margin: '0.5rem 0 0 0', 
                color: '#15803d',
                fontSize: '0.75rem',
                fontStyle: 'italic'
              }}>
                Redirecting to projects list...
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage('')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#166534',
                cursor: 'pointer',
                padding: '0',
                lineHeight: '1'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card title="Project Details">
          <div className="form-grid">
            <Input
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="e.g., Trajectory Annotation PoC"
            />

            <Input
              label="Client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              error={errors.client}
              required
              placeholder="e.g., Tesla"
            />

            <Select
              label="Project Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={projectTypeOptions}
              error={errors.type}
              required
            />

            <Input
              label="Total Tasks"
              name="total_tasks"
              type="number"
              value={formData.total_tasks}
              onChange={handleChange}
              error={errors.total_tasks}
              required
              min="1"
              placeholder="e.g., 5000"
            />
          </div>
        </Card>

        <Card title="Project Timeline">
          <div className="form-grid">
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

            <Input
              label="SLA Deadline"
              name="sla_deadline"
              type="date"
              value={formData.sla_deadline}
              onChange={handleChange}
              error={errors.sla_deadline}
              required
            />
          </div>
        </Card>

        <Card title="Task Configuration">
          <div className="form-grid">
            <Input
              label="Estimated Time Per Task (hours)"
              name="estimated_time_per_task"
              type="number"
              value={formData.estimated_time_per_task}
              onChange={handleChange}
              error={errors.estimated_time_per_task}
              required
              step="0.1"
              min="0.1"
              placeholder="e.g., 1.5"
            />

            <Input
              label="Weekly Target Output"
              name="weekly_target"
              type="number"
              value={formData.weekly_target}
              onChange={handleChange}
              error={errors.weekly_target}
              required
              min="1"
              placeholder="e.g., 700"
            />
          </div>

          <MultiSelect
            label="Required Expertise"
            name="required_expertise"
            values={formData.required_expertise}
            onChange={handleChange}
            options={skillOptions}
            error={errors.required_expertise}
            required
          />
        </Card>

        {calculations && (
          <Card title="System Calculations" className="calculations-card">
            <div className="calculations-grid">
              <div className="calculation-item">
                <label>Total Required Hours:</label>
                <span className="calculation-value">{calculations.requiredHours} hours</span>
              </div>
              <div className="calculation-item">
                <label>Project Duration:</label>
                <span className="calculation-value">{calculations.projectDurationWeeks} weeks</span>
              </div>
              <div className="calculation-item">
                <label>Weekly Required Hours:</label>
                <span className="calculation-value">{calculations.weeklyRequiredHours} hours/week</span>
              </div>
            </div>
          </Card>
        )}

        {errors.submit && (
          <div className="alert alert-danger">
            <p>{errors.submit}</p>
          </div>
        )}

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Create Project & Allocate Manpower
          </Button>
        </div>
      </form>
    </div>
  );
};