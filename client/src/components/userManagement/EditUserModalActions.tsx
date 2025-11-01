import React from 'react';
import { FaUser } from 'react-icons/fa';
import { USER_MODAL_CONFIG } from '../../constants/userManagement';

interface EditUserModalActionsProps {
  onClose: () => void;
  loading: boolean;
}

/**
 * Edit User Modal Actions Component
 * Displays cancel and update user buttons
 */
const EditUserModalActions: React.FC<EditUserModalActionsProps> = ({ onClose, loading }) => {
  // Handle cancel click
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="mt-8 pt-6 flex justify-end space-x-4" style={{ borderTopColor: 'var(--border-color)', borderTopWidth: '1px' }}>
      <button
        type="button"
        onClick={handleCancel}
        disabled={loading}
        className="px-6 py-3 text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-color)',
          borderWidth: '1px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--card-bg)';
        }}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:scale-105"
        style={{ backgroundColor: 'var(--button-primary-bg)' }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'var(--button-primary-hover-bg)';
          }
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'var(--button-primary-bg)';
          }
        }}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Updating User...
          </>
        ) : (
          <>
            <FaUser className="h-4 w-4 mr-2" />
            {USER_MODAL_CONFIG.edit.submitText}
          </>
        )}
      </button>
    </div>
  );
};

export default EditUserModalActions;

