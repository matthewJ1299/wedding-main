import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useAuth } from '../contexts/AuthContext';
import { loadCommonFonts } from '../utils/fontLoader';

// Import our custom components
import Typography from '../components/ui/Typography';
import { Form, TextInput } from '../components/ui/FormComponents';
import Button from '../components/ui/Button';
import PageLayout from '../components/layout/PageLayout';

// Load common fonts
loadCommonFonts();

/**
 * Login page component for admin authentication
 */
const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to '/admin'
  const from = location.state?.from || '/admin';

  /**
   * Handle login form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      // Display the actual error message if it's about HTTPS or other specific errors
      const errorMessage = err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout background="var(--global-bg)" fullWidth>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 120px)',
        width: '100%',
        px: 2,
      }}>
        <Paper sx={{
          maxWidth: 400,
          width: '100%',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
        <Typography preset="title" variant="h4" gutterBottom sx={{ mb: 3 }}>
          Admin Access
        </Typography>
        
        <Form onSubmit={handleSubmit}>
          <TextInput
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            error={error}
            autoComplete="current-password"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Login'}
          </Button>
        </Form>
        </Paper>
      </Box>
    </PageLayout>
  );
};

export default LoginPage;