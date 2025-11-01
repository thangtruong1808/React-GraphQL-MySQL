import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface EditTagModalActionsProps {
  onClose: () => void;
  loading: boolean;
}

/**
 * Edit Tag Modal Actions Component
 * Displays cancel and update tag buttons
 */
const EditTagModalActions: React.FC<EditTagModalActionsProps> = ({ onClose, loading }) => {
  // Handle cancel click
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={handleCancel}
        className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors shadow-sm"
        disabled={loading}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Updating...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <FaCheck className="h-4 w-4" />
            <span>Update Tag</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default EditTagModalActions;

