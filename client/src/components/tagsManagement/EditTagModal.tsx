import React, { useState, useEffect } from 'react';
import { FaTimes, FaTag, FaCheck, FaEdit } from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { TAGS_FORM_VALIDATION } from '../../constants/tagsManagement';
import { GET_TAG_TYPES_QUERY, GET_TAG_CATEGORIES_QUERY } from '../../services/graphql/tagsQueries';
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

  // Fetch tag types and categories from database
  const { data: tagTypesData, loading: tagTypesLoading } = useQuery(GET_TAG_TYPES_QUERY, {
    skip: !isOpen, // Only fetch when modal is open
    errorPolicy: 'all',
  });

  const { data: tagCategoriesData, loading: tagCategoriesLoading } = useQuery(GET_TAG_CATEGORIES_QUERY, {
    skip: !isOpen, // Only fetch when modal is open
    errorPolicy: 'all',
  });

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <FaEdit className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-6 text-white">
                    Edit Tag
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Update tag information and details
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

          {/* Enhanced Tag Info */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaTag className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tag ID</p>
                  <p className="text-sm font-semibold text-gray-900">{tag.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaCheck className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(tag.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="space-y-6">
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
                  disabled={loading || tagTypesLoading}
                >
                  <option value="">Select type (optional)</option>
                  {tagTypesData?.tagTypes?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {tagTypesLoading && (
                  <p className="mt-1 text-xs text-gray-500">Loading types...</p>
                )}
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
                  disabled={loading || tagCategoriesLoading}
                >
                  <option value="">Select category (optional)</option>
                  {tagCategoriesData?.tagCategories?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {tagCategoriesLoading && (
                  <p className="mt-1 text-xs text-gray-500">Loading categories...</p>
                )}
              </div>

              {/* Enhanced Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors shadow-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FaCheck className="h-4 w-4" />
                      <span>Update Tag</span>
                    </div>
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

export default EditTagModal;
