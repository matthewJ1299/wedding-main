import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
// import Paper from '@mui/material/Paper';
import { PhotoService } from '../../services/photoService';
import { ErrorMessage, SuccessMessage } from '../common/AlertMessage';

/**
 * Enhanced summary dashboard with charts, statistics, and export options
 */
const EnhancedSummaryTab = ({ invitees }) => {
  const [photoStats, setPhotoStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate invitee statistics
  const totalInvitees = invitees.length;
  const accepted = invitees.filter(i => (i.rsvp || '').toLowerCase() === 'accepted').length;
  const declined = invitees.filter(i => (i.rsvp || '').toLowerCase() === 'declined').length;
  const pending = totalInvitees - accepted - declined;
  
  // Plus one statistics
  const withPlusOne = invitees.filter(i => i.allowPlusOne).length;
  const plusOneAccepted = invitees.filter(i => i.allowPlusOne && i.rsvp === 'accepted' && i.partner).length;
  
  // Couple statistics
  const couples = invitees.filter(i => i.partner).length / 2; // Divide by 2 since each couple appears twice
  const singles = totalInvitees - (couples * 2);

  // Load photo statistics
  useEffect(() => {
    const loadPhotoStats = async () => {
      try {
        setLoading(true);
        const allPhotos = await PhotoService.getPhotos();
        const approvedPhotos = await PhotoService.getApprovedPhotos();
        const pendingPhotos = await PhotoService.getPendingPhotos();
        
        setPhotoStats({
          total: allPhotos.length,
          approved: approvedPhotos.length,
          pending: pendingPhotos.length
        });
      } catch (err) {
        setError('Failed to load photo statistics');
        console.error('Error loading photo stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPhotoStats();
  }, []);

  /**
   * Export guest list to CSV
   */
  const exportToCSV = () => {
    const headers = [
      'Name',
      'Partner',
      'Email',
      'Phone',
      'RSVP Status',
      'Plus One Allowed',
      'Plus One Email',
      'Plus One Phone',
      'Dietary requirements and allergies',
      'Song request',
      'Message to couple',
      'Invite Code',
    ];
    const csvContent = [
      headers.join(','),
      ...invitees.map(invitee => [
        `"${invitee.name}"`,
        `"${invitee.partner || ''}"`,
        `"${invitee.email || ''}"`,
        `"${invitee.phone || ''}"`,
        `"${invitee.rsvp || 'pending'}"`,
        `"${invitee.allowPlusOne ? 'Yes' : 'No'}"`,
        `"${invitee.plusOneEmail || ''}"`,
        `"${invitee.plusOnePhone || ''}"`,
        `"${(invitee.mealSelection || '').replace(/"/g, '""')}"`,
        `"${(invitee.songRequest || '').replace(/"/g, '""')}"`,
        `"${(invitee.messageToCouple || '').replace(/"/g, '""')}"`,
        `"${invitee.id}"`,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding_guest_list_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    setSuccess('Guest list exported successfully!');
  };

  /**
   * Get RSVP status color
   */
  // const getStatusColor = (status) => {
  //   switch (status.toLowerCase()) {
  //     case 'accepted': return 'success';
  //     case 'declined': return 'error';
  //     case 'pending': return 'warning';
  //     default: return 'default';
  //   }
  // };

  /**
   * Render statistics card
   */
  const StatCard = ({ title, value, subtitle, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h4" component="div" sx={{ 
          color: `var(--accent-color, #2d5c3a)`,
          fontWeight: 600,
          mb: 1
        }}>
          {value}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  /**
   * Render RSVP status breakdown
   */
  const RSVPBreakdown = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Cormorant Garamond, serif' }}>
          RSVP Status Breakdown
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">Accepted</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {accepted} ({totalInvitees > 0 ? Math.round((accepted / totalInvitees) * 100) : 0}%)
              </Typography>
              <Chip label="Accepted" color="success" size="small" />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">Declined</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {declined} ({totalInvitees > 0 ? Math.round((declined / totalInvitees) * 100) : 0}%)
              </Typography>
              <Chip label="Declined" color="error" size="small" />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">Pending</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {pending} ({totalInvitees > 0 ? Math.round((pending / totalInvitees) * 100) : 0}%)
              </Typography>
              <Chip label="Pending" color="warning" size="small" />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  /**
   * Render plus one statistics
   */
  const PlusOneStats = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Cormorant Garamond, serif' }}>
          Plus One Statistics
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">Plus One Allowed</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {withPlusOne}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">Plus One Accepted</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {plusOneAccepted}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">Couples</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {couples}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">Single Guests</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {singles}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  /**
   * Render photo statistics
   */
  const PhotoStats = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Cormorant Garamond, serif' }}>
          Photo Gallery Statistics
        </Typography>
        
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading photo statistics...
          </Typography>
        ) : photoStats ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Total Photos</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {photoStats.total}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Approved Photos</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {photoStats.approved}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Pending Review</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {photoStats.pending}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No photo data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Cormorant Garamond, serif',
            color: 'var(--accent-color, #2d5c3a)'
          }}
        >
          Wedding Dashboard
        </Typography>
        
        <Button
          variant="outlined"
          onClick={exportToCSV}
          sx={{
            borderColor: 'var(--accent-color, #2d5c3a)',
            color: 'var(--accent-color, #2d5c3a)',
            '&:hover': {
              borderColor: 'var(--accent-color-dark, #1e3d27)',
              backgroundColor: 'rgba(45, 92, 58, 0.05)'
            }
          }}
        >
          Export Guest List
        </Button>
      </Box>

      {/* Messages */}
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Guests"
            value={totalInvitees}
            subtitle="All invited guests"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Attending"
            value={accepted}
            subtitle={`${totalInvitees > 0 ? Math.round((accepted / totalInvitees) * 100) : 0}% response rate`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Declined"
            value={declined}
            subtitle={`${totalInvitees > 0 ? Math.round((declined / totalInvitees) * 100) : 0}% decline rate`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={pending}
            subtitle={`${totalInvitees > 0 ? Math.round((pending / totalInvitees) * 100) : 0}% conference rate`}
          />
        </Grid>
      </Grid>

      {/* Detailed Statistics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RSVPBreakdown />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <PlusOneStats />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <PhotoStats />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Cormorant Garamond, serif' }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={exportToCSV}
                  fullWidth
                >
                  Export Guest List (CSV)
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => window.open('/gallery', '_blank')}
                  fullWidth
                >
                  View Photo Gallery
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => window.open('/admin?tab=3', '_blank')}
                  fullWidth
                >
                  Manage Photos
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedSummaryTab;





