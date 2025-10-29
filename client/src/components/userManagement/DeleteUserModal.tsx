import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
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
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 [data-theme='brand']:bg-purple-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" style={{ backgroundColor: 'var(--bg-color_gray-300)' }}>
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 [data-theme='brand']:bg-purple-50 px-4 pb-4 pt-5 sm:p-6 sm:pb-4" style={{ backgroundColor: 'var(--bg-color_gray-300)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white [data-theme='brand']:text-purple-900" style={{ color: 'var(--text-primary)' }}>
                {USER_MODAL_CONFIG.delete.title}
              </h3>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 dark:text-gray-500 [data-theme='brand']:text-purple-500 hover:text-gray-600 dark:hover:text-gray-400 [data-theme='brand']:hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 [data-theme='brand']:focus:ring-purple-600 focus:ring-offset-2 rounded-md p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: 'var(--text-secondary)' }}
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-4 sm:px-6">
            <div className="sm:flex sm:items-start">
              {/* Warning icon */}
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>

              {/* Warning message */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white [data-theme='brand']:text-purple-900" style={{ color: 'var(--text-primary)' }}>
                  Are you sure you want to delete this user?
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600" style={{ color: 'var(--text-secondary)' }}>
                    This action cannot be undone. The user will be permanently removed from the system.
                  </p>
                </div>

                {/* User information */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 [data-theme='brand']:bg-purple-100 rounded-lg" style={{ backgroundColor: 'var(--bg-color_gray-300)' }}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-200 [data-theme='brand']:bg-purple-200 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-color_gray-300)' }}>
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-800 [data-theme='brand']:text-purple-800" style={{ color: 'var(--text-primary)' }}>
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white [data-theme='brand']:text-purple-900" style={{ color: 'var(--text-primary)' }}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600" style={{ color: 'var(--text-secondary)' }}>
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600" style={{ color: 'var(--text-secondary)' }}>
                        {user.role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deletion validation warning */}
                {deletionCheck && !deletionCheck.canDelete && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 [data-theme='brand']:bg-red-50 border border-red-200 dark:border-red-600 [data-theme='brand']:border-red-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaExclamationTriangle className="h-5 w-5 text-red-600 dark:text-red-400 [data-theme='brand']:text-red-600" style={{ color: '#dc2626' }} />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200 [data-theme='brand']:text-red-800" style={{ color: '#dc2626' }}>
                          Cannot Delete User
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300 [data-theme='brand']:text-red-700" style={{ color: '#dc2626' }}>
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
          <div className="bg-gray-50 dark:bg-gray-700 [data-theme='brand']:bg-purple-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" style={{ backgroundColor: 'var(--bg-color_gray-300)' }}>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading || (deletionCheck && !deletionCheck.canDelete)}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 dark:bg-red-700 [data-theme='brand']:bg-red-600 text-base font-medium text-white hover:bg-red-700 dark:hover:bg-red-800 [data-theme='brand']:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-600 [data-theme='brand']:focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 [data-theme='brand']:bg-purple-50 text-base font-medium text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-800 hover:bg-gray-50 dark:hover:bg-gray-700 [data-theme='brand']:hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-600 [data-theme='brand']:focus:ring-purple-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-primary)' }}
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
