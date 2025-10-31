import React from 'react';
import { useQuery } from '@apollo/client';
import { CreateActivityModalProps } from '../../types/activityManagement';
import {
  GET_USERS_FOR_DROPDOWN_QUERY,
  GET_PROJECTS_FOR_DROPDOWN_QUERY,
  GET_TASKS_FOR_DROPDOWN_QUERY,
  GetUsersForDropdownResponse,
  GetProjectsForDropdownResponse,
  GetTasksForDropdownResponse
} from '../../services/graphql/activityQueries';
import CreateActivityModalHeader from './modal/CreateActivityModalHeader';
import ActionField from './modal/ActionField';
import TypeField from './modal/TypeField';
import OptionalFieldsSection from './modal/OptionalFieldsSection';
import CreateActivityFormActions from './modal/CreateActivityFormActions';
import { useActivityForm } from './modal/useActivityForm';

/**
 * Create Activity Modal Component
 * Modal form for creating new activities
 * Features validation and loading states
 */
const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  loading = false,
}) => {
  const { formData, errors, handleInputChange, validateForm } = useActivityForm(isOpen);

  // Fetch dropdown data when modal is open
  const { data: usersData, loading: usersLoading } = useQuery<GetUsersForDropdownResponse>(
    GET_USERS_FOR_DROPDOWN_QUERY,
    { skip: !isOpen }
  );

  const { data: projectsData, loading: projectsLoading } = useQuery<GetProjectsForDropdownResponse>(
    GET_PROJECTS_FOR_DROPDOWN_QUERY,
    { skip: !isOpen }
  );

  const { data: tasksData, loading: tasksLoading } = useQuery<GetTasksForDropdownResponse>(
    GET_TASKS_FOR_DROPDOWN_QUERY,
    { skip: !isOpen }
  );

  // Extract data arrays
  const users = usersData?.users?.users || [];
  const projects = projectsData?.dashboardProjects?.projects || [];
  const tasks = tasksData?.dashboardTasks?.tasks || [];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onCreate({
        action: formData.action.trim(),
        type: formData.type,
        targetUserId: formData.targetUserId || undefined,
        projectId: formData.projectId || undefined,
        taskId: formData.taskId || undefined,
        metadata: formData.metadata,
      });
      onClose();
    } catch (error) {
      // Error handling without console.log for production
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 backdrop-blur-sm transition-opacity"
          style={{ backgroundColor: 'var(--modal-overlay, rgba(17,24,39,0.5))' }}
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" style={{ backgroundColor: 'var(--modal-bg)' }}>
          {/* Header */}
          <CreateActivityModalHeader onClose={handleClose} loading={loading} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              {/* Action Field */}
              <ActionField
                value={formData.action}
                error={errors.action}
                loading={loading}
                onChange={(value) => handleInputChange('action', value)}
              />

              {/* Type Field */}
              <TypeField
                value={formData.type}
                error={errors.type}
                loading={loading}
                onChange={(value) => handleInputChange('type', value)}
              />

              {/* Optional Fields */}
              <OptionalFieldsSection
                targetUserId={formData.targetUserId || ''}
                projectId={formData.projectId || ''}
                taskId={formData.taskId || ''}
                loading={loading}
                usersLoading={usersLoading}
                projectsLoading={projectsLoading}
                tasksLoading={tasksLoading}
                users={users}
                projects={projects}
                tasks={tasks}
                onTargetUserIdChange={(value) => handleInputChange('targetUserId', value)}
                onProjectIdChange={(value) => handleInputChange('projectId', value)}
                onTaskIdChange={(value) => handleInputChange('taskId', value)}
              />
            </div>

            {/* Actions */}
            <CreateActivityFormActions loading={loading} onCancel={handleClose} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateActivityModal;
