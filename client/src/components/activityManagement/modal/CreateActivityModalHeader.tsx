import React from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';

interface CreateActivityModalHeaderProps {
  onClose: () => void;
  loading: boolean;
}

/**
 * Create Activity Modal Header Component
 * Displays modal header with title and close button
 */
const CreateActivityModalHeader: React.FC<CreateActivityModalHeaderProps> = ({
  onClose,
  loading
}) => {
  return (
    <div className="px-6 py-6" style={{ backgroundColor: 'var(--accent-from)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-primary-bg)' }}>
              <FaPlus className="h-5 w-5" style={{ color: 'var(--badge-primary-text)' }} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold leading-6" style={{ color: 'var(--button-primary-text)' }}>
              Create New Activity
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--button-primary-text)' }}>
              Log a new activity entry for tracking project progress
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ color: 'var(--button-primary-text)' }}
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CreateActivityModalHeader;

