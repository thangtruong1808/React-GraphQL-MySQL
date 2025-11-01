import { useState, useEffect } from 'react';
import { TAGS_FORM_VALIDATION } from '../../constants/tagsManagement';
import { TagFormData } from '../../types/tagsManagement';

interface UseTagFormValidationProps {
  isOpen: boolean;
}

interface UseTagFormValidationReturn {
  formData: TagFormData;
  errors: Partial<TagFormData>;
  handleInputChange: (field: keyof TagFormData, value: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

/**
 * Custom hook for tag form validation and state management
 * Handles form state, validation, and reset functionality
 */
export const useTagFormValidation = ({
  isOpen,
}: UseTagFormValidationProps): UseTagFormValidationReturn => {
  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    description: '',
    title: '',
    type: '',
    category: '',
  });

  const [errors, setErrors] = useState<Partial<TagFormData>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      title: '',
      type: '',
      category: '',
    });
    setErrors({});
  };

  // Handle form input changes
  const handleInputChange = (field: keyof TagFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<TagFormData> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < TAGS_FORM_VALIDATION.name.minLength) {
      newErrors.name = `Name must be at least ${TAGS_FORM_VALIDATION.name.minLength} character`;
    } else if (formData.name.length > TAGS_FORM_VALIDATION.name.maxLength) {
      newErrors.name = `Name must be no more than ${TAGS_FORM_VALIDATION.name.maxLength} characters`;
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < TAGS_FORM_VALIDATION.description.minLength) {
      newErrors.description = `Description must be at least ${TAGS_FORM_VALIDATION.description.minLength} character`;
    } else if (formData.description.length > TAGS_FORM_VALIDATION.description.maxLength) {
      newErrors.description = `Description must be no more than ${TAGS_FORM_VALIDATION.description.maxLength} characters`;
    }

    // Validate title
    if (formData.title && formData.title.length > TAGS_FORM_VALIDATION.title.maxLength!) {
      newErrors.title = `Title must be no more than ${TAGS_FORM_VALIDATION.title.maxLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
  };
};

