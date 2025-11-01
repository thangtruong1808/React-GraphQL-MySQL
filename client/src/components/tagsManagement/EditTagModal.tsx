import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TAG_TYPES_QUERY, GET_TAG_CATEGORIES_QUERY } from '../../services/graphql/tagsQueries';
import { EditTagModalProps } from '../../types/tagsManagement';
import { useEditTagFormValidation } from './useEditTagFormValidation';
import EditTagModalHeader from './EditTagModalHeader';
import EditTagInfo from './EditTagInfo';
import TagNameField from './TagNameField';
import TagDescriptionField from './TagDescriptionField';
import TagTitleField from './TagTitleField';
import TagTypeField from './TagTypeField';
import TagCategoryField from './TagCategoryField';
import EditTagModalActions from './EditTagModalActions';

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
  // Use custom hook for form validation
  const { formData, errors, handleInputChange, validateForm } = useEditTagFormValidation({ isOpen, tag });

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
      // Error handling is done by the parent component
    }
  };

  if (!isOpen || !tag) return null;

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
          <EditTagModalHeader onClose={onClose} loading={loading} />

          {/* Tag Info */}
          <EditTagInfo tag={tag} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="space-y-6">
              {/* Name Field */}
              <TagNameField
                value={formData.name || ''}
                error={errors.name}
                onChange={(value) => handleInputChange('name', value)}
                disabled={loading}
              />

              {/* Description Field */}
              <TagDescriptionField
                value={formData.description || ''}
                error={errors.description}
                onChange={(value) => handleInputChange('description', value)}
                disabled={loading}
              />

              {/* Title Field */}
              <TagTitleField
                value={formData.title || ''}
                error={errors.title}
                onChange={(value) => handleInputChange('title', value)}
                disabled={loading}
              />

              {/* Type Field */}
              <TagTypeField
                value={formData.type || ''}
                onChange={(value) => handleInputChange('type', value)}
                disabled={loading}
                loading={tagTypesLoading}
                options={tagTypesData?.tagTypes}
              />

              {/* Category Field */}
              <TagCategoryField
                value={formData.category || ''}
                onChange={(value) => handleInputChange('category', value)}
                disabled={loading}
                loading={tagCategoriesLoading}
                options={tagCategoriesData?.tagCategories}
              />

              {/* Form Actions */}
              <EditTagModalActions onClose={onClose} loading={loading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTagModal;
