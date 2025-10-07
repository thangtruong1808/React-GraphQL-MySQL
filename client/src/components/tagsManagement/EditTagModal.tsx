import React, { useState, useEffect } from 'react';
import { TAGS_FORM_VALIDATION, TAG_TYPE_OPTIONS, TAG_CATEGORY_OPTIONS } from '../../constants/tagsManagement';
import { EditTagModalProps, TagUpdateInput } from '../../types/tagsManagement';

/**
 * Edit Tag Modal Component
 * Modal form for editing existing tags
 * Features validation and loading states
 */
const EditTagModal: React.FC<EditTagModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  tag,
  loading = false,
}) => {
  const [formData, setFormData] = useState<TagUpdateInput>({
    name: '',
    description: '',
    title: '',
    type: '',
    category: '',
  });

  const [errors, setErrors] = useState<Partial<TagUpdateInput>>({});

  // Populate form when tag changes
  useEffect(() => {
    if (tag && isOpen) {
      setFormData({
        name: tag.name || '',
        description: tag.description || '',
        title: tag.title || '',
        type: tag.type || '',
        category: tag.category || '',
      });
      setErrors({});
    }
  }, [tag, isOpen]);

  // Handle form input changes
  const handleInputChange = (field: keyof TagUpdateInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<TagUpdateInput> = {};

    if (formData.name !== undefined) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < TAGS_FORM_VALIDATION.name.minLength) {
        newErrors.name = `Name must be at least ${TAGS_FORM_VALIDATION.name.minLength} character`;
      } else if (formData.name.length > TAGS_FORM_VALIDATION.name.maxLength) {
        newErrors.name = `Name must be no more than ${TAGS_FORM_VALIDATION.name.maxLength} characters`;
      }
    }

    if (formData.description !== undefined) {
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < TAGS_FORM_VALIDATION.description.minLength) {
        newErrors.description = `Description must be at least ${TAGS_FORM_VALIDATION.description.minLength} character`;
      } else if (formData.description.length > TAGS_FORM_VALIDATION.description.maxLength) {
        newErrors.description = `Description must be no more than ${TAGS_FORM_VALIDATION.description.maxLength} characters`;
      }
    }

    if (formData.title && formData.title.length > TAGS_FORM_VALIDATION.title.maxLength!) {
      newErrors.title = `Title must be no more than ${TAGS_FORM_VALIDATION.title.maxLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tag || !validateForm()) {
      return;
    }

    try {
      await onUpdate(tag.id, {
        name: formData.name?.trim(),
        description: formData.description?.trim(),
        title: formData.title?.trim(),
        type: formData.type,
        category: formData.category,
      });
      onClose();
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  if (!isOpen || !tag) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Tag</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tag Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">ID:</span> {tag.id}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Created:</span> {new Date(tag.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter tag name"
                maxLength={TAGS_FORM_VALIDATION.name.maxLength}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {(formData.name || '').length}/{TAGS_FORM_VALIDATION.name.maxLength} characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter tag description..."
                rows={3}
                maxLength={TAGS_FORM_VALIDATION.description.maxLength}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 ${errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                disabled={loading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {(formData.description || '').length}/{TAGS_FORM_VALIDATION.description.maxLength} characters
              </p>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter tag title (optional)"
                maxLength={TAGS_FORM_VALIDATION.title.maxLength}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 ${errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                disabled={loading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {(formData.title || '').length}/{TAGS_FORM_VALIDATION.title.maxLength} characters
              </p>
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                value={formData.type || ''}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              >
                <option value="">Select type (optional)</option>
                {TAG_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              >
                <option value="">Select category (optional)</option>
                {TAG_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Tag'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTagModal;
