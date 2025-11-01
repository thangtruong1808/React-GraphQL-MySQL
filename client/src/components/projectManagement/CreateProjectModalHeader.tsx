import React from 'react';
import { FaTimes, FaFolder } from 'react-icons/fa';

interface CreateProjectModalHeaderProps {
  onClose: () => void;
  loading: boolean;
}

/**
 * Create Project Modal Header Component
 * Displays header with title and close button
 */
const CreateProjectModalHeader: React.FC<CreateProjectModalHeaderProps> = ({ onClose, loading }) => {
  // Handle close click
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="px-6 py-6" style={{ backgroundColor: 'var(--accent-from)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--badge-primary-bg)' }}>
              <FaFolder className="h-5 w-5" style={{ color: 'var(--badge-primary-text)' }} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Create New Project
            </h3>
            <p className="text-white text-sm mt-1">
              Add a new project to your workspace
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="text-white hover:text-purple-200 focus:outline-none transition ease-in-out duration-150 p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CreateProjectModalHeader;

