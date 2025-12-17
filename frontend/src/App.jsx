import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { ProjectCreate } from './pages/ProjectCreate';
import { ProjectList } from './pages/ProjectList';
import { ProjectAllocation } from './pages/ProjectAllocation';
import { AllocationsList } from './pages/AllocationsList';
import { LeaveManagement } from './pages/LeaveManagement';
import './styles/main.css';

/**
 * Main App Component
 * Handles routing and layout
 */
function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/create" element={<ProjectCreate />} />
            <Route path="/projects/:projectId/allocate" element={<ProjectAllocation />} />
            <Route path="/allocations" element={<AllocationsList />} />
            <Route path="/leaves" element={<LeaveManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
