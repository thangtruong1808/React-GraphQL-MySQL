import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { CreateUserModalProps, UserInput, UserRole } from '../../types/userManagement';
import { USER_ROLE_OPTIONS, USER_FORM_VALIDATION, USER_MODAL_CONFIG } from '../../constants/userManagement';

/**
 * Create User Modal Component
 * Modal form for creating new users with validation
 * Includes all required user fields with proper validation
 * 
 * CALLED BY: UsersPage component
 * SCENARIOS: Creating new users with form validation
 */
const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<UserInput>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'Frontend Developer' as UserRole
  });

  const [errors, setErrors] = useState<Partial<UserInput>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof UserInput, boolean>>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'Frontend Developer' as UserRole
      });
      setErrors({});
      setTouched({});
    }
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
   * Returns true if form is valid
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<UserInput> = {};
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
   * Updates form data and validates field
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
   * Handle form submission
   * Validates form and calls onSubmit if valid
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key as keyof UserInput] = true;
      return acc;
    }, {} as Record<keyof UserInput, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      try {
        await onSubmit(formData);
        onClose();
      } catch (error) {
        // Error handling is done in parent component
      }
    }
  };

  /**
   * Handle modal close
   * Closes modal and resets form
   */
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {USER_MODAL_CONFIG.create.title}
              </h3>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-4 pb-4 sm:px-6">
            <div className="space-y-4">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${errors.email ? 'border-red-300' : ''
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${errors.password ? 'border-red-300' : ''
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Minimum 8 characters"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* First Name field */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${errors.firstName ? 'border-red-300' : ''
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name field */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${errors.lastName ? 'border-red-300' : ''
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              {/* Role field */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${errors.role ? 'border-red-300' : ''
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {USER_ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                )}
                {USER_MODAL_CONFIG.create.submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
