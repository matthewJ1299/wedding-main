/**
 * Admin styles using MUI's styled API
 * This replaces the previous admin.css file
 */
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FONT_FAMILIES } from '../utils/fontLoader';
import { COLORS, SPACING } from './styleConstants';

// Main container for admin pages
export const AdminContainer = styled(Box)(({ theme }) => ({
  maxWidth: 'unset',
  margin: '0 auto',
  padding: `${SPACING.XL} 0`,
}));

// Container for admin data tables
export const AdminTableContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  margin: `${SPACING.MD} 0`,
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  borderRadius: '4px',
}));

// Admin link styling
export const AdminLink = styled(Typography)(({ theme }) => ({
  color: `${COLORS.PRIMARY.MAIN} !important`,
  textDecoration: 'underline',
  fontWeight: 500,
  cursor: 'pointer',
  '&:hover': {
    color: `${COLORS.PRIMARY.DARK} !important`,
  }
}));

// Admin section container
export const AdminSection = styled(Box)(({ theme }) => ({
  marginBottom: SPACING.XL,
  padding: SPACING.LG,
  backgroundColor: COLORS.BACKGROUND.LIGHT,
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}));

// Admin section header
export const AdminSectionHeader = styled(Typography)(({ theme }) => ({
  fontFamily: FONT_FAMILIES.PRIMARY,
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: SPACING.MD,
  borderBottom: `1px solid ${COLORS.SECONDARY.MAIN}`,
  paddingBottom: SPACING.XS,
}));

// Apply admin background style via a function
export const applyAdminBackground = () => {
  if (typeof document !== 'undefined') {
    document.body.style.background = 'linear-gradient(135deg, #fffbe6 80%, #f5f5dc 100%)';
    document.body.style.fontFamily = FONT_FAMILIES.PRIMARY;
  }
};

// Remove admin background style
export const removeAdminBackground = () => {
  if (typeof document !== 'undefined') {
    document.body.style.background = '';
    document.body.style.fontFamily = '';
  }
};