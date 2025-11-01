import { useState, useEffect } from 'react';
import { UserUpdateInput, UserRole, User } from '../../types/userManagement';
import { USER_FORM_VALIDATION } from '../../constants/userManagement';

interface UseEditUserFormValidationProps {
  isOpen: boolean;
  user: User | null;
}

interface UseEditUserFormValidationReturn {
  formData: UserUpdateInput;
  errors: Partial<Record<keyof UserUpdateInput, string>>;
  touched: Partial<Record<keyof UserUpdateInput, boolean>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

/**
 * Custom hook for edit user form validation and state management
 * Handles form state, validation, and populating from user data
 */
export const useEditUserFormValidation = ({
  isOpen,
  user,
}: UseEditUserFormValidationProps): UseEditUserFormValidationReturn => {
  const [formData, setFormData] = useState<UserUpdateInput>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'Frontend Developer' as UserRole
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserUpdateInput, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof UserUpdateInput, boolean>>>({});

  /**
   * Reset form to initial state or populate from user data
   */
  const resetForm = () => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      });
    } else {
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'Frontend Developer' as UserRole
      });
    }
    setErrors({});
    setTouched({});
  };

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen && user) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user]);

  /**
   * Validate form field
   * Returns error message if validation fails
   */
  const validateField = (name: keyof UserUpdateInput, value: string): string => {
    switch (name) {
      case 'email':
        if (!value.trim()) return USER_FORM_VALIDATION.email.required;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return USER_FORM_VALIDATION.email.pattern;
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
      acc[key as keyof UserUpdateInput] = true;
      return acc;
    }, {} as Record<keyof UserUpdateInput, boolean>);
    setTouched(allTouched);

    const newErrors: Partial<Record<keyof UserUpdateInput, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof UserUpdateInput;
      const error = validateField(fieldName, formData[fieldName] || '');
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
    const fieldName = name as keyof UserUpdateInput;

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
    const fieldName = e.target.name as keyof UserUpdateInput;
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    const error = validateField(fieldName, formData[fieldName] || '');
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  return {
    formData,
    errors,
    touched,
    handleInputChange,
    handleInputBlur,
    validateForm,
    resetForm,
  };
};

