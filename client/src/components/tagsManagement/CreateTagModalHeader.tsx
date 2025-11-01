import React from 'react';
import { FaTimes, FaTag } from 'react-icons/fa';

interface CreateTagModalHeaderProps {
  onClose: () => void;
  loading: boolean;
}

/**
 * Create Tag Modal Header Component
 * Displays header with icon, title, description, and close button
 */
const CreateTagModalHeader: React.FC<CreateTagModalHeaderProps> = ({ onClose, loading }) => {
  // Handle close click
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="px-8 py-8" style={{ backgroundColor: 'var(--accent-from)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--badge-primary-bg)' }}>
              <FaTag className="h-6 w-6" style={{ color: 'var(--badge-primary-text)' }} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold leading-6" style={{ color: 'var(--button-primary-text)' }}>
              Create New Tag
            </h3>
            <p className="text-base mt-2" style={{ color: 'var(--button-primary-text)' }}>
              Add a new tag with detailed information and categorization
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          style={{ color: 'var(--button-primary-text)' }}
        >
          <FaTimes className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default CreateTagModalHeader;

