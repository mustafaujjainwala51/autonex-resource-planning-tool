import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation Component
 */
export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/projects/create', label: 'Create Project' },
    { path: '/projects', label: 'Projects' },
    { path: '/allocations', label: 'Allocations' },
    { path: '/leaves', label: 'Leave Management' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Autonex Resource Planning</h1>
      </div>
      <ul className="navbar-menu">
        {navItems.map((item) => (
          <li key={item.path} className="navbar-item">
            <Link 
              to={item.path} 
              className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
