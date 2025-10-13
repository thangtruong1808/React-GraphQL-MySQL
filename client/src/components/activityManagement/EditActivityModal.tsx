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
    type: 'TASK_CREATED',
    metadata: null,
  });

  const [errors, setErrors] = useState<Partial<ActivityUpdateInput>>({});

  // Populate form when activity changes
  useEffect(() => {
    if (activity && isOpen) {
      setFormData({
        action: activity.action || '',
        type: activity.type || 'TASK_CREATED',
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
    const newErrors: Partial<ActivityUpdateInput> = {};

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
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Header with gradient background */}
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
                    Edit Activity
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Update activity information. Changes will be logged for audit purposes.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-white hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="space-y-6">
              {/* Activity Info */}
              <div className="bg-gradient-to-r from-purple-50 to-gray-50 p-6 rounded-xl border border-purple-100">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">ID:</span>
                    <p className="text-gray-900 mt-1">{activity.id}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">User:</span>
                    <p className="text-gray-900 mt-1">
                      {activity.user.firstName} {activity.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatRoleForDisplay(activity.user.role)}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Type:</span>
                    <p className="text-gray-900 mt-1">
                      {activity.type.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Created:</span>
                    <p className="text-gray-900 mt-1">
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
                      <span className="font-semibold text-gray-700">Target User:</span>
                      <p className="text-gray-900 mt-1">
                        {activity.targetUser.firstName} {activity.targetUser.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatRoleForDisplay(activity.targetUser.role)}
                      </p>
                    </div>
                  )}
                  {(activity.project || activity.task) && (
                    <div className="col-span-2 grid grid-cols-2 gap-6">
                      {activity.project && (
                        <div>
                          <span className="font-semibold text-gray-700">Project:</span>
                          <p className="text-gray-900 mt-1 truncate" title={activity.project.name}>
                            {activity.project.name}
                          </p>
                        </div>
                      )}
                      {activity.task && (
                        <div>
                          <span className="font-semibold text-gray-700">Task:</span>
                          <p className="text-gray-900 mt-1 truncate" title={activity.task.title}>
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
                <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-2">
                  Action *
                </label>
                <div className="relative">
                  <textarea
                    id="action"
                    rows={4}
                    value={formData.action || ''}
                    onChange={(e) => handleInputChange('action', e.target.value)}
                    placeholder="Update the activity description..."
                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors resize-none ${errors.action ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    disabled={loading}
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span className={errors.action ? 'text-red-600' : 'text-gray-500'}>
                      {errors.action ? (
                        <div className="flex items-center">
                          <FaExclamationTriangle className="h-4 w-4 mr-1" />
                          {errors.action}
                        </div>
                      ) : (
                        'Update the activity description'
                      )}
                    </span>
                    <span className={formData.action && formData.action.length > ACTIVITY_FORM_VALIDATION.action.maxLength ? 'text-red-500' : 'text-gray-500'}>
                      {formData.action?.length || 0}/{ACTIVITY_FORM_VALIDATION.action.maxLength}
                    </span>
                  </div>
                </div>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type *
                </label>
                <div className="relative">
                  <select
                    id="type"
                    value={formData.type || 'TASK_CREATED'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors ${errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    disabled={loading}
                  >
                    {ACTIVITY_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <FaExclamationTriangle className="h-4 w-4 mr-1" />
                      {errors.type}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl shadow-sm hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
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
      </div>
    </div>
  );
};

export default EditActivityModal;
