import React from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash, FaBan } from 'react-icons/fa';
import { DeleteTaskModalProps } from '../../types/taskManagement';

/**
 * Delete Task Modal Component
 * Confirmation modal for deleting tasks
 * Features professional styling and clear warning message
 */
const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm,
  loading
}) => {
  /**
   * Handle delete confirmation
   * Calls onConfirm callback with task ID
   */
  const handleConfirm = async () => {
    if (!task) return;

    try {
      await onConfirm(task.id);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Delete Task
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-6">
          {/* Warning Icon and Message */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Are you sure you want to delete this task?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone. The task will be permanently removed from the system.
              </p>
            </div>
          </div>

          {/* Task Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Task Details:</h5>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Title:</span> {task.title}</p>
              <p><span className="font-medium">Status:</span> {task.status}</p>
              <p><span className="font-medium">Priority:</span> {task.priority}</p>
              <p><span className="font-medium">Project:</span> {task.project.name}</p>
              {task.assignedUser && (
                <p><span className="font-medium">Assigned To:</span> {task.assignedUser.firstName} {task.assignedUser.lastName}</p>
              )}
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Warning
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Deleting this task will also remove all associated comments.
                    This action is irreversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <FaBan className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="w-4 h-4 mr-2" />
                Delete Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
