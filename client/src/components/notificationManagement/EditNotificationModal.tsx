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
                    <FaEdit className="h-5 w-5" style={{ color: 'var(--badge-primary-text)' }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6" style={{ color: 'var(--button-primary-text)' }}>
                    Edit Notification
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--button-primary-text)' }}>
                    Update notification message and details
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

          {/* Enhanced Notification Info */}
          <div className="px-6 py-4" style={{ backgroundColor: 'var(--table-header-bg)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-primary-bg)' }}>
                  <FaBell className="h-4 w-4" style={{ color: 'var(--badge-primary-text)' }} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Notification ID</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{notification.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-secondary-bg)' }}>
                  <FaUser className="h-4 w-4" style={{ color: 'var(--badge-secondary-text)' }} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>User</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{notification.user.firstName} {notification.user.lastName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-secondary-bg)' }}>
                  <FaCheck className="h-4 w-4" style={{ color: 'var(--badge-secondary-text)' }} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Created</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{new Date(notification.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  <FaEnvelope className="inline h-4 w-4 mr-2" style={{ color: 'var(--accent-from)' }} />
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
                  {formData.message?.length || 0}/{NOTIFICATION_FORM_VALIDATION.message.maxLength} characters
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