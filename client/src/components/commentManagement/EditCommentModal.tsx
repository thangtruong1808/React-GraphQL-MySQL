import React, { useEffect, useState } from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { COMMENT_LIMITS } from '../../constants/commentManagement';
import { CommentFormData, EditCommentModalProps } from '../../types/commentManagement';

/**
 * EditCommentModal Component
 * Modal for editing existing comments with form validation
 * Pre-populates form with existing comment data
 */
const EditCommentModal: React.FC<EditCommentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  comment,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CommentFormData>({
    content: '',
    taskId: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update form data when comment changes
  useEffect(() => {
    if (comment && isOpen) {
      setFormData({
        content: comment.content,
        taskId: comment.task.id,
      });
      setErrors({});
    }
  }, [comment, isOpen]);

  // Handle input changes
  const handleInputChange = (field: keyof CommentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate content
    if (!formData.content.trim()) {
      newErrors.content = 'Comment content is required';
    } else if (formData.content.trim().length < COMMENT_LIMITS.MIN_CONTENT_LENGTH) {
      newErrors.content = `Content must be at least ${COMMENT_LIMITS.MIN_CONTENT_LENGTH} characters`;
    } else if (formData.content.trim().length > COMMENT_LIMITS.MAX_CONTENT_LENGTH) {
      newErrors.content = `Content must be less than ${COMMENT_LIMITS.MAX_CONTENT_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen || !comment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" style={{ backgroundColor: 'var(--modal-bg)' }}>
          {/* Header */}
          <div className="px-6 py-6" style={{ backgroundColor: 'var(--accent-from)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-primary-bg)' }}>
                    <FaEdit className="h-5 w-5" style={{ color: 'var(--badge-primary-text)' }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6 text-white">
                    Edit Comment
                  </h3>
                  <p className="text-white text-sm mt-1">
                    Update the comment content. Changes will be visible to all users.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-white hover:text-purple-200 focus:outline-none rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              {/* Comment Info */}
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--table-row-hover-bg)', borderColor: 'var(--border-color)', borderWidth: 1 }}>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Author:</span>
                    <p className="mt-1" style={{ color: 'var(--text-primary)' }}>{comment.author.firstName} {comment.author.lastName}</p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Task:</span>
                    <p className="truncate mt-1" style={{ color: 'var(--text-primary)' }} title={comment.task.title}>
                      {comment.task.title}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Project:</span>
                    <p className="truncate mt-1" style={{ color: 'var(--text-primary)' }} title={comment.task.project.name}>
                      {comment.task.project.name}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Likes:</span>
                    <p className="mt-1" style={{ color: 'var(--text-primary)' }}>{comment.likesCount}</p>
                  </div>
                </div>
              </div>

              {/* Content Input */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Comment Content *
                </label>
                <div className="relative">
                  <textarea
                    id="content"
                    rows={6}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Enter your comment here..."
                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors resize-none ${errors.content ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600 [data-theme="brand"]:bg-red-50 [data-theme="brand"]:border-red-300' : 'border-gray-300 dark:border-gray-600 [data-theme="brand"]:border-purple-300 bg-white dark:bg-gray-700 [data-theme="brand"]:bg-white text-gray-900 dark:text-white [data-theme="brand"]:text-gray-900'
                      }`}
                    disabled={loading}
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span style={{ color: errors.content ? '#ef4444' : 'var(--text-secondary)' }}>
                      {errors.content || 'Update the comment content'}
                    </span>
                    <span style={{ color: formData.content.length > COMMENT_LIMITS.MAX_CONTENT_LENGTH ? '#ef4444' : 'var(--text-secondary)' }}>
                      {formData.content.length}/{COMMENT_LIMITS.MAX_CONTENT_LENGTH}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600 [data-theme='brand']:border-purple-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-800 bg-white dark:bg-gray-800 [data-theme='brand']:bg-purple-50 border border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 [data-theme='brand']:hover:bg-purple-100 hover:border-gray-400 dark:hover:border-gray-500 [data-theme='brand']:hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                    Updating Comment...
                  </>
                ) : (
                  <>
                    <FaEdit className="h-4 w-4 mr-2" />
                    Update Comment
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

export default EditCommentModal;
