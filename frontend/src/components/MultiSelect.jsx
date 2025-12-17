import React from 'react';

/**
 * Reusable MultiSelect Component for skills selection
 */
export const MultiSelect = ({ 
  label, 
  name, 
  values = [], 
  onChange, 
  options = [], 
  error, 
  required = false,
  disabled = false
}) => {
  const handleCheckboxChange = (value) => {
    const newValues = values.includes(value)
      ? values.filter(v => v !== value)
      : [...values, value];
    
    onChange({
      target: {
        name,
        value: newValues
      }
    });
  };

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="multiselect-container">
        {options.map((option, index) => (
          <div key={index} className="checkbox-item">
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              checked={values.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              disabled={disabled}
            />
            <label htmlFor={`${name}-${option.value}`} className="checkbox-label">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
