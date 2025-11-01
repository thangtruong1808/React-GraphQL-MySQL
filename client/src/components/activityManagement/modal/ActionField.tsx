import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { ACTIVITY_FORM_VALIDATION } from '../../../constants/activityManagement';

interface ActionFieldProps {
  value: string;
  error?: string;
  loading: boolean;
  onChange: (value: string) => void;
}

/**
 * Action Field Component
 * Textarea input for activity action description
 */
const ActionField: React.FC<ActionFieldProps> = ({
  value,
  error,
  loading,
  onChange
}) => {
  return (
    <div>
      <label htmlFor="action" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
        Action *
      </label>
      <div className="relative">
        <textarea
          id="action"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe the activity action..."
          className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none sm:text-sm transition-colors resize-none`}
          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: `1px solid ${error ? 'var(--error-border)' : 'var(--border-color)'}` }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'var(--error-border)' : 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
          disabled={loading}
        />
        <div className="mt-2 flex justify-between text-sm">
          <span style={{ color: error ? 'var(--error-color)' : 'var(--text-secondary)' }}>
            {error ? (
              <div className="flex items-center">
                <FaExclamationTriangle className="h-4 w-4 mr-1" />
                {error}
              </div>
            ) : (
              'Provide a clear description of the activity'
            )}
          </span>
          <span style={{ color: value.length > ACTIVITY_FORM_VALIDATION.action.maxLength ? 'var(--error-color)' : 'var(--text-secondary)' }}>
            {value.length}/{ACTIVITY_FORM_VALIDATION.action.maxLength}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActionField;

