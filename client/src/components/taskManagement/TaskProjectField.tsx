import React from 'react';
import { FaFolder, FaExclamationTriangle } from 'react-icons/fa';

interface Project {
  id: string;
  name: string;
}

interface TaskProjectFieldProps {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  loading: boolean;
  projects?: Project[];
}

/**
 * Task Project Field Component
 * Displays project select field with options from database
 */
const TaskProjectField: React.FC<TaskProjectFieldProps> = ({ value, error, onChange, disabled, loading, projects = [] }) => {
  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
  };

  return (
    <div>
      <label htmlFor="projectId" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        <FaFolder className="inline h-4 w-4 mr-2" style={{ color: 'var(--accent-from)' }} />
        Project *
      </label>
      <div className="relative">
        <select
          id="projectId"
          name="projectId"
          value={value}
          onChange={handleChange}
          disabled={disabled || loading}
          className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            backgroundColor: error ? 'var(--badge-danger-bg)' : 'var(--input-bg)',
            color: 'var(--text-primary)',
            borderColor: error ? '#ef4444' : 'var(--border-color)',
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'var(--accent-from)';
              e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <option value="">Select a project...</option>
          {projects.length > 0 ? (
            projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.id} - {project.name}
              </option>
            ))
          ) : (
            !loading && <option value="" disabled>No projects available</option>
          )}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaFolder className={`h-4 w-4 ${loading ? 'text-gray-300' : 'text-gray-400'}`} />
        </div>
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent" style={{ borderColor: 'var(--accent-from)' }}></div>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-center text-sm" style={{ color: '#ef4444' }}>
          <FaExclamationTriangle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
        Select the project this task belongs to
      </p>
    </div>
  );
};

export default TaskProjectField;

