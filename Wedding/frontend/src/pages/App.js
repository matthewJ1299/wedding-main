
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { AuthProvider } from '../contexts/AuthContext';
import { InviteeProvider } from '../contexts/InviteeContext';
import { InviteeNavigationProvider } from '../contexts/InviteeNavigationContext';
import { ThemeProvider as CustomThemeProvider } from '../contexts/ThemeContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { EmailTemplateProvider } from '../contexts/EmailTemplateContext';
import NavBar from '../components/layout/NavBar';
import RSVPButton from '../components/layout/RSVPButton';
import HomePage from './HomePage';
import SoInLovePage from './SoInLovePage';
import OurStoryPage from './OurStoryPage';
import SchedulePage from './SchedulePage';
import RegistryPage from './RegistryPage';
import FAQPage from './FAQPage';
import InvitationPage from './InvitationPage';
import RSVPPage from './RSVPPage';
import EditDetailsPage from './EditDetailsPage';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';
import AccommodationPage from './AccommodationPage';
import GalleryPage from './GalleryPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

function App() {
	const muiTheme = createTheme({
		typography: {
			fontFamily: `'Cormorant Garamond', serif`,
		},
	});
	React.useEffect(() => {
		document.documentElement.style.backgroundColor = 'var(--page-bg, #ffffff)';
		document.body.style.backgroundColor = 'var(--page-bg, #ffffff)';
		if (typeof window !== 'undefined' && window.localStorage) {
			try {
				const savedTheme = localStorage.getItem('wedding_theme');
				if (savedTheme) {
					const parsedTheme = JSON.parse(savedTheme);
					if (parsedTheme.isDarkMode) {
						localStorage.removeItem('wedding_theme');
					}
				}
			} catch (e) {
				localStorage.removeItem('wedding_theme');
			}
		}
	}, []);
	return (
		<AuthProvider>
			<InviteeProvider>
				<InviteeNavigationProvider>
					<EmailTemplateProvider>
						<CustomThemeProvider>
							<ThemeProvider theme={muiTheme}>
								<Box
									className="page-container"
									sx={{
										overflowX: 'hidden',
										transition: 'background-color 0.3s, color 0.3s',
										minHeight: '100vh',
										width: '100%',
										maxWidth: '100vw',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'flex-start',
									}}
								>
									<NavBar />
									<Box 
										className="page-content"
										sx={{ 
											width: '100%',
											maxWidth: '100vw',
											pt: { xs: 10, sm: 12, md: 13 }, 
											pb: 4,
											px: { xs: 2, sm: 3, md: 4 },
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'flex-start',
											overflowX: 'hidden'
										}}
									>
										<Routes>
											<Route path="/" element={<HomePage />} />
											<Route path="/in-love" element={<SoInLovePage />} />
											<Route path="/our-story" element={<OurStoryPage />} />
											<Route path="/schedule" element={<SchedulePage />} />
											<Route path="/registry" element={<RegistryPage />} />
											<Route path="/faq" element={<FAQPage />} />
											<Route path="/accommodation" element={<AccommodationPage />} />
											<Route path="/gallery" element={<GalleryPage />} />
											<Route path="/invitation/:inviteCode" element={<InvitationPage />} />
											<Route path="/rsvp/:inviteCode" element={<RSVPPage />} />
											<Route path="/edit-details/:inviteeId" element={<EditDetailsPage />} />
											<Route path="/login" element={<LoginPage />} />
											<Route 
												path="/admin" 
												element={
													<ProtectedRoute>
														<AdminPage />
													</ProtectedRoute>
												} 
											/>
											<Route path="*" element={<Navigate to="/" replace />} />
										</Routes>
									</Box>
									<RSVPButton />
									{/* Theme selector removed */}
								</Box>
							</ThemeProvider>
						</CustomThemeProvider>
					</EmailTemplateProvider>
				</InviteeNavigationProvider>
			</InviteeProvider>
		</AuthProvider>
	);
}

export default App;

