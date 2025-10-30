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
          className="fixed inset-0 backdrop-blur-sm transition-opacity"
          style={{ backgroundColor: 'var(--modal-overlay, rgba(17,24,39,0.5))' }}
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-2xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" style={{ backgroundColor: 'var(--modal-bg)' }}>
          {/* Header */}
          <div className="px-6 py-6" style={{ backgroundColor: 'var(--accent-from)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-primary-bg)' }}>
                    <FaBell className="h-5 w-5" style={{ color: 'var(--badge-primary-text)' }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6" style={{ color: 'var(--button-primary-text)' }}>
                    Create New Notification
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--button-primary-text)' }}>
                    Send a notification to a specific user
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ color: 'var(--button-primary-text)' }}
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              {/* User Selection Field */}
              <div>
                <label htmlFor="userId" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  <FaUser className="inline h-4 w-4 mr-2" style={{ color: 'var(--accent-from)' }} />
                  Select User *
                </label>
                <div className="relative">
                  <select
                    id="userId"
                    value={formData.userId}
                    onChange={(e) => handleInputChange('userId', e.target.value)}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-colors`}
                    style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: `1px solid ${errors.userId ? '#ef4444' : 'var(--border-color)'}` }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.userId ? '#ef4444' : 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
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
                    <FaUser className="h-4 w-4" style={{ color: errors.userId ? '#ef4444' : 'var(--text-muted)' }} />
                  </div>
                  {formData.userId && !errors.userId && (
                    <div className="absolute inset-y-0 right-0 pr-8 flex items-center">
                      <FaCheck className="h-4 w-4" style={{ color: 'var(--accent-from)' }} />
                    </div>
                  )}
                </div>
                {errors.userId && (
                  <div className="mt-2 flex items-center text-sm" style={{ color: '#ef4444' }}>
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    <span>{errors.userId}</span>
                  </div>
                )}
                {usersLoading && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Loading users...
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  <FaEnvelope className="inline h-4 w-4 mr-2" style={{ color: 'var(--accent-from)' }} />
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
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-colors resize-none`}
                    style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: `1px solid ${errors.message ? '#ef4444' : 'var(--border-color)'}` }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.message ? '#ef4444' : 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                    disabled={loading}
                  />
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <FaEnvelope className="h-4 w-4" style={{ color: errors.message ? '#ef4444' : 'var(--text-muted)' }} />
                  </div>
                  {formData.message && !errors.message && (
                    <div className="absolute top-3 right-0 pr-3 flex items-start">
                      <FaCheck className="h-4 w-4" style={{ color: 'var(--accent-from)' }} />
                    </div>
                  )}
                </div>
                {errors.message && (
                  <div className="mt-2 flex items-center text-sm" style={{ color: '#ef4444' }}>
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    <span>{errors.message}</span>
                  </div>
                )}
                <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {formData.message.length}/{NOTIFICATION_FORM_VALIDATION.message.maxLength} characters
                </p>
              </div>

              {/* Enhanced Form Actions */}
              <div className="flex justify-end space-x-4 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-semibold rounded-xl focus:outline-none transition-colors shadow-sm"
                  style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold border rounded-xl focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  style={{ backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-primary-border, transparent)' }}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--button-primary-text)' }}></div>
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