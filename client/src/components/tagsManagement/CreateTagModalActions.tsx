import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface CreateTagModalActionsProps {
  onClose: () => void;
  loading: boolean;
}

/**
 * Create Tag Modal Actions Component
 * Displays cancel and create tag buttons
 */
const CreateTagModalActions: React.FC<CreateTagModalActionsProps> = ({ onClose, loading }) => {
  // Handle cancel click
  const handleCancel = () => {
    onClose();
  };

  // Handle mouse enter for cancel button
  const handleCancelMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
  };

  // Handle mouse leave for cancel button
  const handleCancelMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--card-bg)';
  };

  // Handle mouse enter for submit button
  const handleSubmitMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.disabled) {
      e.currentTarget.style.backgroundColor = 'var(--button-primary-hover-bg)';
    }
  };

  // Handle mouse leave for submit button
  const handleSubmitMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.disabled) {
      e.currentTarget.style.backgroundColor = 'var(--button-primary-bg)';
    }
  };

  return (
    <div className="flex justify-end space-x-4 pt-8" style={{ borderTopColor: 'var(--border-color)', borderTopWidth: '1px' }}>
      <button
        type="button"
        onClick={handleCancel}
        className="px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-color)',
          borderWidth: '1px',
        }}
        onMouseEnter={handleCancelMouseEnter}
        onMouseLeave={handleCancelMouseLeave}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-8 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
        style={{ backgroundColor: 'var(--button-primary-bg)' }}
        onMouseEnter={handleSubmitMouseEnter}
        onMouseLeave={handleSubmitMouseLeave}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Creating Tag...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <FaCheck className="h-5 w-5" />
            <span>Create Tag</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default CreateTagModalActions;

