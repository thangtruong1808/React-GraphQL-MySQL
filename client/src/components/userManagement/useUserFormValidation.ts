import { useState, useEffect } from 'react';
import { UserInput, UserRole } from '../../types/userManagement';
import { USER_FORM_VALIDATION } from '../../constants/userManagement';

interface UseUserFormValidationProps {
  isOpen: boolean;
}

interface UseUserFormValidationReturn {
  formData: UserInput;
  errors: Partial<Record<keyof UserInput, string>>;
  touched: Partial<Record<keyof UserInput, boolean>>;
  showPassword: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  validateForm: () => boolean;
  togglePasswordVisibility: () => void;
  resetForm: () => void;
}

/**
 * Custom hook for user form validation and state management
 * Handles form state, validation, password visibility, and reset functionality
 */
export const useUserFormValidation = ({
  isOpen,
}: UseUserFormValidationProps): UseUserFormValidationReturn => {
  const [formData, setFormData] = useState<UserInput>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'Frontend Developer' as UserRole
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserInput, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof UserInput, boolean>>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'Frontend Developer' as UserRole
    });
    setErrors({});
    setTouched({});
    setShowPassword(false);
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /**
   * Validate form field
   * Returns error message if validation fails
   */
  const validateField = (name: keyof UserInput, value: string): string => {
    switch (name) {
      case 'email':
        if (!value.trim()) return USER_FORM_VALIDATION.email.required;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return USER_FORM_VALIDATION.email.pattern;
        return '';

      case 'password':
        if (!value) return USER_FORM_VALIDATION.password.required;
        if (value.length < 8) return USER_FORM_VALIDATION.password.minLength;
        return '';

      case 'firstName':
        if (!value.trim()) return USER_FORM_VALIDATION.firstName.required;
        if (value.length > 100) return USER_FORM_VALIDATION.firstName.maxLength;
        return '';

      case 'lastName':
        if (!value.trim()) return USER_FORM_VALIDATION.lastName.required;
        if (value.length > 100) return USER_FORM_VALIDATION.lastName.maxLength;
        return '';

      case 'role':
        if (!value) return USER_FORM_VALIDATION.role.required;
        return '';

      default:
        return '';
    }
  };

  /**
   * Validate entire form
   * Marks all fields as touched and validates them
   * Returns true if form is valid
   */
  const validateForm = (): boolean => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key as keyof UserInput] = true;
      return acc;
    }, {} as Record<keyof UserInput, boolean>);
    setTouched(allTouched);

    const newErrors: Partial<Record<keyof UserInput, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof UserInput;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handle input change
   * Updates form data and validates field if touched
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof UserInput;

    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Validate field if it has been touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  /**
   * Handle input blur
   * Marks field as touched and validates
   */
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const fieldName = e.target.name as keyof UserInput;
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    const error = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  /**
   * Toggle password visibility
   * Shows or hides password text
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return {
    formData,
    errors,
    touched,
    showPassword,
    handleInputChange,
    handleInputBlur,
    validateForm,
    togglePasswordVisibility,
    resetForm,
  };
};

