import React from 'react';
import { DeleteNotificationModalProps } from '../../types/notificationManagement';

/**
 * Delete Notification Modal Component
 * Confirmation modal for deleting notifications
 * Features loading states and user confirmation
 */
const DeleteNotificationModal: React.FC<DeleteNotificationModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  notification,
  loading = false,
}) => {
  // Handle delete confirmation
  const handleDelete = async () => {
    if (!notification) return;

    try {
      await onDelete(notification.id);
      onClose();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Delete Notification</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Warning Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Confirmation Message */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this notification? This action cannot be undone.
            </p>

            {/* Notification Details */}
            <div className="bg-gray-50 rounded-md p-4 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">ID:</span>
                  <span className="text-sm text-gray-900">{notification.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">User:</span>
                  <span className="text-sm text-gray-900">
                    {notification.user.firstName} {notification.user.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span className={`text-sm ${notification.isRead ? 'text-green-600' : 'text-red-600'}`}>
                    {notification.isRead ? 'Read' : 'Unread'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Created:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-600">Message:</span>
                  <p className="text-sm text-gray-900 mt-1 p-2 bg-white rounded border">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                'Delete Notification'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteNotificationModal;
