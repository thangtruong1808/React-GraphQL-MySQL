import React from 'react';
import { FaFolder } from 'react-icons/fa';

interface CreateProjectModalActionsProps {
  loading: boolean;
  onCancel: () => void;
}

/**
 * Create Project Modal Actions Component
 * Displays Cancel and Submit buttons
 */
const CreateProjectModalActions: React.FC<CreateProjectModalActionsProps> = ({ loading, onCancel }) => {
  // Handle cancel click
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
      <button
        type="button"
        onClick={handleCancel}
        disabled={loading}
        className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl shadow-sm hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 transform hover:scale-105"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Creating Project...
          </>
        ) : (
          <>
            <FaFolder className="h-4 w-4 mr-2" />
            Create Project
          </>
        )}
      </button>
    </div>
  );
};

export default CreateProjectModalActions;

