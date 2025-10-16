import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { FaTimes, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { ACTIVITY_TYPE_OPTIONS, ACTIVITY_FORM_VALIDATION } from '../../constants/activityManagement';
import { CreateActivityModalProps, ActivityFormData } from '../../types/activityManagement';
import {
  GET_USERS_FOR_DROPDOWN_QUERY,
  GET_PROJECTS_FOR_DROPDOWN_QUERY,
  GET_TASKS_FOR_DROPDOWN_QUERY,
  GetUsersForDropdownResponse,
  GetProjectsForDropdownResponse,
  GetTasksForDropdownResponse
} from '../../services/graphql/activityQueries';

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
  const [formData, setFormData] = useState<ActivityFormData>({
    action: '',
    type: 'USER_CREATED',
    targetUserId: '',
    projectId: '',
    taskId: '',
    metadata: null,
  });

  const [errors, setErrors] = useState<Partial<ActivityFormData>>({});

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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        action: '',
        type: 'USER_CREATED',
        targetUserId: '',
        projectId: '',
        taskId: '',
        metadata: null,
      });
      setErrors({});
    }
  }, [isOpen]);

  // Handle form input changes
  const handleInputChange = (field: keyof ActivityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<ActivityFormData> = {};

    if (!formData.action.trim()) {
      newErrors.action = 'Action is required';
    } else if (formData.action.length < ACTIVITY_FORM_VALIDATION.action.minLength) {
      newErrors.action = `Action must be at least ${ACTIVITY_FORM_VALIDATION.action.minLength} characters`;
    } else if (formData.action.length > ACTIVITY_FORM_VALIDATION.action.maxLength) {
      newErrors.action = `Action must be no more than ${ACTIVITY_FORM_VALIDATION.action.maxLength} characters`;
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
                    <FaPlus className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6 text-white">
                    Create New Activity
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Log a new activity entry for tracking project progress
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-white hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="space-y-6">
              {/* Action */}
              <div>
                <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-2">
                  Action *
                </label>
                <div className="relative">
                  <textarea
                    id="action"
                    rows={4}
                    value={formData.action}
                    onChange={(e) => handleInputChange('action', e.target.value)}
                    placeholder="Describe the activity action..."
                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors resize-none ${errors.action ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    disabled={loading}
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span className={errors.action ? 'text-red-600' : 'text-gray-500'}>
                      {errors.action ? (
                        <div className="flex items-center">
                          <FaExclamationTriangle className="h-4 w-4 mr-1" />
                          {errors.action}
                        </div>
                      ) : (
                        'Provide a clear description of the activity'
                      )}
                    </span>
                    <span className={formData.action.length > ACTIVITY_FORM_VALIDATION.action.maxLength ? 'text-red-500' : 'text-gray-500'}>
                      {formData.action.length}/{ACTIVITY_FORM_VALIDATION.action.maxLength}
                    </span>
                  </div>
                </div>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type *
                </label>
                <div className="relative">
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors ${errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    disabled={loading}
                  >
                    {ACTIVITY_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <FaExclamationTriangle className="h-4 w-4 mr-1" />
                      {errors.type}
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Target User */}
                <div>
                  <label htmlFor="targetUserId" className="block text-sm font-medium text-gray-700 mb-2">
                    Target User
                  </label>
                  <select
                    id="targetUserId"
                    value={formData.targetUserId}
                    onChange={(e) => handleInputChange('targetUserId', e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
                    disabled={loading || usersLoading}
                  >
                    <option value="">Select user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.role})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {usersLoading ? 'Loading users...' : 'Optional'}
                  </p>
                </div>

                {/* Project */}
                <div>
                  <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <select
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
                    disabled={loading || projectsLoading}
                  >
                    <option value="">Select project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} ({project.status})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {projectsLoading ? 'Loading projects...' : 'Optional'}
                  </p>
                </div>

                {/* Task */}
                <div>
                  <label htmlFor="taskId" className="block text-sm font-medium text-gray-700 mb-2">
                    Task
                  </label>
                  <select
                    id="taskId"
                    value={formData.taskId}
                    onChange={(e) => handleInputChange('taskId', e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
                    disabled={loading || tasksLoading}
                  >
                    <option value="">Select task...</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title} ({task.project.name})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {tasksLoading ? 'Loading tasks...' : 'Optional'}
                  </p>
                </div>
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
                    Creating Activity...
                  </>
                ) : (
                  <>
                    <FaPlus className="h-4 w-4 mr-2" />
                    Create Activity
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

export default CreateActivityModal;
