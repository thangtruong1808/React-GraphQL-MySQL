import React from 'react';
import { DeleteCommentModalProps } from '../../types/commentManagement';
import { COMMENT_CONFIRMATION_MESSAGES } from '../../constants/commentManagement';

/**
 * Delete Comment Modal Component
 * Confirmation modal for deleting comments
 * Shows comment details and confirmation message
 * Enhanced to match DeleteProjectModal styling
 * 
 * CALLED BY: CommentsPage component
 * SCENARIOS: Confirming comment deletion with safety checks
 */
const DeleteCommentModal: React.FC<DeleteCommentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  comment,
  loading = false,
}) => {
  /**
   * Handle confirmation
   * Calls onConfirm to delete the comment
   */
  const handleConfirm = async () => {
    if (!comment) return;

    try {
      await onConfirm();
    } catch (error) {
      // Error handling is done in parent component
      // Error handling without console.log for production
    }
  };

  /**
   * Handle modal close
   * Calls onClose without performing any action
   */
  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !comment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleClose}></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Delete Comment
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

          {/* Content */}
          <div className="bg-white px-6 py-4">
            {/* Warning icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Confirmation message */}
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Are you sure you want to delete this comment?
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                {COMMENT_CONFIRMATION_MESSAGES.DELETE}
              </p>
            </div>

            {/* Enhanced deletion impact information */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-sm font-medium text-red-800">Deletion Impact</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-red-700">Comment:</span>
                    <p className="text-red-900 truncate" title={comment.content}>
                      {comment.content.length > 50
                        ? `${comment.content.substring(0, 50)}...`
                        : comment.content
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-red-700">Likes:</span>
                    <p className="text-red-900">{comment.likesCount}</p>
                  </div>
                  <div>
                    <span className="font-medium text-red-700">Author:</span>
                    <p className="text-red-900">{comment.author.firstName} {comment.author.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-red-700">Role:</span>
                    <p className="text-red-900">{comment.author.role}</p>
                  </div>
                  <div>
                    <span className="font-medium text-red-700">Task:</span>
                    <p className="text-red-900 truncate" title={comment.task.title}>
                      {comment.task.title}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-red-700">Project:</span>
                    <p className="text-red-900 truncate" title={comment.task.project.name}>
                      {comment.task.project.name}
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                  <p className="text-sm text-red-800 font-medium">
                    This will delete the comment "{comment.content.length > 30
                      ? `${comment.content.substring(0, 30)}...`
                      : comment.content
                    }" with {comment.likesCount} likes from project "{comment.task.project.name}". This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    {COMMENT_CONFIRMATION_MESSAGES.PERMANENT_DELETE}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Deleting...' : 'Delete Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommentModal;
