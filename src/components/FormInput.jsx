import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import React, { useState } from 'react';

function FormInput(
  {
    type = 'text',
    name,
    formValues,
    placeholder,
    pattern,
    required,
    formErrors,
    onChange,
    onFocus,
    showErrors,
    size = 'normal',
    showLabel = true,
    showShadow = true,
    disabled,
    onKeyDown,
    onMouseDown,
    ariaLabel,
    showPasswordVisibilityIcon = false,
    showDropdownIcon = false, 
    autocomplete,
    ...rest
  },
  ref,
) {
  const hasError = showErrors && formErrors && formErrors[name];
  const [inputType, setInputType] = useState(type);

  const handleToggleType = () => {
    setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'));
  };

  return (
    <div className={classNames('relative rounded-md', { 'shadow-sm': showShadow })}>
      {showLabel && <label htmlFor={name} className="block text-sm text-text-color capitalize">{placeholder}</label>}
      <div className="relative">
        <input
          aria-label={ariaLabel}
          ref={ref}
          data-testid={name}
          disabled={disabled}
          id={name}
          type={inputType}
          name={name}
          className={classNames(
            'w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white',
            {
              'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': hasError,
              'focus:ring-blue-500 focus:border-blue-500 border-gray-300': !hasError,
              'shadow-sm': showShadow,
              'mt-1': showLabel,
              'py-3': size === 'normal',
              'pl-10': showPasswordVisibilityIcon || showDropdownIcon,
              'bg-gray-200 cursor-not-allowed': disabled,
            }
          )}
          placeholder={placeholder}
          pattern={pattern}
          required={required}
          onChange={(e) => onChange?.(e, e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onMouseDown={onMouseDown}
          autoComplete={autocomplete}
          {...rest}
        />
        {showPasswordVisibilityIcon && (
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={handleToggleType}
          >
            {inputType === 'password' ? (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
        {showDropdownIcon && (
          <ChevronDownIcon className="absolute inset-y-0 right-3 h-5 w-5 text-gray-400" />
        )}
        {hasError && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {hasError && <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>}
    </div>
  );
}

export default React.forwardRef(FormInput);
