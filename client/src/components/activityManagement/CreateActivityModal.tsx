import React, { useState, useEffect } from 'react';
import { ACTIVITY_TYPE_OPTIONS, ACTIVITY_FORM_VALIDATION } from '../../constants/activityManagement';
import { CreateActivityModalProps, ActivityFormData } from '../../types/activityManagement';

/**
 * Create Activity Modal Component
 * Modal form for creating new activities
 * Features validation and loading states
 */
const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    action: '',
    type: 'TASK_CREATED',
    targetUserId: '',
    projectId: '',
    taskId: '',
    metadata: null,
  });

  const [errors, setErrors] = useState<Partial<ActivityFormData>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        action: '',
        type: 'TASK_CREATED',
        targetUserId: '',
        projectId: '',
        taskId: '',
        metadata: null,
      });
      setErrors({});
    }
  }, [isOpen]);

  // Handle form input changes
  const handleInputChange = (field: keyof ActivityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<ActivityFormData> = {};

    if (!formData.action.trim()) {
      newErrors.action = 'Action is required';
    } else if (formData.action.length < ACTIVITY_FORM_VALIDATION.action.minLength) {
      newErrors.action = `Action must be at least ${ACTIVITY_FORM_VALIDATION.action.minLength} characters`;
    } else if (formData.action.length > ACTIVITY_FORM_VALIDATION.action.maxLength) {
      newErrors.action = `Action must be no more than ${ACTIVITY_FORM_VALIDATION.action.maxLength} characters`;
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
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
        action: formData.action.trim(),
        type: formData.type,
        targetUserId: formData.targetUserId || undefined,
        projectId: formData.projectId || undefined,
        taskId: formData.taskId || undefined,
        metadata: formData.metadata,
      });
      onClose();
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create New Activity</h3>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Action */}
            <div>
              <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
                Action *
              </label>
              <textarea
                id="action"
                value={formData.action}
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
                value={formData.type}
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

            {/* Target User ID */}
            <div>
              <label htmlFor="targetUserId" className="block text-sm font-medium text-gray-700 mb-1">
                Target User ID (Optional)
              </label>
              <input
                type="text"
                id="targetUserId"
                value={formData.targetUserId}
                onChange={(e) => handleInputChange('targetUserId', e.target.value)}
                placeholder="User ID if applicable"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              />
            </div>

            {/* Project ID */}
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                Project ID (Optional)
              </label>
              <input
                type="text"
                id="projectId"
                value={formData.projectId}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                placeholder="Project ID if applicable"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              />
            </div>

            {/* Task ID */}
            <div>
              <label htmlFor="taskId" className="block text-sm font-medium text-gray-700 mb-1">
                Task ID (Optional)
              </label>
              <input
                type="text"
                id="taskId"
                value={formData.taskId}
                onChange={(e) => handleInputChange('taskId', e.target.value)}
                placeholder="Task ID if applicable"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              />
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
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Activity'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateActivityModal;
