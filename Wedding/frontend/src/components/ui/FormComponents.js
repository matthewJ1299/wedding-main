import React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';

/**
 * A customized text input component that follows the application's design system.
 */
export const TextInput = ({
  label,
  value,
  onChange,
  error,
  helperText,
  fullWidth = true,
  required = false,
  type = 'text',
  multiline = false,
  rows,
  style = {},
  ...props
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || helperText}
      fullWidth={fullWidth}
      required={required}
      type={type}
      multiline={multiline}
      rows={rows}
      variant="outlined"
      margin="normal"
      sx={{ 
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...style 
      }}
      {...props}
    />
  );
};

/**
 * A customized select input component that follows the application's design system.
 */
export const SelectInput = ({
  label,
  value,
  onChange,
  options = [],
  error,
  helperText,
  fullWidth = true,
  required = false,
  style = {},
  ...props
}) => {
  return (
    <FormControl 
      fullWidth={fullWidth}
      required={required}
      error={!!error}
      variant="outlined"
      margin="normal"
      sx={{ 
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...style 
      }}
      {...props}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
    </FormControl>
  );
};

/**
 * A form container component that provides consistent styling and layout for forms.
 */
export const Form = ({
  children,
  onSubmit,
  style = {},
  ...props
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
      {...props}
    >
      {children}
    </Box>
  );
};