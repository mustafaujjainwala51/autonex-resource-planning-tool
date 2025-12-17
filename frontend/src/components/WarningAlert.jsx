import React from 'react';

/**
 * Warning Alert Component
 * Displays system warnings for allocations
 */
export const WarningAlert = ({ warnings = [] }) => {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  const getSeverityClass = (severity) => {
    switch(severity) {
      case 'high':
        return 'alert-danger';
      case 'medium':
        return 'alert-warning';
      case 'low':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  };

  return (
    <div className="warnings-container">
      {warnings.map((warning, index) => (
        <div key={index} className={`alert ${getSeverityClass(warning.severity)}`}>
          <span className="alert-icon">⚠</span>
          <div className="alert-content">
            <strong>{warning.type.replace(/_/g, ' ').toUpperCase()}</strong>
            <p>{warning.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
