import React, { useState, useEffect } from 'react';
import { FaTimes, FaTasks, FaAlignLeft, FaFlag, FaCalendarAlt, FaFolder, FaUser, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { EditTaskModalProps, TaskUpdateInput } from '../../types/taskManagement';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS, TASK_ERROR_MESSAGES } from '../../constants/taskManagement';
import { GET_PROJECTS_FOR_DROPDOWN_QUERY, GET_USERS_FOR_DROPDOWN_QUERY } from '../../services/graphql/taskQueries';

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
  const [formData, setFormData] = useState<TaskUpdateInput>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch projects and users for dropdowns
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS_FOR_DROPDOWN_QUERY, {
    skip: !isOpen // Only fetch when modal is open
  });

  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS_FOR_DROPDOWN_QUERY, {
    skip: !isOpen // Only fetch when modal is open
  });

  /**
   * Populate form with task data when modal opens
   */
  useEffect(() => {
    if (isOpen && task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate || '',
        projectId: task.project.id,
        assignedUserId: task.assignedUser?.id || ''
      });
      setErrors({});
    }
  }, [isOpen, task]);

  /**
   * Handle input change
   * Updates form data and clears field errors
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data
   * Returns true if valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * Validates form and calls onSubmit callback
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task) return;

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(task.id, formData);
    } catch (error) {
      setErrors({ submit: TASK_ERROR_MESSAGES.UPDATE });
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
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <FaTasks className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6 text-white">
                    Edit Task
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Update task details and assignments
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
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
              {/* Title field */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaTasks className="inline h-4 w-4 mr-2 text-purple-600" />
                  Task Title *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${errors.title
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter task title"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTasks className={`h-4 w-4 ${errors.title ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  {formData.title && !errors.title && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <FaCheck className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.title && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </div>
                )}
              </div>

              {/* Description field */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaAlignLeft className="inline h-4 w-4 mr-2 text-purple-600" />
                  Description *
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                    rows={4}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none ${errors.description
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter task description"
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

              {/* Status and Priority Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status field */}
                <div>
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaFlag className="inline h-4 w-4 mr-2 text-purple-600" />
                    Status *
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={formData.status || 'TODO'}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      {TASK_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaFlag className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Priority field */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaFlag className="inline h-4 w-4 mr-2 text-purple-600" />
                    Priority *
                  </label>
                  <div className="relative">
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority || 'MEDIUM'}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                    >
                      {TASK_PRIORITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaFlag className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Due Date field */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendarAlt className="inline h-4 w-4 mr-2 text-purple-600" />
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Optional due date for this task
                </p>
              </div>

              {/* Project Selection field */}
              <div>
                <label htmlFor="projectId" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaFolder className="inline h-4 w-4 mr-2 text-purple-600" />
                  Project *
                </label>
                <div className="relative">
                  <select
                    id="projectId"
                    name="projectId"
                    value={formData.projectId || ''}
                    onChange={handleInputChange}
                    disabled={loading || projectsLoading}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 ${errors.projectId ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  >
                    <option value="">Select a project...</option>
                    {projectsData?.dashboardProjects?.projects?.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.id} - {project.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFolder className={`h-4 w-4 ${projectsLoading ? 'text-gray-300' : 'text-gray-400'}`} />
                  </div>
                  {projectsLoading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
                {errors.projectId && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <FaExclamationTriangle className="h-4 w-4 mr-1" />
                    {errors.projectId}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Select the project this task belongs to
                </p>
              </div>

              {/* Assigned User Selection field */}
              <div>
                <label htmlFor="assignedUserId" className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="inline h-4 w-4 mr-2 text-purple-600" />
                  Assigned User (Optional)
                </label>
                <div className="relative">
                  <select
                    id="assignedUserId"
                    name="assignedUserId"
                    value={formData.assignedUserId || ''}
                    onChange={handleInputChange}
                    disabled={loading || usersLoading}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                  >
                    <option value="">Select a user...</option>
                    {usersData?.users?.users?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.id} - {user.firstName} {user.lastName}
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
                  Select a user to assign this task to
                </p>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="flex items-center text-sm text-red-600">
                  <FaExclamationTriangle className="h-4 w-4 mr-1" />
                  {errors.submit}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      Updating Task...
                    </>
                  ) : (
                    <>
                      <FaTasks className="h-4 w-4 mr-2" />
                      Update Task
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
