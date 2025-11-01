import { useState, useCallback } from 'react';
import { ProjectFormData } from '../../types/projectManagement';
import { PROJECT_VALIDATION_RULES } from '../../constants/projectManagement';

interface ValidationErrors {
  [key: string]: string;
}

/**
 * Custom hook for project form validation
 * Provides validation logic for form fields
 */
export const useProjectFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validate individual field
  const validateField = useCallback((fieldName: string, value: string) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Project name is required';
        } else if (value.trim().length < PROJECT_VALIDATION_RULES.NAME.MIN_LENGTH) {
          newErrors.name = `Project name must be at least ${PROJECT_VALIDATION_RULES.NAME.MIN_LENGTH} characters`;
        } else if (value.trim().length > PROJECT_VALIDATION_RULES.NAME.MAX_LENGTH) {
          newErrors.name = `Project name must be less than ${PROJECT_VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
        } else {
          delete newErrors.name;
        }
        break;

      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Project description is required';
        } else if (value.trim().length < PROJECT_VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {
          newErrors.description = `Description must be at least ${PROJECT_VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters`;
        } else if (value.trim().length > PROJECT_VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
          newErrors.description = `Description must be less than ${PROJECT_VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`;
        } else {
          delete newErrors.description;
        }
        break;

      case 'status':
        if (!value) {
          newErrors.status = 'Project status is required';
        } else {
          delete newErrors.status;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  }, [errors]);

  // Validate entire form
  const validateForm = useCallback((formData: ProjectFormData): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < PROJECT_VALIDATION_RULES.NAME.MIN_LENGTH) {
      newErrors.name = `Project name must be at least ${PROJECT_VALIDATION_RULES.NAME.MIN_LENGTH} characters`;
    } else if (formData.name.trim().length > PROJECT_VALIDATION_RULES.NAME.MAX_LENGTH) {
      newErrors.name = `Project name must be less than ${PROJECT_VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.trim().length < PROJECT_VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {
      newErrors.description = `Description must be at least ${PROJECT_VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters`;
    } else if (formData.description.trim().length > PROJECT_VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
      newErrors.description = `Description must be less than ${PROJECT_VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`;
    }

    // Validate status
    if (!formData.status) {
      newErrors.status = 'Project status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  // Clear error for specific field
  const clearError = useCallback((fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [errors]);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors
  };
};

