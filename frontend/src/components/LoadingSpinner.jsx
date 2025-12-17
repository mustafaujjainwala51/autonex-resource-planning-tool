import React from 'react';

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};
