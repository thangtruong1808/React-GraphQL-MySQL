import { useState, useEffect } from 'react';
import { TAGS_FORM_VALIDATION } from '../../constants/tagsManagement';
import { TagUpdateInput, Tag } from '../../types/tagsManagement';

interface UseEditTagFormValidationProps {
  isOpen: boolean;
  tag: Tag | null;
}

interface UseEditTagFormValidationReturn {
  formData: TagUpdateInput;
  errors: Partial<TagUpdateInput>;
  handleInputChange: (field: keyof TagUpdateInput, value: string) => void;
  validateForm: () => boolean;
}

/**
 * Custom hook for edit tag form validation and state management
 * Handles form state, validation, and population from existing tag
 */
export const useEditTagFormValidation = ({
  isOpen,
  tag,
}: UseEditTagFormValidationProps): UseEditTagFormValidationReturn => {
  const [formData, setFormData] = useState<TagUpdateInput>({
    name: '',
    description: '',
    title: '',
    type: '',
    category: '',
  });

  const [errors, setErrors] = useState<Partial<TagUpdateInput>>({});

  // Populate form when tag changes
  useEffect(() => {
    if (tag && isOpen) {
      setFormData({
        name: tag.name || '',
        description: tag.description || '',
        title: tag.title || '',
        type: tag.type || '',
        category: tag.category || '',
      });
      setErrors({});
    }
  }, [tag, isOpen]);

  // Handle form input changes
  const handleInputChange = (field: keyof TagUpdateInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<TagUpdateInput> = {};

    // Validate name (if provided)
    if (formData.name !== undefined) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < TAGS_FORM_VALIDATION.name.minLength) {
        newErrors.name = `Name must be at least ${TAGS_FORM_VALIDATION.name.minLength} character`;
      } else if (formData.name.length > TAGS_FORM_VALIDATION.name.maxLength) {
        newErrors.name = `Name must be no more than ${TAGS_FORM_VALIDATION.name.maxLength} characters`;
      }
    }

    // Validate description (if provided)
    if (formData.description !== undefined) {
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < TAGS_FORM_VALIDATION.description.minLength) {
        newErrors.description = `Description must be at least ${TAGS_FORM_VALIDATION.description.minLength} character`;
      } else if (formData.description.length > TAGS_FORM_VALIDATION.description.maxLength) {
        newErrors.description = `Description must be no more than ${TAGS_FORM_VALIDATION.description.maxLength} characters`;
      }
    }

    // Validate title (if provided)
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
  };
};

