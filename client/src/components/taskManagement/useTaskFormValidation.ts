import { useEffect, useState } from 'react';
import { TaskInput } from '../../types/taskManagement';

interface UseTaskFormValidationProps {
  isOpen: boolean;
}

interface UseTaskFormValidationReturn {
  formData: TaskInput;
  errors: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleTagChange: (selectedOptions: string[]) => void;
  validateForm: (projectsLoading: boolean, projectsError: any, projectsData: any) => boolean;
  resetForm: () => void;
}

/**
 * Custom hook for task form validation and state management
 * Handles form state, validation, and reset functionality
 */
export const useTaskFormValidation = ({
  isOpen,
}: UseTaskFormValidationProps): UseTaskFormValidationReturn => {
  const [formData, setFormData] = useState<TaskInput>({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    projectId: '',
    assignedUserId: '',
    tagIds: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
      projectId: '',
      assignedUserId: '',
      tagIds: [],
    });
    setErrors({});
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle tag selection change (for multiple select)
  const handleTagChange = (selectedOptions: string[]) => {
    setFormData(prev => ({
      ...prev,
      tagIds: selectedOptions,
    }));

    // Clear error for tagIds if exists
    if (errors.tagIds) {
      setErrors(prev => ({
        ...prev,
        tagIds: '',
      }));
    }
  };

  // Validate form data
  const validateForm = (projectsLoading: boolean, projectsError: any, projectsData: any): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Validate projectId
    if (!formData.projectId || formData.projectId.trim() === '') {
      newErrors.projectId = 'Project is required';
    }

    // Check if projects are available (only if we tried to load them)
    if (!projectsLoading && !projectsError && !projectsData?.dashboardProjects?.projects?.length) {
      newErrors.projectId = 'No projects available. Please create a project first.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleTagChange,
    validateForm,
    resetForm,
  };
};

