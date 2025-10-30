import React, { useState, useEffect } from 'react';
import { FaTimes, FaTag, FaCheck } from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { TAGS_FORM_VALIDATION } from '../../constants/tagsManagement';
import { GET_TAG_TYPES_QUERY, GET_TAG_CATEGORIES_QUERY } from '../../services/graphql/tagsQueries';
import { CreateTagModalProps, TagFormData } from '../../types/tagsManagement';

/**
 * Create Tag Modal Component
 * Modal form for creating new tags
 * Features validation and loading states
 */
const CreateTagModal: React.FC<CreateTagModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  loading = false,
}) => {
  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    description: '',
    title: '',
    type: '',
    category: '',
  });

  const [errors, setErrors] = useState<Partial<TagFormData>>({});

  // Fetch tag types and categories from database
  const { data: tagTypesData, loading: tagTypesLoading } = useQuery(GET_TAG_TYPES_QUERY, {
    skip: !isOpen, // Only fetch when modal is open
    errorPolicy: 'all',
  });

  const { data: tagCategoriesData, loading: tagCategoriesLoading } = useQuery(GET_TAG_CATEGORIES_QUERY, {
    skip: !isOpen, // Only fetch when modal is open
    errorPolicy: 'all',
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        title: '',
        type: '',
        category: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  // Handle form input changes
  const handleInputChange = (field: keyof TagFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<TagFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < TAGS_FORM_VALIDATION.name.minLength) {
      newErrors.name = `Name must be at least ${TAGS_FORM_VALIDATION.name.minLength} character`;
    } else if (formData.name.length > TAGS_FORM_VALIDATION.name.maxLength) {
      newErrors.name = `Name must be no more than ${TAGS_FORM_VALIDATION.name.maxLength} characters`;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < TAGS_FORM_VALIDATION.description.minLength) {
      newErrors.description = `Description must be at least ${TAGS_FORM_VALIDATION.description.minLength} character`;
    } else if (formData.description.length > TAGS_FORM_VALIDATION.description.maxLength) {
      newErrors.description = `Description must be no more than ${TAGS_FORM_VALIDATION.description.maxLength} characters`;
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

    if (!validateForm()) {
      return;
    }

    try {
      await onCreate({
        name: formData.name.trim(),
        description: formData.description.trim(),
        title: formData.title.trim() || undefined,
        type: formData.type || undefined,
        category: formData.category || undefined,
      });
      onClose();
    } catch (error) {
      // Error handling is done by the parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 backdrop-blur-sm transition-opacity"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-3xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl" style={{ backgroundColor: 'var(--modal-bg)' }}>
          {/* Header */}
          <div className="px-8 py-8" style={{ backgroundColor: 'var(--accent-from)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FaTag className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold leading-6 text-white">
                    Create New Tag
                  </h3>
                  <p className="text-purple-100 text-base mt-2">
                    Add a new tag with detailed information and categorization
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="text-white hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-white hover:bg-opacity-10"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-8">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Tag Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter a descriptive tag name"
                  maxLength={TAGS_FORM_VALIDATION.name.maxLength}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${errors.name ? 'border-red-500' : ''}`}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    borderColor: errors.name ? '#ef4444' : 'var(--border-color)',
                    '--placeholder-color': 'var(--text-muted)'
                  }}
                  onFocus={(e) => {
                    if (!errors.name) {
                      e.currentTarget.style.borderColor = 'var(--accent-from)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.name ? '#ef4444' : 'var(--border-color)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-2 text-sm flex items-center" style={{ color: '#ef4444' }}>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
                <p className="mt-2 text-xs flex items-center" style={{ color: 'var(--text-muted)' }}>
                  <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'var(--accent-from)' }}></span>
                  {formData.name.length}/{TAGS_FORM_VALIDATION.name.maxLength} characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of what this tag represents..."
                  rows={4}
                  maxLength={TAGS_FORM_VALIDATION.description.maxLength}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 [data-theme='brand']:focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-400 [data-theme='brand']:focus:border-purple-500 transition-all duration-200 resize-none bg-white dark:bg-gray-800 [data-theme='brand']:bg-white text-gray-900 dark:text-gray-100 [data-theme='brand']:text-purple-900 placeholder-gray-500 dark:placeholder-gray-400 [data-theme='brand']:placeholder-purple-500 ${errors.description ? 'border-red-300 dark:border-red-500 [data-theme="brand"]:border-red-400 bg-red-50 dark:bg-red-900/20 [data-theme="brand"]:bg-red-50' : 'border-gray-300 dark:border-gray-600 [data-theme="brand"]:border-purple-300 hover:border-gray-400 dark:hover:border-gray-500 [data-theme="brand"]:hover:border-purple-400'
                    }`}
                  disabled={loading}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 [data-theme='brand']:text-red-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 dark:bg-purple-400 [data-theme='brand']:bg-purple-600 rounded-full mr-2"></span>
                  {formData.description.length}/{TAGS_FORM_VALIDATION.description.maxLength} characters
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
                  value={formData.title}
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
                  {formData.title.length}/{TAGS_FORM_VALIDATION.title.maxLength} characters
                </p>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  value={formData.type}
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
                  value={formData.category}
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

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-8" style={{ borderTopColor: 'var(--border-color)', borderTopWidth: '1px' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--border-color)',
                  borderWidth: '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ backgroundColor: 'var(--button-primary-bg)' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--button-primary-hover-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--button-primary-bg)';
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating Tag...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-5 w-5" />
                    <span>Create Tag</span>
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

export default CreateTagModal;
