import React from 'react';
import { FaFlag } from 'react-icons/fa';

interface Tag {
  id: string;
  name: string;
  description: string;
}

interface TaskTagsFieldProps {
  value: string[];
  onChange: (selectedOptions: string[]) => void;
  disabled: boolean;
  loading: boolean;
  tags?: Tag[];
}

/**
 * Task Tags Field Component
 * Displays tags multiple select field with options from database
 */
const TaskTagsField: React.FC<TaskTagsFieldProps> = ({ value, onChange, disabled, loading, tags = [] }) => {
  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    onChange(selectedOptions);
  };

  return (
    <div>
      <label htmlFor="tagIds" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        <FaFlag className="inline h-4 w-4 mr-2" style={{ color: 'var(--accent-from)' }} />
        Tags (Optional)
      </label>
      <div className="relative">
        <select
          id="tagIds"
          name="tagIds"
          multiple
          value={value || []}
          onChange={handleChange}
          disabled={disabled || loading}
          className="block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-from)';
            e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          size={4}
        >
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name} - {tag.description}
            </option>
          ))}
          {!loading && tags.length === 0 && (
            <option value="" disabled>No tags available</option>
          )}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaFlag className={`h-4 w-4 ${loading ? 'text-gray-300' : 'text-gray-400'}`} />
        </div>
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent" style={{ borderColor: 'var(--accent-from)' }}></div>
          </div>
        )}
      </div>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
        Select one or more tags for this task (hold Ctrl/Cmd to select multiple)
      </p>
    </div>
  );
};

export default TaskTagsField;

