import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { EditProjectModalProps, ProjectFormData } from '../../types/projectManagement';
import { GET_USERS_FOR_DROPDOWN_QUERY } from '../../services/graphql/projectQueries';
import { useProjectFormValidation } from './useProjectFormValidation';
import EditProjectModalHeader from './EditProjectModalHeader';
import ProjectNameField from './ProjectNameField';
import ProjectDescriptionField from './ProjectDescriptionField';
import ProjectStatusField from './ProjectStatusField';
import ProjectOwnerField from './ProjectOwnerField';
import EditProjectModalActions from './EditProjectModalActions';

/**
 * Edit Project Modal Component
 * Modal form for editing existing projects with validation
 * Pre-populates form with current project data
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

  // Form validation hook
  const { errors, validateField, validateForm, clearError, clearAllErrors } = useProjectFormValidation();

  // Fetch users for dropdown
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS_FOR_DROPDOWN_QUERY, {
    skip: !isOpen // Only fetch when modal is open
  });

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'PLANNING',
        ownerId: project.owner?.id || ''
      });
      clearAllErrors();
    }
  }, [project, clearAllErrors]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    clearError(name);
  };

  // Handle input blur for validation
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project || !validateForm(formData)) {
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
    }
  };

  // Handle modal close
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
        <div className="inline-block align-bottom rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full" style={{ backgroundColor: 'var(--modal-bg)' }}>
          <EditProjectModalHeader onClose={handleClose} loading={loading} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              <ProjectNameField
                value={formData.name}
                error={errors.name}
                loading={loading}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />

              <ProjectDescriptionField
                value={formData.description}
                error={errors.description}
                loading={loading}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />

              <ProjectStatusField
                value={formData.status}
                error={errors.status}
                loading={loading}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />

              <ProjectOwnerField
                value={formData.ownerId || ''}
                users={usersData?.users?.users}
                loading={loading}
                usersLoading={usersLoading}
                onChange={handleInputChange}
              />
            </div>

            <EditProjectModalActions loading={loading} onCancel={handleClose} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
