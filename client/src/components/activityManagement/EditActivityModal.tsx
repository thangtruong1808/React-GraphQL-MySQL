import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import { ACTIVITY_TYPE_OPTIONS, ACTIVITY_FORM_VALIDATION } from '../../constants/activityManagement';
import { EditActivityModalProps, ActivityUpdateInput } from '../../types/activityManagement';
import { formatRoleForDisplay } from '../../utils/roleFormatter';

/**
 * Edit Activity Modal Component
 * Modal form for editing existing activities
 * Features validation and loading states
 */
const EditActivityModal: React.FC<EditActivityModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  activity,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ActivityUpdateInput>({
    action: '',
    type: 'USER_CREATED',
    metadata: null,
  });

  // Error type for validation messages (maps field names to error strings)
  type FormErrors = Partial<Record<keyof ActivityUpdateInput, string>>;

  const [errors, setErrors] = useState<FormErrors>({});

  // Populate form when activity changes
  useEffect(() => {
    if (activity && isOpen) {
      setFormData({
        action: activity.action || '',
        type: activity.type || 'USER_CREATED',
        metadata: activity.metadata || null,
      });
      setErrors({});
    }
  }, [activity, isOpen]);

  // Handle form input changes
  const handleInputChange = (field: keyof ActivityUpdateInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.action !== undefined) {
      if (!formData.action.trim()) {
        newErrors.action = 'Action is required';
      } else if (formData.action.length < ACTIVITY_FORM_VALIDATION.action.minLength) {
        newErrors.action = `Action must be at least ${ACTIVITY_FORM_VALIDATION.action.minLength} characters`;
      } else if (formData.action.length > ACTIVITY_FORM_VALIDATION.action.maxLength) {
        newErrors.action = `Action must be no more than ${ACTIVITY_FORM_VALIDATION.action.maxLength} characters`;
      }
    }

    if (formData.type !== undefined && !formData.type) {
      newErrors.type = 'Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activity || !validateForm()) {
      return;
    }

    try {
      await onUpdate(activity.id, {
        action: formData.action?.trim(),
        type: formData.type,
        metadata: formData.metadata,
      });
      onClose();
    } catch (error) {
      // Error handling without console.log for production
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 backdrop-blur-sm transition-opacity"
          style={{ backgroundColor: 'var(--modal-overlay, rgba(17,24,39,0.5))' }}
          onClick={handleClose}
        />

        {/* Modal */}
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
                    Edit Activity
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--button-primary-text)' }}>
                    Update activity information. Changes will be logged for audit purposes.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
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
              {/* Activity Info */}
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--table-row-hover-bg)', border: '1px solid var(--border-color)' }}>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>ID:</span>
                    <p className="mt-1" style={{ color: 'var(--text-primary)' }}>{activity.id}</p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>User:</span>
                    <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                      {activity.user.firstName} {activity.user.lastName}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {formatRoleForDisplay(activity.user.role)}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Type:</span>
                    <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                      {activity.type.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Created:</span>
                    <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                      {new Date(activity.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {activity.targetUser && (
                    <div className="col-span-2">
                      <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Target User:</span>
                      <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                        {activity.targetUser.firstName} {activity.targetUser.lastName}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {formatRoleForDisplay(activity.targetUser.role)}
                      </p>
                    </div>
                  )}
                  {(activity.project || activity.task) && (
                    <div className="col-span-2 grid grid-cols-2 gap-6">
                      {activity.project && (
                        <div>
                          <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Project:</span>
                          <p className="mt-1 truncate" style={{ color: 'var(--text-primary)' }} title={activity.project.name}>
                            {activity.project.name}
                          </p>
                        </div>
                      )}
                      {activity.task && (
                        <div>
                          <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Task:</span>
                          <p className="mt-1 truncate" style={{ color: 'var(--text-primary)' }} title={activity.task.title}>
                            {activity.task.title}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div>
                <label htmlFor="action" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Action *
                </label>
                <div className="relative">
                  <textarea
                    id="action"
                    rows={4}
                    value={formData.action || ''}
                    onChange={(e) => handleInputChange('action', e.target.value)}
                    placeholder="Update the activity description..."
                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none sm:text-sm transition-colors resize-none`}
                    style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: `1px solid ${errors.action ? 'var(--error-border)' : 'var(--border-color)'}` }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.action ? 'var(--error-border)' : 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                    disabled={loading}
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span style={{ color: errors.action ? 'var(--error-color)' : 'var(--text-secondary)' }}>
                      {errors.action ? (
                        <div className="flex items-center">
                          <FaExclamationTriangle className="h-4 w-4 mr-1" />
                          {errors.action}
                        </div>
                      ) : (
                        'Update the activity description'
                      )}
                    </span>
                    <span style={{ color: formData.action && formData.action.length > ACTIVITY_FORM_VALIDATION.action.maxLength ? 'var(--error-color)' : 'var(--text-secondary)' }}>
                      {formData.action?.length || 0}/{ACTIVITY_FORM_VALIDATION.action.maxLength}
                    </span>
                  </div>
                </div>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Activity Type *
                </label>
                <div className="relative">
                  <select
                    id="type"
                    value={formData.type || 'USER_CREATED'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none sm:text-sm transition-colors`}
                    style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: `1px solid ${errors.type ? 'var(--error-border)' : 'var(--border-color)'}` }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.type ? 'var(--error-border)' : 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                    disabled={loading}
                  >
                    {ACTIVITY_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <div className="mt-2 flex items-center text-sm" style={{ color: 'var(--error-color)' }}>
                      <FaExclamationTriangle className="h-4 w-4 mr-1" />
                      {errors.type}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 flex justify-end space-x-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={handleClose}
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
                    Updating Activity...
                  </>
                ) : (
                  <>
                    <FaEdit className="h-4 w-4 mr-2" />
                    Update Activity
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default EditActivityModal;
