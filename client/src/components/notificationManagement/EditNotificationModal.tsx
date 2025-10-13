import React, { useState, useEffect } from 'react';
import { FaTimes, FaBell, FaUser, FaEnvelope, FaCheck, FaExclamationTriangle, FaEdit } from 'react-icons/fa';
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
  loading = false
}) => {
  // Form state management
  const [formData, setFormData] = useState<NotificationUpdateInput>({
    message: ''
  });

  // Error state management
  const [errors, setErrors] = useState<Partial<NotificationUpdateInput>>({});

  // Initialize form data when notification changes
  useEffect(() => {
    if (notification) {
      setFormData({
        message: notification.message || ''
      });
      setErrors({});
    }
  }, [notification]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ message: '' });
      setErrors({});
    }
  }, [isOpen]);

  // Handle input changes with validation
  const handleInputChange = (field: keyof NotificationUpdateInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<NotificationUpdateInput> = {};

    // Validate message
    if (!formData.message?.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < NOTIFICATION_FORM_VALIDATION.message.minLength) {
      newErrors.message = `Message must be at least ${NOTIFICATION_FORM_VALIDATION.message.minLength} character`;
    } else if (formData.message.length > NOTIFICATION_FORM_VALIDATION.message.maxLength) {
      newErrors.message = `Message must be no more than ${NOTIFICATION_FORM_VALIDATION.message.maxLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !notification) {
      return;
    }

    try {
      await onUpdate(notification.id, {
        message: formData.message
      });
      onClose();
    } catch (error) {
      // Error handling is managed by parent component
    }
  };

  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <FaEdit className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6 text-white">
                    Edit Notification
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Update notification message and details
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="text-white hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Enhanced Notification Info */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaBell className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Notification ID</p>
                  <p className="text-sm font-semibold text-gray-900">{notification.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">User</p>
                  <p className="text-sm font-semibold text-gray-900">{notification.user.firstName} {notification.user.lastName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(notification.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="space-y-6">
              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaEnvelope className="inline h-4 w-4 mr-2 text-purple-600" />
                  Message *
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    value={formData.message || ''}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Enter notification message"
                    rows={4}
                    maxLength={NOTIFICATION_FORM_VALIDATION.message.maxLength}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none ${errors.message
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                    disabled={loading}
                  />
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <FaEnvelope className={`h-4 w-4 ${errors.message ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  {formData.message && !errors.message && (
                    <div className="absolute top-3 right-0 pr-3 flex items-start">
                      <FaCheck className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.message && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    <span>{errors.message}</span>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.message?.length || 0}/{NOTIFICATION_FORM_VALIDATION.message.maxLength} characters
                </p>
              </div>

              {/* Enhanced Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors shadow-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FaCheck className="h-4 w-4" />
                      <span>Update Notification</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNotificationModal;