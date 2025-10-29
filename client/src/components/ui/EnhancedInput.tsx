import React from 'react';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showErrorIcon?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  showError?: boolean;
}

export const EnhancedInput: React.FC<EnhancedInputProps> = (props) => {
  const label = props.label;
  const error = props.error;
  const required = props.required || false;
  const helperText = props.helperText;
  const leftIcon = props.leftIcon;
  const rightIcon = props.rightIcon;
  const showErrorIcon = props.showErrorIcon !== false;
  const containerClassName = props.containerClassName || '';
  const labelClassName = props.labelClassName || '';
  const inputClassName = props.inputClassName || '';
  const showError = props.showError !== false;
  const className = props.className;
  const id = props.id;

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  const getInputStyles = () => {
    const baseStyles = 'block w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 px-4 py-3 text-sm bg-white dark:bg-gray-800 [data-theme="brand"]:bg-purple-50 text-gray-900 dark:text-white [data-theme="brand"]:text-purple-900 border-gray-300 dark:border-gray-600 [data-theme="brand"]:border-purple-200';
    const errorStyles = hasError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500';
    const disabledStyles = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseStyles} ${errorStyles} ${disabledStyles} ${inputClassName}`.trim();
  };

  const getContainerStyles = () => {
    const baseStyles = 'space-y-1';
    return `${baseStyles} ${containerClassName}`.trim();
  };

  const inputProps = { ...props };
  delete inputProps.label;
  delete inputProps.error;
  delete inputProps.required;
  delete inputProps.helperText;
  delete inputProps.leftIcon;
  delete inputProps.rightIcon;
  delete inputProps.showErrorIcon;
  delete inputProps.containerClassName;
  delete inputProps.labelClassName;
  delete inputProps.inputClassName;
  delete inputProps.showError;

  return (
    <div className={getContainerStyles()}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 [data-theme="brand"]:text-purple-900 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          {...inputProps}
          id={inputId}
          className={getInputStyles()}
          style={{
            paddingLeft: leftIcon ? '2.75rem' : undefined,
            paddingRight: rightIcon ? '2.75rem' : undefined,
          }}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {helperText && !hasError && (
        <p className="text-sm text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600">
          {helperText}
        </p>
      )}

      {showError && hasError && (
        <div className="text-red-600 text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

EnhancedInput.displayName = 'EnhancedInput';