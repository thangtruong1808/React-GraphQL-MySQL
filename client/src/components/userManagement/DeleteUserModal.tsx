import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { formatRoleForDisplay } from '../../utils/roleFormatter';
import { DeleteUserModalProps } from '../../types/userManagement';
import { USER_MODAL_CONFIG } from '../../constants/userManagement';

/**
 * Delete User Modal Component
 * Confirmation modal for deleting users with warning message
 * Shows user information and requires confirmation
 * 
 * CALLED BY: UsersPage component
 * SCENARIOS: Confirming user deletion with safety checks
 */
const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
  loading = false,
  deletionCheck = null
}) => {
  /**
   * Handle modal close
   * Closes modal if not loading
   */
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  /**
   * Handle delete confirmation
   * Calls onConfirm with user ID
   */
  const handleConfirm = async () => {
    if (!user || loading) return;

    try {
      await onConfirm(user.id);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" style={{ backgroundColor: 'var(--modal-bg)' }}>
          {/* Header */}
          <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6" style={{ color: 'var(--text-primary)' }}>
                {USER_MODAL_CONFIG.delete.title}
              </h3>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-4 sm:px-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="sm:flex sm:items-start">
              {/* Warning icon */}
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>

              {/* Warning message */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium" style={{ color: 'var(--text-primary)' }}>
                  Are you sure you want to delete this user?
                </h3>
                <div className="mt-2">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    This action cannot be undone. The user will be permanently removed from the system.
                  </p>
                </div>

                {/* User information */}
                <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--table-row-hover-bg)' }}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-from)' }}>
                        <span className="text-sm font-medium text-white">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {user.email}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {formatRoleForDisplay(user.role)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deletion validation warning */}
                {deletionCheck && !deletionCheck.canDelete && (
                  <div className="mt-4 p-4 border rounded-lg" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaExclamationTriangle className="h-5 w-5" style={{ color: '#dc2626' }} />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium" style={{ color: '#dc2626' }}>
                          Cannot Delete User
                        </h3>
                        <div className="mt-2 text-sm" style={{ color: '#dc2626' }}>
                          <p>{deletionCheck.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" style={{ backgroundColor: 'var(--table-header-bg)', borderTopColor: 'var(--border-color)', borderTopWidth: '1px' }}>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading || (deletionCheck !== null && !deletionCheck.canDelete)}
              className="w-full inline-flex justify-center rounded-xl shadow-lg hover:shadow-xl px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 transform hover:scale-105"
              style={{ backgroundColor: '#dc2626' }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }
              }}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              )}
              {USER_MODAL_CONFIG.delete.submitText}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-xl shadow-sm hover:shadow-md px-4 py-2 text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
