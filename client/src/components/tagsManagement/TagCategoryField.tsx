import React from 'react';

interface TagCategoryOption {
  value: string;
  label: string;
}

interface TagCategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  loading: boolean;
  options?: TagCategoryOption[];
}

/**
 * Tag Category Field Component
 * Displays category select field with options from database
 */
const TagCategoryField: React.FC<TagCategoryFieldProps> = ({ value, onChange, disabled, loading, options = [] }) => {
  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="category" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        Category
      </label>
      <select
        id="category"
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
        <option value="">Select category (optional)</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {loading && (
        <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Loading categories...</p>
      )}
    </div>
  );
};

export default TagCategoryField;

