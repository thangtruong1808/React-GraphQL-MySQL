import React, { useState, useEffect } from 'react';
import { ACTIVITY_TYPE_OPTIONS, ACTIVITY_FORM_VALIDATION } from '../../constants/activityManagement';
import { EditActivityModalProps, ActivityUpdateInput } from '../../types/activityManagement';

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
      console.error('Error updating activity:', error);
    }
  };

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Activity</h3>
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

          {/* Activity Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">ID:</span> {activity.id}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">User:</span> {activity.user.firstName} {activity.user.lastName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Created:</span> {new Date(activity.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Action */}
            <div>
              <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
                Action *
              </label>
              <textarea
                id="action"
                value={formData.action || ''}
                onChange={(e) => handleInputChange('action', e.target.value)}
                placeholder="Describe the activity..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 ${errors.action ? 'border-red-300' : 'border-gray-300'
                  }`}
                disabled={loading}
              />
              {errors.action && (
                <p className="mt-1 text-sm text-red-600">{errors.action}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                id="type"
                value={formData.type || 'TASK_CREATED'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 ${errors.type ? 'border-red-300' : 'border-gray-300'
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
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
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
                  'Update Activity'
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
