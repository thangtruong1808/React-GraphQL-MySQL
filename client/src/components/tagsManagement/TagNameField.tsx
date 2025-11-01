import React from 'react';
import { TAGS_FORM_VALIDATION } from '../../constants/tagsManagement';

interface TagNameFieldProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

/**
 * Tag Name Field Component
 * Displays name input field with validation feedback
 */
const TagNameField: React.FC<TagNameFieldProps> = ({ value, error, onChange, disabled }) => {
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handle focus event
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!error) {
      e.currentTarget.style.borderColor = 'var(--accent-from)';
      e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
    }
  };

  // Handle blur event
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--border-color)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div>
      <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        Tag Name *
      </label>
      <input
        type="text"
        id="name"
        value={value}
        onChange={handleChange}
        placeholder="Enter a descriptive tag name"
        maxLength={TAGS_FORM_VALIDATION.name.maxLength}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${error ? 'border-red-500' : ''}`}
        style={{
          backgroundColor: 'var(--input-bg)',
          color: 'var(--text-primary)',
          borderColor: error ? '#ef4444' : 'var(--border-color)',
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
      />
      {error && (
        <p className="mt-2 text-sm flex items-center" style={{ color: '#ef4444' }}>
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      <p className="mt-2 text-xs flex items-center" style={{ color: 'var(--text-muted)' }}>
        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'var(--accent-from)' }}></span>
        {value.length}/{TAGS_FORM_VALIDATION.name.maxLength} characters
      </p>
    </div>
  );
};

export default TagNameField;

