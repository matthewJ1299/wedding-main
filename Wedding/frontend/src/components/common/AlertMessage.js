import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

/**
 * Reusable alert message component for consistent error and success messaging
 * Follows DRY principle by centralizing alert logic
 */
export const AlertMessage = ({
  type = 'info',
  message,
  open = true,
  onClose,
  duration = 6000,
  variant = 'filled',
  fullWidth = false,
  style = {},
  ...props
}) => {
  if (!message) return null;

  return (
    <Alert
      severity={type}
      variant={variant}
      onClose={onClose}
      sx={{
        width: fullWidth ? '100%' : 'auto',
        mb: 2,
        ...style
      }}
      {...props}
    >
      {message}
    </Alert>
  );
};

/**
 * Error message component
 */
export const ErrorMessage = ({ message, onClose, ...props }) => (
  <AlertMessage
    type="error"
    message={message}
    onClose={onClose}
    {...props}
  />
);

/**
 * Success message component
 */
export const SuccessMessage = ({ message, onClose, ...props }) => (
  <AlertMessage
    type="success"
    message={message}
    onClose={onClose}
    {...props}
  />
);

/**
 * Warning message component
 */
export const WarningMessage = ({ message, onClose, ...props }) => (
  <AlertMessage
    type="warning"
    message={message}
    onClose={onClose}
    {...props}
  />
);

/**
 * Info message component
 */
export const InfoMessage = ({ message, onClose, ...props }) => (
  <AlertMessage
    type="info"
    message={message}
    onClose={onClose}
    {...props}
  />
);

/**
 * Loading message component
 */
export const LoadingMessage = ({ message = 'Loading...', ...props }) => (
  <AlertMessage
    type="info"
    message={message}
    variant="outlined"
    {...props}
  />
);

/**
 * Form validation error display component
 */
export const ValidationErrors = ({ errors, style = {} }) => {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <Box sx={{ mb: 2, ...style }}>
      {Object.entries(errors).map(([field, error]) => (
        <ErrorMessage
          key={field}
          message={`${field}: ${error}`}
          style={{ mb: 1 }}
        />
      ))}
    </Box>
  );
};

export default AlertMessage;

