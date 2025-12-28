import React, { Component } from 'react';
import Box from '@mui/material/Box';
import { COLORS } from '../styles/styleConstants';
import Typography from '../components/ui/Typography';
import Button from '../components/ui/Button';

/**
 * Error Boundary component to catch JavaScript errors in children
 * and display a fallback UI instead of crashing the whole application
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    const { children, fallback } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(error, this.handleReset)
          : fallback;
      }
      
      // Default error UI
      return (
        <Box
          sx={{
            padding: 3,
            margin: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            border: `1px solid ${COLORS.STATUS.ERROR}`,
            textAlign: 'center'
          }}
        >
          <Typography preset="error" sx={{ mb: 2 }}>
            Something went wrong. We apologize for the inconvenience.
          </Typography>
          <Button 
            onClick={this.handleReset} 
            variant="contained" 
            color="primary"
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return children;
  }
}

export default ErrorBoundary;