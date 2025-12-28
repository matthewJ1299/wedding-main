import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvitees } from '../contexts/InviteeContext';
import { useInviteeNavigation } from '../contexts/InviteeNavigationContext';
import { sendEmail } from '../services/emailService';
import { generateApprovalLink } from '../services/approvalService';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '../components/ui/Typography';

/**
 * Page for invitees to edit their details
 */
const EditDetailsPage = () => {
  const { inviteeId } = useParams();
  const navigate = useNavigate();
  const { invitees } = useInvitees();
  const { hasInviteeContext } = useInviteeNavigation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Find the invitee
  const invitee = invitees.find((inv) => inv.id === inviteeId);

  // Redirect if no invitee context or invitee not found
  useEffect(() => {
    if (!hasInviteeContext || !invitee) {
      navigate('/');
    } else {
      // Pre-populate form with current data
      setName(invitee.name || '');
      setEmail(invitee.email || '');
      setPhone(invitee.phone || '');
    }
  }, [hasInviteeContext, invitee, navigate]);

  /**
   * Validates email format
   */
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /**
   * Handle form submission - now sends approval request instead of direct update
   */
  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    
    // Validate required fields
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    
    // Validate email format
    if (!isValidEmail(email.trim())) {
      setError('Invalid email address.');
      return;
    }
    
    // Validate phone (optional): allow + and digits, max 15 digits total excluding +
    if (phone && !/^\+?\d{1,15}$/.test(phone.trim())) {
      setError('Invalid phone number. Use digits with optional + and max 15 digits.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if details were changed
      const detailsChanged = (email !== invitee.email) || (phone !== invitee.phone) || (name !== invitee.name);
      
      if (detailsChanged) {
        // Prepare the changes object
        const changes = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim()
        };
        
        // Generate approval link
        const approvalLink = generateApprovalLink(invitee.id, changes);
        
        // Send email notification to admin with approval link
        await sendEmail({
          to: 'matthew.j@live.com',
          subject: 'Invitee Details Change Request - Approval Required',
          text: `Invitee ${invitee.name} has requested to update their details:\n\nRequested changes:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nOriginal details:\nName: ${invitee.name}\nEmail: ${invitee.email}\nPhone: ${invitee.phone}\n\nTo approve these changes, click the link below:\n${approvalLink}\n\nNote: Changes will not be applied until you approve them.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Invitee Details Change Request</h2>
              <p>Invitee <strong>${invitee.name}</strong> has requested to update their details:</p>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #2e7d32; margin-top: 0;">Requested Changes:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
              </div>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #856404; margin-top: 0;">Original Details:</h3>
                <p><strong>Name:</strong> ${invitee.name}</p>
                <p><strong>Email:</strong> ${invitee.email}</p>
                <p><strong>Phone:</strong> ${invitee.phone}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${approvalLink}" 
                   style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Approve Changes
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                <strong>Note:</strong> Changes will not be applied until you approve them by clicking the link above.
              </p>
            </div>
          `
        });
        
        setSuccess('Change request sent successfully! You will be notified once the changes are approved.');
      } else {
        setSuccess('No changes detected. Details are already up to date.');
      }
      
      // Redirect to invitation page after a short delay
      setTimeout(() => {
        navigate(`/invitation/${inviteeId}`);
      }, 3000);
      
    } catch (err) {
      console.error('Failed to send change request:', err);
      setError('Failed to send change request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!invitee) {
    return null; // Will redirect in useEffect
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        background: 'var(--secondary-color)',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Great Vibes, cursive',
              color: '#2d5c3a',
              textAlign: 'center',
              mb: 3,
            }}
          >
            Edit Your Details
          </Typography>
          
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            type="email"
          />
          
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Optional"
          />
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/invitation/${inviteeId}`)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #232323 80%, #3e5c3a 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3e5c3a 80%, #232323 100%)',
                },
              }}
            >
              {loading ? 'Updating...' : 'Update Details'}
            </Button>
          </Box>
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditDetailsPage;

