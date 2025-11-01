import React from 'react';
import { FaFlag, FaExclamationTriangle } from 'react-icons/fa';
import { PROJECT_STATUS_OPTIONS } from '../../constants/projectManagement';

interface ProjectStatusFieldProps {
  value: string;
  error?: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

/**
 * Project Status Field Component
 * Select field for project status with validation
 */
const ProjectStatusField: React.FC<ProjectStatusFieldProps> = ({
  value,
  error,
  loading,
  onChange,
  onBlur
}) => {
  return (
    <div>
      <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
        <FaFlag className="inline h-4 w-4 mr-2 text-purple-600" />
        Status *
      </label>
      <div className="relative">
        <select
          id="status"
          name="status"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={loading}
          className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {PROJECT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaFlag className={`h-4 w-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
      </div>
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <FaExclamationTriangle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default ProjectStatusField;

