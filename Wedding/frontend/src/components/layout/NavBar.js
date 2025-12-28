import React from 'react';
import Typography from '../ui/Typography';
import { Link, useLocation } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useInviteeNavigation } from '../../contexts/InviteeNavigationContext';

const HomeDropdown = ({ location, hasInviteeContext, inviteeId }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	
	const getHomeUrl = (path) => {
		return hasInviteeContext ? `${path}?invitee=${inviteeId}` : path;
	};
	
	return (
		<>
			<Button
				aria-controls={open ? 'home-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				sx={{ color: '#222', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontSize: '1.15rem', marginLeft: 8, marginRight: 8, zIndex: 9100, position: 'relative' }}
			>
				Home
			</Button>
			<Menu
				id="home-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{ 'aria-labelledby': 'home-button' }}
				sx={{ zIndex: 9999 }}
			>
				<MenuItem component={Link} to={getHomeUrl("/")} onClick={handleClose}>Home Modern</MenuItem>
				<MenuItem component={Link} to={getHomeUrl("/home-frosted")} onClick={handleClose}>Home Frosted</MenuItem>
				<MenuItem component={Link} to={getHomeUrl("/home-hero")} onClick={handleClose}>Home Hero</MenuItem>
				<MenuItem component={Link} to={getHomeUrl("/home-vertical")} onClick={handleClose}>Home Vertical</MenuItem>
				<MenuItem component={Link} to={getHomeUrl("/home-fullscreen")} onClick={handleClose}>Home Fullscreen</MenuItem>
				<MenuItem component={Link} to={getHomeUrl("/home-scroll")} onClick={handleClose}>Home Scroll</MenuItem>
				<MenuItem component={Link} to={getHomeUrl("/in-love")} onClick={handleClose}>So In Love</MenuItem>
			</Menu>
		</>
	);
};

const links = [
	{ to: '/our-story', label: 'Our Story' },
	{ to: '/schedule', label: 'Schedule' },
	{ to: '/registry', label: 'Registry' },
	{ to: '/faq', label: 'FAQ' },
	{ to: '/accommodation', label: 'Accommodation' },
];

const NavBar = ({ title, isMobile }) => {
	const location = useLocation();
	const { inviteeId, hasInviteeContext } = useInviteeNavigation();
	const displayTitle = title || 'Matt & Sydney';
	const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
	const mobileMenuOpen = Boolean(mobileMenuAnchor);

	const handleMobileMenuOpen = (event) => {
		setMobileMenuAnchor(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMenuAnchor(null);
	};

	const allLinks = [
		...links,
		...(hasInviteeContext ? [{ to: `/edit-details/${inviteeId}`, label: 'Edit Details' }] : [])
	];

	return (
		<AppBar position="fixed" sx={{
			background: 'rgba(255,255,255,0.85)',
			boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25)',
			alignItems: 'center',
			zIndex: 9000,
			backdropFilter: 'blur(20px) saturate(180%)',
			WebkitBackdropFilter: 'blur(20px) saturate(180%)',
			border: 'none',
			position: 'fixed',
			minHeight: { xs: '80px', sm: '100px' },
			'&:after': {
				content: '""',
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 0,
				height: '64px',
				pointerEvents: 'none',
				background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 60%, rgba(255,255,255,0) 100%)',
			},
		}}>
			<Toolbar sx={{ 
				flexDirection: 'row', 
				alignItems: 'center', 
				justifyContent: 'space-between', 
				px: { xs: 2, sm: 3 }, 
				minHeight: { xs: '80px', sm: '100px' }, 
				width: '100%',
				maxWidth: '100vw',
				overflow: 'hidden'
			}}>
				{/* Title */}
				<Typography
					variant="h4"
					component={Link}
					to={hasInviteeContext ? `/?invitee=${inviteeId}` : "/"}
					sx={{
						fontFamily: 'Great Vibes, cursive',
						color: '#222',
						textDecoration: 'none',
						fontWeight: 400,
						fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
						letterSpacing: 1,
						flexGrow: 0,
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis',
						overflow: 'hidden',
						maxWidth: { xs: '180px', sm: '220px', md: '250px' },
						minWidth: { xs: '120px', sm: '150px' }
					}}
				>
					{displayTitle}
				</Typography>

				{/* Desktop Navigation */}
				<Box sx={{ 
					display: { xs: 'none', md: 'flex' }, 
					alignItems: 'center', 
					gap: { md: 1.5, lg: 2 },
					flex: 1,
					justifyContent: 'center',
					overflow: 'hidden'
				}}>
					<HomeDropdown location={location} hasInviteeContext={hasInviteeContext} inviteeId={inviteeId} />
					{links.map(link => {
						const isActive = location.pathname === link.to;
						const linkUrl = hasInviteeContext ? `${link.to}?invitee=${inviteeId}` : link.to;
						
						return (
							<Typography
								key={link.to}
								component={Link}
								to={linkUrl}
								sx={{
									color: isActive ? 'var(--accent-color, #39834d)' : '#222',
									textDecoration: 'none',
									fontFamily: 'Cormorant Garamond, serif',
									fontWeight: 400,
									fontSize: '1.1rem',
									transition: 'color 0.2s',
									letterSpacing: 1,
									whiteSpace: 'nowrap',
									'&:hover': {
										color: 'var(--accent-color, #39834d)'
									}
								}}
							>
								{link.label}
							</Typography>
						);
					})}
					{hasInviteeContext && (
						<Typography
							component={Link}
							to={`/edit-details/${inviteeId}`}
							sx={{
								color: location.pathname === `/edit-details/${inviteeId}` ? 'var(--accent-color, #39834d)' : '#222',
								textDecoration: 'none',
								fontFamily: 'Cormorant Garamond, serif',
								fontWeight: 400,
								fontSize: '1.1rem',
								transition: 'color 0.2s',
								letterSpacing: 1,
								whiteSpace: 'nowrap',
								'&:hover': {
									color: 'var(--accent-color, #39834d)'
								}
							}}
						>
							Edit Details
						</Typography>
					)}
				</Box>

				{/* Mobile Menu Button */}
				<IconButton
					size="large"
					edge="end"
					aria-label="menu"
					aria-controls={mobileMenuOpen ? 'mobile-menu' : undefined}
					aria-haspopup="true"
					onClick={handleMobileMenuOpen}
					sx={{ 
						display: { xs: 'block', md: 'none' },
						color: '#222',
						marginLeft: 'auto'
					}}
				>
					<MenuIcon />
				</IconButton>

				{/* Mobile Menu */}
				<Menu
					id="mobile-menu"
					anchorEl={mobileMenuAnchor}
					open={mobileMenuOpen}
					onClose={handleMobileMenuClose}
					MenuListProps={{
						'aria-labelledby': 'mobile-menu-button',
					}}
					sx={{
						'& .MuiPaper-root': {
							backgroundColor: 'rgba(255,255,255,0.95)',
							backdropFilter: 'blur(20px)',
							borderRadius: 2,
							boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
						}
					}}
				>
					<MenuItem 
						component={Link} 
						to={hasInviteeContext ? `/?invitee=${inviteeId}` : "/"} 
						onClick={handleMobileMenuClose}
						sx={{ fontFamily: 'Cormorant Garamond, serif' }}
					>
						Home Modern
					</MenuItem>
					<MenuItem 
						component={Link} 
						to={hasInviteeContext ? `/home-frosted?invitee=${inviteeId}` : "/home-frosted"} 
						onClick={handleMobileMenuClose}
						sx={{ fontFamily: 'Cormorant Garamond, serif' }}
					>
						Home Frosted
					</MenuItem>
					<MenuItem 
						component={Link} 
						to={hasInviteeContext ? `/home-hero?invitee=${inviteeId}` : "/home-hero"} 
						onClick={handleMobileMenuClose}
						sx={{ fontFamily: 'Cormorant Garamond, serif' }}
					>
						Home Hero
					</MenuItem>
					<MenuItem 
						component={Link} 
						to={hasInviteeContext ? `/home-vertical?invitee=${inviteeId}` : "/home-vertical"} 
						onClick={handleMobileMenuClose}
						sx={{ fontFamily: 'Cormorant Garamond, serif' }}
					>
						Home Vertical
					</MenuItem>
					<MenuItem 
						component={Link} 
						to={hasInviteeContext ? `/home-fullscreen?invitee=${inviteeId}` : "/home-fullscreen"} 
						onClick={handleMobileMenuClose}
						sx={{ fontFamily: 'Cormorant Garamond, serif' }}
					>
						Home Fullscreen
					</MenuItem>
					<MenuItem 
						component={Link} 
						to={hasInviteeContext ? `/home-scroll?invitee=${inviteeId}` : "/home-scroll"} 
						onClick={handleMobileMenuClose}
						sx={{ fontFamily: 'Cormorant Garamond, serif' }}
					>
						Home Scroll
					</MenuItem>
					<MenuItem 
						component={Link} 
						to={hasInviteeContext ? `/in-love?invitee=${inviteeId}` : "/in-love"} 
						onClick={handleMobileMenuClose}
						sx={{ fontFamily: 'Cormorant Garamond, serif' }}
					>
						So In Love
					</MenuItem>
					{allLinks.map(link => {
						const isActive = location.pathname === link.to;
						return (
							<MenuItem 
								key={link.to}
								component={Link} 
								to={link.to} 
								onClick={handleMobileMenuClose}
								sx={{ 
									fontFamily: 'Cormorant Garamond, serif',
									color: isActive ? 'var(--accent-color, #39834d)' : '#222'
								}}
							>
								{link.label}
							</MenuItem>
						);
					})}
				</Menu>
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
