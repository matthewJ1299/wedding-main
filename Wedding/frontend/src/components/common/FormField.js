import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
// import Box from '@mui/material/Box';

/**
 * Reusable form field component with consistent styling and validation
 * Follows DRY principle by centralizing form field logic
 */
export const FormField = ({
  type = 'text',
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  multiline = false,
  rows,
  select = false,
  options = [],
  placeholder,
  autoComplete,
  style = {},
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [showError, setShowError] = useState(false);

  // Show error only after field has been touched
  useEffect(() => {
    setShowError(touched && !!error);
  }, [touched, error]);

  const handleBlur = (e) => {
    setTouched(true);
    if (onBlur) onBlur(e);
  };

  const handleChange = (e) => {
    setTouched(true);
    if (onChange) onChange(e);
  };

  const fieldProps = {
    label,
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    error: showError,
    helperText: showError ? error : helperText,
    required,
    disabled,
    fullWidth,
    placeholder,
    autoComplete,
    variant: 'outlined',
    margin: 'normal',
    sx: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
      },
      ...style
    },
    ...props
  };

  if (select) {
    return (
      <FormControl
        fullWidth={fullWidth}
        margin="normal"
        error={showError}
        required={required}
        disabled={disabled}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
          ...style
        }}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          label={label}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {showError && <FormHelperText>{error}</FormHelperText>}
        {helperText && !showError && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  return (
    <TextField
      type={type}
      multiline={multiline}
      rows={rows}
      {...fieldProps}
    />
  );
};

/**
 * Specialized text input component
 */
export const TextInput = (props) => <FormField type="text" {...props} />;

/**
 * Specialized email input component
 */
export const EmailInput = (props) => (
  <FormField 
    type="email" 
    autoComplete="email"
    {...props} 
  />
);

/**
 * Specialized phone input component
 */
export const PhoneInput = (props) => (
  <FormField 
    type="tel" 
    autoComplete="tel"
    placeholder="+1234567890"
    {...props} 
  />
);

/**
 * Specialized password input component
 */
export const PasswordInput = (props) => (
  <FormField 
    type="password" 
    autoComplete="current-password"
    {...props} 
  />
);

/**
 * Specialized select input component
 */
export const SelectInput = (props) => (
  <FormField 
    select 
    {...props} 
  />
);

/**
 * Specialized textarea component
 */
export const TextAreaInput = (props) => (
  <FormField 
    multiline 
    rows={4}
    {...props} 
  />
);

export default FormField;





