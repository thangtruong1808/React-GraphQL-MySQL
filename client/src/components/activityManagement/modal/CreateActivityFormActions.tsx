import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface CreateActivityFormActionsProps {
  loading: boolean;
  onCancel: () => void;
}

/**
 * Create Activity Form Actions Component
 * Displays form action buttons (Cancel and Submit)
 */
const CreateActivityFormActions: React.FC<CreateActivityFormActionsProps> = ({
  loading,
  onCancel
}) => {
  return (
    <div className="mt-8 pt-6 flex justify-end space-x-4" style={{ borderTop: '1px solid var(--border-color)' }}>
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-6 py-3 text-sm font-semibold rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 text-sm font-semibold border rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 transform hover:scale-105"
        style={{ backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-primary-border, transparent)' }}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 mr-2" style={{ borderColor: 'var(--button-primary-text)', borderTopColor: 'transparent' }}></div>
            Creating Activity...
          </>
        ) : (
          <>
            <FaPlus className="h-4 w-4 mr-2" />
            Create Activity
          </>
        )}
      </button>
    </div>
  );
};

export default CreateActivityFormActions;

