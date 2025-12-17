import { useState, useEffect, useCallback } from 'react';
import { projectsAPI } from '../api/projects';

/**
 * Custom hook for managing projects
 */
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create project
  const createProject = async (projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newProject = await projectsAPI.create(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message);
      console.error('Error creating project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update project
  const updateProject = async (projectId, projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProject = await projectsAPI.update(projectId, projectData);
      setProjects(prev => 
        prev.map(p => p.project_id === projectId ? updatedProject : p)
      );
      return updatedProject;
    } catch (err) {
      setError(err.message);
      console.error('Error updating project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    setLoading(true);
    setError(null);
    
    try {
      await projectsAPI.delete(projectId);
      setProjects(prev => prev.filter(p => p.project_id !== projectId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
};
