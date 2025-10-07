import React, { useState, useEffect } from 'react';
import { FaTimes, FaComment, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { CreateCommentModalProps, CommentFormData } from '../../types/commentManagement';
import { COMMENT_FORM_VALIDATION, COMMENT_LIMITS } from '../../constants/commentManagement';

/**
 * CreateCommentModal Component
 * Modal for creating new comments with form validation
 * Includes task selection and content input
 */
const CreateCommentModal: React.FC<CreateCommentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CommentFormData>({
    content: '',
    projectId: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        content: '',
        projectId: '',
      });
      setErrors({});
    }
  }, [isOpen]);

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

    // Validate project selection
    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project';
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
                    <FaComment className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6 text-white">
                    Create New Comment
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Add a new comment to a task with meaningful content
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
              {/* Project Selection */}
              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                  Project *
                </label>
                <div className="relative">
                  <select
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors ${errors.projectId ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    disabled={loading}
                  >
                    <option value="">Select a project...</option>
                    {/* TODO: This should be populated with actual projects from the system */}
                    <option value="1">Sample Project 1</option>
                    <option value="2">Sample Project 2</option>
                    <option value="3">Sample Project 3</option>
                  </select>
                  {errors.projectId && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <FaExclamationTriangle className="h-4 w-4 mr-1" />
                      {errors.projectId}
                    </div>
                  )}
                </div>
              </div>

              {/* Content Input */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Comment Content *
                </label>
                <div className="relative">
                  <textarea
                    id="content"
                    rows={4}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Enter your comment here..."
                    className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors resize-none ${errors.content ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    disabled={loading}
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span className={errors.content ? 'text-red-600' : 'text-gray-500'}>
                      {errors.content || 'Provide detailed feedback or discussion points'}
                    </span>
                    <span className={formData.content.length > COMMENT_LIMITS.MAX_CONTENT_LENGTH ? 'text-red-500' : 'text-gray-500'}>
                      {formData.content.length}/{COMMENT_LIMITS.MAX_CONTENT_LENGTH}
                    </span>
                  </div>
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
                    Creating Comment...
                  </>
                ) : (
                  <>
                    <FaComment className="h-4 w-4 mr-2" />
                    Create Comment
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

export default CreateCommentModal;
