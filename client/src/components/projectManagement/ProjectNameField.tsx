import React from 'react';
import { FaFolder, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface ProjectNameFieldProps {
  value: string;
  error?: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Project Name Field Component
 * Input field for project name with validation
 */
const ProjectNameField: React.FC<ProjectNameFieldProps> = ({
  value,
  error,
  loading,
  onChange,
  onBlur
}) => {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
        <FaFolder className="inline h-4 w-4 mr-2 text-purple-600" />
        Project Name *
      </label>
      <div className="relative">
        <input
          type="text"
          id="name"
          name="name"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={loading}
          className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          placeholder="Enter project name"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaFolder className={`h-4 w-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        {value && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <FaCheck className="h-4 w-4 text-green-500" />
          </div>
        )}
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

export default ProjectNameField;

