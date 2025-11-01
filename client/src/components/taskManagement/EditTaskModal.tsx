import React from 'react';
import { useQuery } from '@apollo/client';
import { EditTaskModalProps } from '../../types/taskManagement';
import { GET_PROJECTS_FOR_DROPDOWN_QUERY, GET_USERS_FOR_DROPDOWN_QUERY, GET_TAGS_FOR_DROPDOWN_QUERY } from '../../services/graphql/taskQueries';
import { useEditTaskFormValidation } from './useEditTaskFormValidation';
import EditTaskModalHeader from './EditTaskModalHeader';
import TaskTitleField from './TaskTitleField';
import TaskDescriptionField from './TaskDescriptionField';
import TaskStatusField from './TaskStatusField';
import TaskPriorityField from './TaskPriorityField';
import TaskDueDateField from './TaskDueDateField';
import TaskProjectField from './TaskProjectField';
import TaskAssignedUserField from './TaskAssignedUserField';
import TaskTagsField from './TaskTagsField';
import EditTaskModalActions from './EditTaskModalActions';

/**
 * Edit Task Modal Component
 * Modal form for editing existing tasks with pre-populated data
 * Features professional styling and comprehensive form fields
 */
const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  task,
  onClose,
  onSubmit,
  loading
}) => {
  // Use custom hook for form validation
  const { formData, errors, handleInputChange, handleTagChange, validateForm } = useEditTaskFormValidation({ isOpen, task });

  // Fetch projects and users for dropdowns
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS_FOR_DROPDOWN_QUERY, {
    skip: !isOpen,
  });

  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS_FOR_DROPDOWN_QUERY, {
    skip: !isOpen,
  });

  const { data: tagsData, loading: tagsLoading } = useQuery(GET_TAGS_FOR_DROPDOWN_QUERY, {
    skip: !isOpen,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task) return;

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(task.id, formData);
    } catch (error) {
      // Error handling is done by the parent component
    }
  };

  if (!isOpen || !task) return null;

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
          <EditTaskModalHeader onClose={onClose} loading={loading} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              {/* Title field */}
              <TaskTitleField
                value={formData.title || ''}
                error={errors.title}
                onChange={handleInputChange}
                disabled={loading}
              />

              {/* Description field */}
              <TaskDescriptionField
                value={formData.description || ''}
                error={errors.description}
                onChange={handleInputChange}
                disabled={loading}
              />

              {/* Status and Priority Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status field */}
                <TaskStatusField
                  value={formData.status || 'TODO'}
                  onChange={handleInputChange}
                  disabled={loading}
                />

                {/* Priority field */}
                <TaskPriorityField
                  value={formData.priority || 'MEDIUM'}
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
                value={formData.projectId || ''}
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
              <EditTaskModalActions
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

export default EditTaskModal;
