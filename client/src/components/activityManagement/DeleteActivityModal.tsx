import React from 'react';
import { DeleteActivityModalProps } from '../../types/activityManagement';

/**
 * Delete Activity Modal Component
 * Confirmation modal for deleting activities
 * Features loading states and safety checks
 */
const DeleteActivityModal: React.FC<DeleteActivityModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  activity,
  loading = false,
}) => {
  // Handle delete confirmation
  const handleDelete = async () => {
    if (!activity) return;

    try {
      await onDelete(activity.id);
      onClose();
    } catch (error) {
      // Error handling without console.log for production
    }
  };

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full z-50" style={{ backgroundColor: 'var(--modal-overlay, rgba(17,24,39,0.5))' }}>
      <div className="relative top-20 mx-auto p-5 w-96 shadow-lg rounded-md" style={{ backgroundColor: 'var(--modal-bg)', border: '1px solid var(--border-color)' }}>
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Delete Activity</h3>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Warning Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full" style={{ backgroundColor: 'var(--badge-secondary-bg)' }}>
            <svg className="w-6 h-6" style={{ color: 'var(--badge-secondary-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Content */}
          <div className="text-center">
            <h4 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Are you sure you want to delete this activity?
            </h4>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              This action cannot be undone. The activity will be permanently removed from the system.
            </p>

            {/* Activity Details */}
            <div className="rounded-md p-4 mb-6 text-left" style={{ backgroundColor: 'var(--table-row-hover-bg)' }}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>ID:</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{activity.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>User:</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {activity.user.firstName} {activity.user.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Type:</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{activity.type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Action:</span>
                  <span className="text-sm truncate ml-2" style={{ color: 'var(--text-primary)' }} title={activity.action}>
                    {activity.action}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Created:</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--button-danger-bg)', color: 'var(--button-primary-text)' }}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--button-primary-text)' }}></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                'Delete Activity'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteActivityModal;
