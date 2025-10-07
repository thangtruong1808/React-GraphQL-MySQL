import React, { useState, useEffect } from 'react';
import { NOTIFICATION_FORM_VALIDATION } from '../../constants/notificationManagement';
import { EditNotificationModalProps, NotificationUpdateInput } from '../../types/notificationManagement';

/**
 * Edit Notification Modal Component
 * Modal form for editing existing notifications
 * Features validation and loading states
 */
const EditNotificationModal: React.FC<EditNotificationModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  notification,
  loading = false,
}) => {
  const [formData, setFormData] = useState<NotificationUpdateInput>({
    message: '',
    isRead: false,
  });

  const [errors, setErrors] = useState<Partial<NotificationUpdateInput>>({});

  // Populate form when notification changes
  useEffect(() => {
    if (notification && isOpen) {
      setFormData({
        message: notification.message || '',
        isRead: notification.isRead || false,
      });
      setErrors({});
    }
  }, [notification, isOpen]);

  // Handle form input changes
  const handleInputChange = (field: keyof NotificationUpdateInput, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<NotificationUpdateInput> = {};

    if (formData.message !== undefined) {
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required';
      } else if (formData.message.length < NOTIFICATION_FORM_VALIDATION.message.minLength) {
        newErrors.message = `Message must be at least ${NOTIFICATION_FORM_VALIDATION.message.minLength} character`;
      } else if (formData.message.length > NOTIFICATION_FORM_VALIDATION.message.maxLength) {
        newErrors.message = `Message must be no more than ${NOTIFICATION_FORM_VALIDATION.message.maxLength} characters`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notification || !validateForm()) {
      return;
    }

    try {
      await onUpdate(notification.id, {
        message: formData.message?.trim(),
        isRead: formData.isRead,
      });
      onClose();
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Notification</h3>
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

          {/* Notification Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">ID:</span> {notification.id}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">User:</span> {notification.user.firstName} {notification.user.lastName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Created:</span> {new Date(notification.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                value={formData.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Enter notification message..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 ${errors.message ? 'border-red-300' : 'border-gray-300'
                  }`}
                disabled={loading}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {(formData.message || '').length}/{NOTIFICATION_FORM_VALIDATION.message.maxLength} characters
              </p>
            </div>

            {/* Read Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isRead || false}
                  onChange={(e) => handleInputChange('isRead', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">Mark as read</span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Notification'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNotificationModal;
