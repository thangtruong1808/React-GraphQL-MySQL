import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { FaTimes, FaBell, FaUser, FaEnvelope, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { NOTIFICATION_FORM_VALIDATION } from '../../constants/notificationManagement';
import { CreateNotificationModalProps, NotificationFormData } from '../../types/notificationManagement';
import { GET_USERS_FOR_DROPDOWN_QUERY, GetUsersForDropdownResponse } from '../../services/graphql/notificationQueries';

/**
 * Create Notification Modal Component
 * Modal form for creating new notifications
 * Features validation and loading states
 */
const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  loading = false
}) => {
  // Form state management
  const [formData, setFormData] = useState<NotificationFormData>({
    userId: '',
    message: ''
  });

  // Error state management
  const [errors, setErrors] = useState<Partial<NotificationFormData>>({});

  // Fetch users for dropdown selection
  const { data: usersData, loading: usersLoading } = useQuery<GetUsersForDropdownResponse>(
    GET_USERS_FOR_DROPDOWN_QUERY,
    {
      skip: !isOpen, // Only fetch when modal is open
      errorPolicy: 'all'
    }
  );

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        userId: '',
        message: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  // Handle input changes with validation
  const handleInputChange = (field: keyof NotificationFormData, value: string) => {
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
    const newErrors: Partial<NotificationFormData> = {};

    // Validate user selection
    if (!formData.userId.trim()) {
      newErrors.userId = 'Please select a user';
    }

    // Validate message
    if (!formData.message.trim()) {
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

    if (!validateForm()) {
      return;
    }

    try {
      await onCreate({
        userId: formData.userId,
        message: formData.message
      });
      onClose();
    } catch (error) {
      // Error handling is managed by parent component
    }
  };

  if (!isOpen) return null;

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
                    <FaBell className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6 text-white">
                    Create New Notification
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Send a notification to a specific user
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

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="space-y-6">
              {/* User Selection Field */}
              <div>
                <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="inline h-4 w-4 mr-2 text-purple-600" />
                  Select User *
                </label>
                <div className="relative">
                  <select
                    id="userId"
                    value={formData.userId}
                    onChange={(e) => handleInputChange('userId', e.target.value)}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${errors.userId
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                    disabled={loading || usersLoading}
                  >
                    <option value="">Select a user...</option>
                    {usersData?.users?.users?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} - {user.role}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className={`h-4 w-4 ${errors.userId ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  {formData.userId && !errors.userId && (
                    <div className="absolute inset-y-0 right-0 pr-8 flex items-center">
                      <FaCheck className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.userId && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    <span>{errors.userId}</span>
                  </div>
                )}
                {usersLoading && (
                  <p className="mt-1 text-xs text-gray-500">
                    Loading users...
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaEnvelope className="inline h-4 w-4 mr-2 text-purple-600" />
                  Message *
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    value={formData.message}
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
                  {formData.message.length}/{NOTIFICATION_FORM_VALIDATION.message.maxLength} characters
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
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FaCheck className="h-4 w-4" />
                      <span>Create Notification</span>
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

export default CreateNotificationModal;