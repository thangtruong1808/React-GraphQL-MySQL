import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TAG_TYPES_QUERY, GET_TAG_CATEGORIES_QUERY } from '../../services/graphql/tagsQueries';
import { CreateTagModalProps } from '../../types/tagsManagement';
import { useTagFormValidation } from './useTagFormValidation';
import CreateTagModalHeader from './CreateTagModalHeader';
import TagNameField from './TagNameField';
import TagDescriptionField from './TagDescriptionField';
import TagTitleField from './TagTitleField';
import TagTypeField from './TagTypeField';
import TagCategoryField from './TagCategoryField';
import CreateTagModalActions from './CreateTagModalActions';

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
  // Use custom hook for form validation
  const { formData, errors, handleInputChange, validateForm } = useTagFormValidation({ isOpen });

  // Fetch tag types and categories from database
  const { data: tagTypesData, loading: tagTypesLoading } = useQuery(GET_TAG_TYPES_QUERY, {
    skip: !isOpen,
    errorPolicy: 'all',
  });

  const { data: tagCategoriesData, loading: tagCategoriesLoading } = useQuery(GET_TAG_CATEGORIES_QUERY, {
    skip: !isOpen,
    errorPolicy: 'all',
  });

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
          style={{ backgroundColor: 'var(--modal-overlay, rgba(17,24,39,0.5))' }}
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-3xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl" style={{ backgroundColor: 'var(--modal-bg)' }}>
          {/* Header */}
          <CreateTagModalHeader onClose={onClose} loading={loading} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-8">
              {/* Name Field */}
              <TagNameField
                value={formData.name}
                error={errors.name}
                onChange={(value) => handleInputChange('name', value)}
                disabled={loading}
              />

              {/* Description Field */}
              <TagDescriptionField
                value={formData.description}
                error={errors.description}
                onChange={(value) => handleInputChange('description', value)}
                disabled={loading}
              />

              {/* Title Field */}
              <TagTitleField
                value={formData.title}
                error={errors.title}
                onChange={(value) => handleInputChange('title', value)}
                disabled={loading}
              />

              {/* Type Field */}
              <TagTypeField
                value={formData.type}
                onChange={(value) => handleInputChange('type', value)}
                disabled={loading}
                loading={tagTypesLoading}
                options={tagTypesData?.tagTypes}
              />

              {/* Category Field */}
              <TagCategoryField
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                disabled={loading}
                loading={tagCategoriesLoading}
                options={tagCategoriesData?.tagCategories}
              />

              {/* Form Actions */}
              <CreateTagModalActions onClose={onClose} loading={loading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTagModal;
