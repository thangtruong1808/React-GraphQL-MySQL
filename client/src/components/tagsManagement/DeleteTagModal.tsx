import React from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash, FaBan, FaTag } from 'react-icons/fa';
import { DeleteTagModalProps } from '../../types/tagsManagement';

/**
 * Delete Tag Modal Component
 * Professional confirmation modal for deleting tags
 * Features enhanced styling, clear warnings, and user-friendly interface
 */
const DeleteTagModal: React.FC<DeleteTagModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  tag,
  loading = false,
}) => {
  /**
   * Handle delete confirmation
   * Calls onDelete callback with tag ID and closes modal on success
   */
  const handleDelete = async () => {
    if (!tag) return;

    try {
      await onDelete(tag.id);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  if (!isOpen || !tag) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-11/12 max-w-lg shadow-2xl rounded-2xl bg-white">
        {/* Enhanced Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <FaExclamationTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Delete Tag
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Modal Body */}
        <div className="mt-6">
          {/* Warning Icon and Message */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Are you sure you want to delete this tag?
              </h4>
              <p className="text-gray-600 mb-4">
                This action cannot be undone. The tag will be permanently removed from the system and may affect associated projects and tasks.
              </p>
            </div>
          </div>

          {/* Tag Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <FaTag className="w-4 h-4 mr-2 text-gray-500" />
              Tag Details:
            </h5>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span className="text-gray-900">{tag.name}</span>
              </div>
              {tag.title && (
                <div className="flex justify-between">
                  <span className="font-medium">Title:</span>
                  <span className="text-gray-900">{tag.title}</span>
                </div>
              )}
              {tag.type && (
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span className="text-gray-900">{tag.type}</span>
                </div>
              )}
              {tag.category && (
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span className="text-gray-900">{tag.category}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Created:</span>
                <span className="text-gray-900">
                  {new Date(tag.createdAt).toLocaleDateString()}
                </span>
              </div>
              {tag.description && (
                <div className="mt-3">
                  <span className="font-medium block mb-1">Description:</span>
                  <p className="text-gray-900 p-3 bg-white rounded border text-sm leading-relaxed">
                    {tag.description}
                  </p>
                </div>
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
                  Important Notice
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Deleting this tag may affect projects and tasks that are using it.
                    Please ensure this tag is no longer needed before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Modal Footer */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
          >
            <FaBan className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 border border-transparent rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Deleting Tag...
              </>
            ) : (
              <>
                <FaTrash className="w-5 h-5 mr-2" />
                Delete Tag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTagModal;
