import { useState, useEffect } from 'react';
import { TaskUpdateInput, Task } from '../../types/taskManagement';

interface UseEditTaskFormValidationProps {
  isOpen: boolean;
  task: Task | null;
}

interface UseEditTaskFormValidationReturn {
  formData: TaskUpdateInput;
  errors: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleTagChange: (selectedOptions: string[]) => void;
  validateForm: () => boolean;
}

/**
 * Custom hook for edit task form validation and state management
 * Handles form state, validation, and population from existing task
 */
export const useEditTaskFormValidation = ({
  isOpen,
  task,
}: UseEditTaskFormValidationProps): UseEditTaskFormValidationReturn => {
  const [formData, setFormData] = useState<TaskUpdateInput>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  /**
   * Convert ISO date string to YYYY-MM-DD format for HTML date input
   */
  const formatDateForInput = (dateString: string | null | undefined): string | undefined => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return undefined;
      return date.toISOString().split('T')[0];
    } catch (error) {
      return undefined;
    }
  };

  // Populate form with task data when modal opens
  useEffect(() => {
    if (isOpen && task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: formatDateForInput(task.dueDate),
        projectId: task.project.id,
        assignedUserId: task.assignedUser?.id || '',
        tagIds: task.tags?.map(tag => tag.id) || [],
      });
      setErrors({});
    }
  }, [isOpen, task]);

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
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate title
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    // Validate description
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    // Validate projectId
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
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
  };
};

