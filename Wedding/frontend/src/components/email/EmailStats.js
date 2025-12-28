import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Card, CardContent, Grid, 
         Button, Table, TableBody, TableCell, TableContainer, 
         TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import { 
  getEmailStatistics, 
  getAllEmailTracking, 
  clearEmailTracking, 
  EMAIL_EVENTS 
} from '../../services/emailTrackingService';

/**
 * Email Statistics Component
 * 
 * @returns {JSX.Element} - EmailStats component
 */
const EmailStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentEmails, setRecentEmails] = useState([]);
  
  // Load email statistics
  useEffect(() => {
    loadStatistics();
  }, []);
  
  const loadStatistics = () => {
    setLoading(true);
    try {
      const statistics = getEmailStatistics();
      const allEmails = getAllEmailTracking();
      
      setStats(statistics);
      setRecentEmails(allEmails.slice(-20).reverse()); // Get last 20 emails in reverse order
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearTracking = () => {
    if (window.confirm('This will clear all email tracking data. Are you sure?')) {
      clearEmailTracking();
      loadStatistics();
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!stats || stats.totalEmails === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No email tracking data available. Send some emails to start tracking statistics.
      </Alert>
    );
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Get status color based on event type
  const getStatusColor = (event) => {
    switch (event) {
      case EMAIL_EVENTS.SENT: return 'info.main';
      case EMAIL_EVENTS.DELIVERED: return 'success.main';
      case EMAIL_EVENTS.OPENED: return 'success.dark';
      case EMAIL_EVENTS.CLICKED: return 'primary.main';
      case EMAIL_EVENTS.FAILED: return 'error.main';
      default: return 'text.secondary';
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Email Statistics</Typography>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={loadStatistics}
          sx={{ mr: 1 }}
        >
          Refresh
        </Button>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleClearTracking}
        >
          Clear Data
        </Button>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Emails</Typography>
              <Typography variant="h4">{stats.totalEmails}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Sent</Typography>
              <Typography variant="h4">{stats.eventCounts[EMAIL_EVENTS.SENT] || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Opened</Typography>
              <Typography variant="h4">{stats.eventCounts[EMAIL_EVENTS.OPENED] || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Failed</Typography>
              <Typography variant="h4">{stats.eventCounts[EMAIL_EVENTS.FAILED] || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="h6" gutterBottom>Recent Emails</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentEmails.length > 0 ? (
              recentEmails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>{formatDate(email.timestamp)}</TableCell>
                  <TableCell>{email.to}</TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell>{email.templateId}</TableCell>
                  <TableCell>
                    <Typography color={getStatusColor(email.event)}>
                      {email.event?.toUpperCase() || 'UNKNOWN'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">No recent emails</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmailStats;