import React from 'react';
import { TAGS_FORM_VALIDATION } from '../../constants/tagsManagement';

interface TagTitleFieldProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

/**
 * Tag Title Field Component
 * Displays title input field with validation feedback
 */
const TagTitleField: React.FC<TagTitleFieldProps> = ({ value, error, onChange, disabled }) => {
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handle focus event
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent-from)';
    e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
  };

  // Handle blur event
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--border-color)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div>
      <label htmlFor="title" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        Title
      </label>
      <input
        type="text"
        id="title"
        value={value}
        onChange={handleChange}
        placeholder="Enter tag title (optional)"
        maxLength={TAGS_FORM_VALIDATION.title.maxLength}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none`}
        style={{
          backgroundColor: 'var(--input-bg)',
          color: 'var(--text-primary)',
          border: `1px solid ${error ? '#ef4444' : 'var(--border-color)'}`,
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{error}</p>
      )}
      <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
        {value.length}/{TAGS_FORM_VALIDATION.title.maxLength} characters
      </p>
    </div>
  );
};

export default TagTitleField;

