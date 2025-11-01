import React from 'react';

interface TagTypeOption {
  value: string;
  label: string;
}

interface TagTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  loading: boolean;
  options?: TagTypeOption[];
}

/**
 * Tag Type Field Component
 * Displays type select field with options from database
 */
const TagTypeField: React.FC<TagTypeFieldProps> = ({ value, onChange, disabled, loading, options = [] }) => {
  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="type" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        Type
      </label>
      <select
        id="type"
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none"
        style={{
          backgroundColor: 'var(--input-bg)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
        }}
        disabled={disabled || loading}
      >
        <option value="">Select type (optional)</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {loading && (
        <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Loading types...</p>
      )}
    </div>
  );
};

export default TagTypeField;

