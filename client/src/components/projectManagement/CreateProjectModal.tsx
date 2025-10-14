import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { FaTimes, FaFolder, FaAlignLeft, FaFlag, FaUser, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { CreateProjectModalProps, ProjectFormData } from '../../types/projectManagement';
import { PROJECT_STATUS_OPTIONS, PROJECT_VALIDATION_RULES } from '../../constants/projectManagement';
import { GET_USERS_FOR_DROPDOWN_QUERY } from '../../services/graphql/projectQueries';

/**
 * Create Project Modal Component
 * Modal form for creating new projects with validation
 * Includes form fields for name, description, status, and owner
 * 
 * CALLED BY: ProjectsPage component
 * SCENARIOS: Creating new projects with proper validation
 */
const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'PLANNING',
    ownerId: ''
  });

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch users for dropdown
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS_FOR_DROPDOWN_QUERY, {
    skip: !isOpen // Only fetch when modal is open
  });

  /**
   * Handle input change
   * Updates form data and clears related errors
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle input blur for validation
   * Validates field when user leaves input
   */
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  /**
   * Validate individual field
   * Checks field against validation rules
   */
  const validateField = (fieldName: string, value: string) => {
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
  };

  /**
   * Validate entire form
   * Checks all required fields and returns validation result
   */
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

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
  };

  /**
   * Handle form submission
   * Validates form and calls onSubmit if valid
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        ownerId: formData.ownerId || undefined
      });

      // Reset form on success
      setFormData({
        name: '',
        description: '',
        status: 'PLANNING',
        ownerId: ''
      });
      setErrors({});
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  /**
   * Handle modal close
   * Resets form and calls onClose
   */
  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      status: 'PLANNING',
      ownerId: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleClose}></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <FaFolder className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Create New Project
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Add a new project to your workspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-white hover:text-purple-200 focus:outline-none focus:text-purple-200 transition ease-in-out duration-150 p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="space-y-6">
              {/* Project Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaFolder className="inline h-4 w-4 mr-2 text-purple-600" />
                  Project Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    disabled={loading}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${errors.name
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter project name"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFolder className={`h-4 w-4 ${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  {formData.name && !errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <FaCheck className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.name && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaAlignLeft className="inline h-4 w-4 mr-2 text-purple-600" />
                  Description *
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    disabled={loading}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none ${errors.description
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter project description"
                  />
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FaAlignLeft className={`h-4 w-4 ${errors.description ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  {formData.description && !errors.description && (
                    <div className="absolute top-3 right-3 flex items-start">
                      <FaCheck className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.description && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Project Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaFlag className="inline h-4 w-4 mr-2 text-purple-600" />
                  Status *
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    disabled={loading}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${errors.status
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {PROJECT_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFlag className={`h-4 w-4 ${errors.status ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                </div>
                {errors.status && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    {errors.status}
                  </div>
                )}
              </div>

              {/* Owner Selection (optional) */}
              <div>
                <label htmlFor="ownerId" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="inline h-4 w-4 mr-2 text-purple-600" />
                  Project Owner (Optional)
                </label>
                <div className="relative">
                  <select
                    id="ownerId"
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleInputChange}
                    disabled={loading || usersLoading}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                  >
                    <option value="">Select a project owner...</option>
                    {usersData?.users?.users?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} - {user.role}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className={`h-4 w-4 ${usersLoading ? 'text-gray-300' : 'text-gray-400'}`} />
                  </div>
                  {usersLoading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Select a user to assign as the project owner
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl shadow-sm hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <FaFolder className="h-4 w-4 mr-2" />
                    Create Project
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

export default CreateProjectModal;
