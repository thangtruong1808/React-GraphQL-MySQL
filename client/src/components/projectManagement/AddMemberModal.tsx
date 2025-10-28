import React, { useState, useEffect, useMemo } from 'react';
import { FaTimes, FaUserPlus, FaSearch } from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { GET_AVAILABLE_USERS_QUERY, AddProjectMemberMutationVariables } from '../../services/graphql/projectMemberQueries';
import UserSelectionList from './UserSelectionList';
import RoleSelectionGrid from './RoleSelectionGrid';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (variables: AddProjectMemberMutationVariables) => Promise<void>;
  projectId: string;
  projectName: string;
  loading?: boolean;
}

/**
 * AddMemberModal Component
 * Modal for adding new members to a project
 * Includes user search and role selection functionality
 * Displays available users with their roles and allows role assignment
 */
const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  projectName,
  loading = false
}) => {
  // State for form inputs
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('VIEWER');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch available users (users not already in the project)
  const { data: availableUsersData, loading: usersLoading, refetch } = useQuery(GET_AVAILABLE_USERS_QUERY, {
    variables: {
      projectId,
      limit: 50,
      offset: 0,
      search: searchTerm || undefined
    },
    skip: !isOpen || !projectId,
    errorPolicy: 'all'
  });

  // Memoized available users list
  const availableUsers = useMemo(() => {
    return availableUsersData?.availableUsers?.users || [];
  }, [availableUsersData]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedUserId('');
      setSelectedRole('VIEWER');
      setSearchTerm('');
      setErrors({});
    }
  }, [isOpen]);

  // Refetch users when search term changes
  useEffect(() => {
    if (isOpen && projectId) {
      const timeoutId = setTimeout(() => {
        refetch({
          projectId,
          limit: 50,
          offset: 0,
          search: searchTerm || undefined
        });
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, isOpen, projectId, refetch]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: { [key: string]: string } = {};

    if (!selectedUserId) {
      newErrors.user = 'Please select a user';
    }

    if (!selectedRole) {
      newErrors.role = 'Please select a role';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit({
        projectId,
        userId: selectedUserId,
        role: selectedRole
      });

      // Reset form on success
      setSelectedUserId('');
      setSelectedRole('VIEWER');
      setSearchTerm('');
      setErrors({});
    } catch (error) {
      // Error handling is done by parent component
      // Error handling without console.log for production
    }
  };

  // Handle modal close
  const handleClose = () => {
    setSelectedUserId('');
    setSelectedRole('VIEWER');
    setSearchTerm('');
    setErrors({});
    onClose();
  };

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setErrors(prev => ({ ...prev, user: '' }));
  };

  // Handle role selection
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setErrors(prev => ({ ...prev, role: '' }));
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
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <FaUserPlus className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6 text-white">
                    Add Member to {projectName}
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Select a user and assign their role in the project
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-white hover:text-purple-200 transition-colors"
                disabled={loading}
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6">
            <form id="add-member-form" onSubmit={handleSubmit} className="space-y-6">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-semibold theme-role-selection-text mb-3">
                  Select User
                </label>

                {/* Search Input */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* User List */}
                <UserSelectionList
                  users={availableUsers}
                  selectedUserId={selectedUserId}
                  onUserSelect={handleUserSelect}
                  loading={usersLoading}
                  searchTerm={searchTerm}
                />

                {errors.user && (
                  <p className="mt-1 text-sm text-red-600">{errors.user}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold theme-role-selection-text mb-3">
                  Assign Role
                </label>
                <RoleSelectionGrid
                  selectedRole={selectedRole}
                  onRoleSelect={handleRoleSelect}
                />

                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

            </form>
          </div>

          {/* Footer with gradient background */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-member-form"
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              disabled={loading || !selectedUserId || !selectedRole}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FaUserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
