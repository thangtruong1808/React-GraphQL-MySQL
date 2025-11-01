import React from 'react';
import { CreateUserModalProps } from '../../types/userManagement';
import { useUserFormValidation } from './useUserFormValidation';
import CreateUserModalHeader from './CreateUserModalHeader';
import UserEmailField from './UserEmailField';
import UserPasswordField from './UserPasswordField';
import UserFirstNameField from './UserFirstNameField';
import UserLastNameField from './UserLastNameField';
import UserRoleField from './UserRoleField';
import CreateUserModalActions from './CreateUserModalActions';

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
  // Use custom hook for form validation
  const {
    formData,
    errors,
    touched,
    showPassword,
    handleInputChange,
    handleInputBlur,
    validateForm,
    togglePasswordVisibility,
    resetForm
  } = useUserFormValidation({ isOpen });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form (marks all fields as touched internally)
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      resetForm();
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

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
          <CreateUserModalHeader onClose={handleClose} loading={loading} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              {/* Email field */}
              <UserEmailField
                value={formData.email}
                error={errors.email}
                touched={touched.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={loading}
              />

              {/* Password field */}
              <UserPasswordField
                value={formData.password}
                error={errors.password}
                touched={touched.password}
                showPassword={showPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onToggleVisibility={togglePasswordVisibility}
                disabled={loading}
              />

              {/* Name fields in two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name field */}
                <UserFirstNameField
                  value={formData.firstName}
                  error={errors.firstName}
                  touched={touched.firstName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                />

                {/* Last Name field */}
                <UserLastNameField
                  value={formData.lastName}
                  error={errors.lastName}
                  touched={touched.lastName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                />
              </div>

              {/* Role field */}
              <UserRoleField
                value={formData.role}
                error={errors.role}
                touched={touched.role}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <CreateUserModalActions onClose={handleClose} loading={loading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
