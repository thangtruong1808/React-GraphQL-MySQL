import React from 'react';
import { FaTasks, FaExclamationTriangle } from 'react-icons/fa';

interface EditTaskModalActionsProps {
  onClose: () => void;
  loading: boolean;
  submitError?: string;
}

/**
 * Edit Task Modal Actions Component
 * Displays cancel and update task buttons with error handling
 */
const EditTaskModalActions: React.FC<EditTaskModalActionsProps> = ({ onClose, loading, submitError }) => {
  // Handle cancel click
  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {/* Submit Error */}
      {submitError && (
        <div className="flex items-center text-sm" style={{ color: '#ef4444' }}>
          <FaExclamationTriangle className="h-4 w-4 mr-1" />
          {submitError}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="px-6 py-3 text-sm font-medium rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = 'var(--card-bg)';
            }
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 transform hover:scale-105"
          style={{
            background: 'linear-gradient(to right, var(--accent-from), var(--accent-to))',
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.opacity = '0.9';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.opacity = '1';
            }
          }}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Updating Task...
            </>
          ) : (
            <>
              <FaTasks className="h-4 w-4 mr-2" />
              Update Task
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default EditTaskModalActions;

