import React from 'react';
import { FaAlignLeft, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface ProjectDescriptionFieldProps {
  value: string;
  error?: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

/**
 * Project Description Field Component
 * Textarea field for project description with validation
 */
const ProjectDescriptionField: React.FC<ProjectDescriptionFieldProps> = ({
  value,
  error,
  loading,
  onChange,
  onBlur
}) => {
  return (
    <div>
      <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
        <FaAlignLeft className="inline h-4 w-4 mr-2 text-purple-600" />
        Description *
      </label>
      <div className="relative">
        <textarea
          id="description"
          name="description"
          rows={4}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={loading}
          className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          placeholder="Enter project description"
        />
        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
          <FaAlignLeft className={`h-4 w-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        {value && !error && (
          <div className="absolute top-3 right-3 flex items-start">
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

export default ProjectDescriptionField;

