import { useState, useEffect } from 'react';
import { ActivityFormData } from '../../../types/activityManagement';
import { ACTIVITY_FORM_VALIDATION } from '../../../constants/activityManagement';

/**
 * Custom hook for activity form management
 * Handles form state, validation, and field updates
 */
export const useActivityForm = (isOpen: boolean) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    action: '',
    type: 'USER_CREATED',
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
        type: 'USER_CREATED',
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

  return {
    formData,
    errors,
    handleInputChange,
    validateForm
  };
};

