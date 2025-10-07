import React, { useState, useEffect } from 'react';
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
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Create New Comment
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Add a new comment to a task. Make sure to provide meaningful content.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form content */}
            <div className="bg-white px-4 pb-4 sm:p-6">
              <div className="space-y-4">
                {/* Project Selection */}
                <div>
                  <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
                    Project *
                  </label>
                  <select
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.projectId ? 'border-red-300' : 'border-gray-300'
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
                    <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
                  )}
                </div>

                {/* Content Input */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Comment Content *
                  </label>
                  <textarea
                    id="content"
                    rows={4}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Enter your comment here..."
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.content ? 'border-red-300' : 'border-gray-300'
                      }`}
                    disabled={loading}
                  />
                  <div className="mt-1 flex justify-between text-sm text-gray-500">
                    <span>{errors.content || 'Provide detailed feedback or discussion points'}</span>
                    <span className={formData.content.length > COMMENT_LIMITS.MAX_CONTENT_LENGTH ? 'text-red-500' : ''}>
                      {formData.content.length}/{COMMENT_LIMITS.MAX_CONTENT_LENGTH}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Comment'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCommentModal;
