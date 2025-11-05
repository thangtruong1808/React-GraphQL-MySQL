import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaUser } from 'react-icons/fa';
import { ProjectMemberRole, PROJECT_MEMBER_ROLES } from '../../services/graphql/projectMemberQueries';
import { ProjectMember } from '../../types/projectManagement';

interface UpdateMemberRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectId: string, userId: string, role: ProjectMemberRole) => Promise<void>;
  member: ProjectMember | null;
  loading?: boolean;
}

/**
 * UpdateMemberRoleModal Component
 * Modal for updating a project member's role
 * Shows current role and allows selection of new role
 * Includes role descriptions and validation
 */
const UpdateMemberRoleModal: React.FC<UpdateMemberRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  member,
  loading = false
}) => {
  // State for selected role
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && member) {
      setSelectedRole(member.role);
      setErrors({});
    }
  }, [isOpen, member]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member) return;

    // Validate form
    const newErrors: { [key: string]: string } = {};

    if (!selectedRole) {
      newErrors.role = 'Please select a role';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(member.projectId, member.userId, selectedRole as ProjectMemberRole);

      // Reset form on success
      setSelectedRole('');
      setErrors({});
    } catch (error) {
      // Error handling is done by parent component
      // Error handling without console.log for production
    }
  };

  // Handle modal close
  const handleClose = () => {
    setSelectedRole('');
    setErrors({});
    onClose();
  };

  // Handle role selection
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setErrors(prev => ({ ...prev, role: '' }));
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg" style={{ backgroundColor: 'var(--modal-bg)' }}>
          {/* Header */}
          <div className="px-6 py-6" style={{ backgroundColor: 'var(--accent-from)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-primary-bg)' }}>
                    <FaEdit className="h-5 w-5" style={{ color: 'var(--badge-primary-text)' }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6 text-white">
                    Update Member Role
                  </h3>
                  <p className="text-white text-sm mt-1">
                    Change the role for this project member
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-white hover:text-blue-200 transition-colors"
                disabled={loading}
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <form id="update-role-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Member Details */}
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--table-row-hover-bg)' }}>
                <h4 className="text-sm font-semibold theme-role-selection-text mb-3">Member Details</h4>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full theme-avatar-bg flex items-center justify-center">
                      <span className="text-sm font-medium theme-avatar-text">
                        {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium theme-role-selection-text">
                      {member.user.firstName} {member.user.lastName}
                    </div>
                    <div className="text-sm theme-role-selection-text-secondary">{member.user.email}</div>
                  </div>
                </div>
              </div>

              {/* Current Role Display */}
              <div>
                <label className="block text-sm font-semibold theme-role-selection-text mb-3">
                  Current Role
                </label>
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: 1 }}>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.role === 'OWNER' ? 'theme-badge-primary' :
                    member.role === 'EDITOR' ? 'theme-badge-secondary' :
                      'theme-badge-neutral'
                    }`}>
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold theme-role-selection-text mb-3">
                  New Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PROJECT_MEMBER_ROLES.map((role) => (
                    <div
                      key={role.value}
                      className={`relative p-3 border-2 rounded-lg cursor-pointer transition-colors theme-role-selection-bg ${selectedRole === role.value
                        ? 'theme-role-selection-active-border theme-role-selection-active-bg'
                        : 'theme-role-selection-border theme-role-selection-border-hover'
                        }`}
                      onClick={() => handleRoleSelect(role.value)}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium theme-role-selection-text mb-1">
                          {role.label}
                        </div>
                        <div className="text-xs theme-role-selection-text-secondary">
                          {role.value === 'VIEWER' && 'Can view project and tasks'}
                          {role.value === 'EDITOR' && 'Can post comments. Cannot edit tasks (Admin/PM only)'}
                          {role.value === 'OWNER' && 'Full project management access'}
                        </div>
                      </div>
                      {selectedRole === role.value && (
                        <div className="absolute top-2 right-2">
                          <div className="h-4 w-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-from)' }}>
                            <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Role Change Warning */}
              {selectedRole && selectedRole !== member.role && (
                <div className="rounded-md p-4" style={{ backgroundColor: 'var(--table-row-hover-bg)', borderColor: 'var(--border-color)', borderWidth: 1 }}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--accent-from)' }}>
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Role Change Notice
                      </h3>
                      <div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <p>
                          Changing from <strong>{member.role}</strong> to <strong>{selectedRole}</strong> will
                          {selectedRole === 'OWNER' && ' grant full project management access.'}
                          {selectedRole === 'EDITOR' && ' allow editing tasks and comments.'}
                          {selectedRole === 'VIEWER' && ' limit access to viewing only.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Footer with gradient background */}
          <div className="px-6 py-4 flex items-center justify-end space-x-3" style={{ backgroundColor: 'var(--table-header-bg)', borderTopColor: 'var(--border-color)', borderTopWidth: 1 }}>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium rounded-lg focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)', borderWidth: 1 }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="update-role-form"
              className="px-6 py-2 text-sm font-medium rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              style={{ backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-primary-bg)' }}
              disabled={loading || !selectedRole || selectedRole === member.role}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaEdit className="h-4 w-4 mr-2" />
                  Update Role
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMemberRoleModal;
