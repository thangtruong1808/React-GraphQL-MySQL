import React from 'react';
import { EditUserModalProps } from '../../types/userManagement';
import { useEditUserFormValidation } from './useEditUserFormValidation';
import EditUserModalHeader from './EditUserModalHeader';
import EditUserInfo from './EditUserInfo';
import UserEmailField from './UserEmailField';
import UserFirstNameField from './UserFirstNameField';
import UserLastNameField from './UserLastNameField';
import UserRoleField from './UserRoleField';
import EditUserModalActions from './EditUserModalActions';

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
  // Use custom hook for form validation
  const {
    formData,
    errors,
    touched,
    handleInputChange,
    handleInputBlur,
    validateForm,
    resetForm
  } = useEditUserFormValidation({ isOpen, user });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validate form (marks all fields as touched internally)
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(user.id, formData);
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
          <EditUserModalHeader user={user} onClose={handleClose} loading={loading} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              {/* User Info */}
              <EditUserInfo user={user} />

              {/* Email field */}
              <UserEmailField
                value={formData.email || ''}
                error={errors.email}
                touched={touched.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={loading}
              />

              {/* Name fields in two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name field */}
                <UserFirstNameField
                  value={formData.firstName || ''}
                  error={errors.firstName}
                  touched={touched.firstName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                />

                {/* Last Name field */}
                <UserLastNameField
                  value={formData.lastName || ''}
                  error={errors.lastName}
                  touched={touched.lastName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                />
              </div>

              {/* Role field */}
              <UserRoleField
                value={formData.role || ''}
                error={errors.role}
                touched={touched.role}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <EditUserModalActions onClose={handleClose} loading={loading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
