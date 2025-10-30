import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaUserTag, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { EditUserModalProps, UserUpdateInput, UserRole } from '../../types/userManagement';
import { USER_ROLE_OPTIONS, USER_FORM_VALIDATION, USER_MODAL_CONFIG } from '../../constants/userManagement';

/**
 * Edit User Modal Component
 * Modal form for editing existing users with validation
 * Pre-fills form with current user data
 * 
 * CALLED BY: UsersPage component
 * SCENARIOS: Editing existing users with form validation
 */
const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<UserUpdateInput>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'Frontend Developer' as UserRole
  });

  const [errors, setErrors] = useState<Partial<UserUpdateInput>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof UserUpdateInput, boolean>>>({});

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      });
      setErrors({});
      setTouched({});
    }
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
   * Returns true if form is valid
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<UserUpdateInput> = {};
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
   * Updates form data and validates field
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

  /**
   * Handle form submission
   * Validates form and calls onSubmit if valid
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key as keyof UserUpdateInput] = true;
      return acc;
    }, {} as Record<keyof UserUpdateInput, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      try {
        await onSubmit(user.id, formData);
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

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" style={{ backgroundColor: 'var(--modal-bg)' }}>
          {/* Header */}
          <div className="px-6 py-6" style={{ backgroundColor: 'var(--accent-from)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-primary-bg)' }}>
                    <FaUser className="h-5 w-5" style={{ color: 'var(--badge-primary-text)' }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6 text-white">
                    {USER_MODAL_CONFIG.edit.title}
                  </h3>
                  <p className="text-white text-sm mt-1">
                    Edit information for {user.firstName} {user.lastName}
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
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none transition-all duration-200 ${errors.email ? 'border-red-500' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      borderColor: errors.email ? '#ef4444' : 'var(--border-color)',
                      '--placeholder-color': 'var(--text-muted)'
                    }}
                    onFocus={(e) => {
                      if (!errors.email) {
                        e.currentTarget.style.borderColor = 'var(--accent-from)';
                        e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
                      }
                    }}
                    onBlur={(e) => {
                      handleInputBlur(e);
                      e.currentTarget.style.borderColor = errors.email ? '#ef4444' : 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="user@example.com"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className={`h-4 w-4 ${errors.email ? 'text-red-400' : ''}`} style={!errors.email ? { color: 'var(--text-primary)' } : {}} />
                  </div>
                  {formData.email && !errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <FaCheck className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <div className="mt-2 flex items-center text-sm" style={{ color: '#ef4444' }}>
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Name fields in two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name field */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none transition-all duration-200 ${errors.firstName ? 'border-red-500' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        borderColor: errors.firstName ? '#ef4444' : 'var(--border-color)',
                        '--placeholder-color': 'var(--text-muted)'
                      }}
                      onFocus={(e) => {
                        if (!errors.firstName) {
                          e.currentTarget.style.borderColor = 'var(--accent-from)';
                          e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
                        }
                      }}
                      onBlur={(e) => {
                        handleInputBlur(e);
                        e.currentTarget.style.borderColor = errors.firstName ? '#ef4444' : 'var(--border-color)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="John"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className={`h-4 w-4 ${errors.firstName ? 'text-red-400' : ''}`} style={!errors.firstName ? { color: 'var(--text-primary)' } : {}} />
                    </div>
                    {formData.firstName && !errors.firstName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <FaCheck className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  {errors.firstName && (
                    <div className="mt-2 flex items-center text-sm" style={{ color: '#ef4444' }}>
                      <FaExclamationTriangle className="h-4 w-4 mr-1" />
                      {errors.firstName}
                    </div>
                  )}
                </div>

                {/* Last Name field */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Last Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none transition-all duration-200 ${errors.lastName ? 'border-red-500' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        borderColor: errors.lastName ? '#ef4444' : 'var(--border-color)',
                        '--placeholder-color': 'var(--text-muted)'
                      }}
                      onFocus={(e) => {
                        if (!errors.lastName) {
                          e.currentTarget.style.borderColor = 'var(--accent-from)';
                          e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
                        }
                      }}
                      onBlur={(e) => {
                        handleInputBlur(e);
                        e.currentTarget.style.borderColor = errors.lastName ? '#ef4444' : 'var(--border-color)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="Doe"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className={`h-4 w-4 ${errors.lastName ? 'text-red-400' : ''}`} style={!errors.lastName ? { color: 'var(--text-primary)' } : {}} />
                    </div>
                    {formData.lastName && !errors.lastName && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <FaCheck className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  {errors.lastName && (
                    <div className="mt-2 flex items-center text-sm" style={{ color: '#ef4444' }}>
                      <FaExclamationTriangle className="h-4 w-4 mr-1" />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Role field */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Role *
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={formData.role || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none transition-all duration-200 appearance-none ${errors.role ? 'border-red-500' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      borderColor: errors.role ? '#ef4444' : 'var(--border-color)'
                    }}
                    onFocus={(e) => {
                      if (!errors.role) {
                        e.currentTarget.style.borderColor = 'var(--accent-from)';
                        e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
                      }
                    }}
                    onBlur={(e) => {
                      handleInputBlur(e);
                      e.currentTarget.style.borderColor = errors.role ? '#ef4444' : 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {USER_ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserTag className={`h-4 w-4 ${errors.role ? 'text-red-400' : ''}`} style={!errors.role ? { color: 'var(--text-primary)' } : {}} />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.role && (
                  <div className="mt-2 flex items-center text-sm" style={{ color: '#ef4444' }}>
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    {errors.role}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 flex justify-end space-x-4" style={{ borderTopColor: 'var(--border-color)', borderTopWidth: '1px' }}>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)',
                  borderWidth: '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:scale-105"
                style={{ backgroundColor: 'var(--button-primary-bg)' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--button-primary-hover-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--button-primary-bg)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Updating User...
                  </>
                ) : (
                  <>
                    <FaUser className="h-4 w-4 mr-2" />
                    {USER_MODAL_CONFIG.edit.submitText}
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

export default EditUserModal;
