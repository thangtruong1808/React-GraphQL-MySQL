import React from 'react';

// Form validation utilities
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push('This field is required');
  }

  // Skip other validations if value is empty and not required
  if (!value && !rules.required) {
    return { isValid: true, errors: [] };
  }

  // String validations
  if (typeof value === 'string') {
    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Minimum length is ${rules.minLength} characters`);
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Maximum length is ${rules.maxLength} characters`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push('Invalid format');
    }
  }

  // Custom validation
  if (rules.custom) {
    const customResult = rules.custom(value);
    if (typeof customResult === 'string') {
      errors.push(customResult);
    } else if (!customResult) {
      errors.push('Invalid value');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateForm = (data: Record<string, any>, schema: Record<string, ValidationRule>): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  Object.keys(schema).forEach(field => {
    results[field] = validateField(data[field], schema[field]);
  });

  return results;
};

export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

// Common validation schemas
export const emailValidation: ValidationRule = {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  custom: (value) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  },
};

export const passwordValidation: ValidationRule = {
  required: true,
  minLength: 8,
  custom: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
    return true;
  },
};

export const usernameValidation: ValidationRule = {
  required: true,
  minLength: 3,
  maxLength: 20,
  pattern: /^[a-zA-Z0-9_]+$/,
  custom: (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters long';
    if (value.length > 20) return 'Username must be less than 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return true;
  },
};

export const requiredValidation: ValidationRule = {
  required: true,
};

export const optionalTextValidation: ValidationRule = {
  maxLength: 500,
};

// Form validation hooks
export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  schema: Record<keyof T, ValidationRule>
) => {
  const [data, setData] = React.useState<T>(initialData);
  const [errors, setErrors] = React.useState<Record<keyof T, string[]>>({} as Record<keyof T, string[]>);
  const [touched, setTouched] = React.useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const validate = React.useCallback(() => {
    const validationResults = validateForm(data, schema);
    const newErrors: Record<keyof T, string[]> = {} as Record<keyof T, string[]>;
    
    Object.keys(validationResults).forEach(key => {
      newErrors[key as keyof T] = validationResults[key].errors;
    });
    
    setErrors(newErrors);
    return isFormValid(validationResults);
  }, [data, schema]);

  const handleChange = React.useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Validate field if it has been touched
    if (touched[field]) {
      const fieldValidation = validateField(value, schema[field]);
      setErrors(prev => ({ ...prev, [field]: fieldValidation.errors }));
    }
  }, [touched, schema]);

  const handleBlur = React.useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const fieldValidation = validateField(data[field], schema[field]);
    setErrors(prev => ({ ...prev, [field]: fieldValidation.errors }));
  }, [data, schema]);

  const reset = React.useCallback(() => {
    setData(initialData);
    setErrors({} as Record<keyof T, string[]>);
    setTouched({} as Record<keyof T, boolean>);
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    isValid: Object.values(errors).every(errorArray => errorArray.length === 0),
    handleChange,
    handleBlur,
    validate,
    reset,
  };
}; 