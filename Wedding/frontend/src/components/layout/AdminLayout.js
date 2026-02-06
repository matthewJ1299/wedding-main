import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/admin.css';

/**
 * Layout wrapper for admin pages with admin-specific header.
 * No guest NavBar or HeaderNavigation.
 */
const AdminLayout = ({ children }) => {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<Box className="admin-layout" sx={{ minHeight: '100vh', background: 'var(--page-bg, #fff)' }}>
			<AppBar
				position="static"
				sx={{
					background: 'rgba(45, 92, 58, 0.95)',
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
				}}
			>
				<Toolbar
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'space-between',
						alignItems: 'center',
						px: { xs: 2, sm: 3 },
						minHeight: { xs: 56, sm: 64 },
						gap: 1,
					}}
				>
					<Typography
						variant="h6"
						component="span"
						sx={{
							fontFamily: 'Cormorant Garamond, serif',
							fontWeight: 600,
							color: '#fff',
							fontSize: { xs: '1.1rem', sm: '1.25rem' },
						}}
					>
						Wedding Admin
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
						<Button
							component={Link}
							to="/"
							sx={{
								color: '#fff',
								fontFamily: 'Cormorant Garamond, serif',
								'&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
							}}
						>
							Home
						</Button>
						<Button
							onClick={handleLogout}
							sx={{
								color: '#fff',
								fontFamily: 'Cormorant Garamond, serif',
								'&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
							}}
						>
							Logout
						</Button>
					</Box>
				</Toolbar>
			</AppBar>
			<Box
				sx={{
					p: { xs: 2, sm: 3 },
					maxWidth: 1400,
					mx: 'auto',
					width: '100%',
					boxSizing: 'border-box',
				}}
			>
				{children}
			</Box>
		</Box>
	);
};

export default AdminLayout;
