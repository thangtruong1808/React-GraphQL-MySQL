import React from 'react';
import { useQuery } from '@apollo/client';
import { CreateTaskModalProps, TaskInput } from '../../types/taskManagement';
import { GET_PROJECTS_FOR_DROPDOWN_QUERY, GET_USERS_FOR_DROPDOWN_QUERY, GET_TAGS_FOR_DROPDOWN_QUERY } from '../../services/graphql/taskQueries';
import { useTaskFormValidation } from './useTaskFormValidation';
import CreateTaskModalHeader from './CreateTaskModalHeader';
import TaskTitleField from './TaskTitleField';
import TaskDescriptionField from './TaskDescriptionField';
import TaskStatusField from './TaskStatusField';
import TaskPriorityField from './TaskPriorityField';
import TaskDueDateField from './TaskDueDateField';
import TaskProjectField from './TaskProjectField';
import TaskAssignedUserField from './TaskAssignedUserField';
import TaskTagsField from './TaskTagsField';
import CreateTaskModalActions from './CreateTaskModalActions';

/**
 * Create Task Modal Component
 * Modal form for creating new tasks with validation
 * Features professional styling and comprehensive form fields
 */
const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading
}) => {
  // Use custom hook for form validation
  const { formData, errors, handleInputChange, handleTagChange, validateForm } = useTaskFormValidation({ isOpen });

  // Fetch projects and users for dropdowns - with error handling
  const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery(GET_PROJECTS_FOR_DROPDOWN_QUERY, {
    skip: !isOpen,
    errorPolicy: 'ignore',
  });

  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS_FOR_DROPDOWN_QUERY, {
    skip: !isOpen,
    errorPolicy: 'ignore',
  });

  const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery(GET_TAGS_FOR_DROPDOWN_QUERY, {
    skip: !isOpen,
    errorPolicy: 'ignore',
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(projectsLoading, projectsError, projectsData)) {
      return;
    }

    try {
      // Clean form data - convert empty strings to null/undefined for optional fields only
      const cleanedFormData: TaskInput = {
        ...formData,
        projectId: formData.projectId,
        assignedUserId: formData.assignedUserId || undefined,
        dueDate: formData.dueDate || undefined,
      };

      await onSubmit(cleanedFormData);
    } catch (error) {
      // Error handling is done by the parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" style={{ backgroundColor: 'var(--modal-bg)' }}>
          {/* Header */}
          <CreateTaskModalHeader onClose={onClose} loading={loading} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              {/* Title field */}
              <TaskTitleField
                value={formData.title}
                error={errors.title}
                onChange={handleInputChange}
                disabled={loading}
              />

              {/* Description field */}
              <TaskDescriptionField
                value={formData.description}
                error={errors.description}
                onChange={handleInputChange}
                disabled={loading}
              />

              {/* Status and Priority Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status field */}
                <TaskStatusField
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={loading}
                />

                {/* Priority field */}
                <TaskPriorityField
                  value={formData.priority}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* Due Date field */}
              <TaskDueDateField
                value={formData.dueDate || ''}
                onChange={handleInputChange}
                disabled={loading}
              />

              {/* Project Selection field */}
              <TaskProjectField
                value={formData.projectId}
                error={errors.projectId}
                onChange={handleInputChange}
                disabled={loading}
                loading={projectsLoading}
                projects={projectsData?.dashboardProjects?.projects}
              />

              {/* Assigned User Selection field */}
              <TaskAssignedUserField
                value={formData.assignedUserId || ''}
                onChange={handleInputChange}
                disabled={loading}
                loading={usersLoading}
                users={usersData?.users?.users}
              />

              {/* Tag Selection field */}
              <TaskTagsField
                value={formData.tagIds || []}
                onChange={handleTagChange}
                disabled={loading}
                loading={tagsLoading}
                tags={tagsData?.dashboardTags?.tags}
              />

              {/* Form Actions */}
              <CreateTaskModalActions
                onClose={onClose}
                loading={loading}
                submitError={errors.submit}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
