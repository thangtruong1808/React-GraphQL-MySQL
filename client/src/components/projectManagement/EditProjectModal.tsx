import React, { useState, useEffect } from 'react';
import { EditProjectModalProps, ProjectFormData } from '../../types/projectManagement';
import { PROJECT_STATUS_OPTIONS, PROJECT_VALIDATION_RULES } from '../../constants/projectManagement';

/**
 * Edit Project Modal Component
 * Modal form for editing existing projects with validation
 * Pre-populates form with current project data
 * 
 * CALLED BY: ProjectsPage component
 * SCENARIOS: Editing existing projects with proper validation
 */
const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  project,
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

  /**
   * Initialize form data when project changes
   * Pre-populates form with current project data
   */
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'PLANNING',
        ownerId: project.owner?.id || ''
      });
      setErrors({});
    }
  }, [project]);

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

    if (!project || !validateForm()) {
      return;
    }

    try {
      await onSubmit(project.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        ownerId: formData.ownerId || undefined
      });
    } catch (error) {
      // Error handling is done in parent component
      console.error('Error updating project:', error);
    }
  };

  /**
   * Handle modal close
   * Calls onClose without resetting form (form will be reset on next open)
   */
  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleClose}></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Edit Project
              </h3>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.name ? 'border-red-300' : 'border-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Enter project name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Project Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.description ? 'border-red-300' : 'border-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Enter project description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Project Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={loading}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.status ? 'border-red-300' : 'border-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {PROJECT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>

              {/* Owner ID (optional) */}
              <div>
                <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-2">
                  Owner ID (Optional)
                </label>
                <input
                  type="text"
                  id="ownerId"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter owner user ID"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
