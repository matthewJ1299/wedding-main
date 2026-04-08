import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

const SHOW =
	String(process.env.REACT_APP_SHOW_LANDING_POPUP || '').toLowerCase() ===
	'true';

/**
 * Build-time flag: set REACT_APP_SHOW_LANDING_POPUP=true (e.g. in Coolify) and rebuild the frontend.
 * Optional REACT_APP_LANDING_POPUP_MESSAGE overrides the body text.
 */
export default function LandingNoticeDialog() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (SHOW) {
			setOpen(true);
		}
	}, []);

	if (!SHOW) {
		return null;
	}

	const message =
		process.env.REACT_APP_LANDING_POPUP_MESSAGE ||
		'This deployment has the landing notice enabled. Set REACT_APP_SHOW_LANDING_POPUP to false and rebuild to hide it.';

	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
			maxWidth="sm"
			fullWidth
			disableEscapeKeyDown={false}
		>
			<DialogTitle sx={{ bgcolor: '#b71c1c', color: '#fff', fontWeight: 600 }}>
				Notice
			</DialogTitle>
			<DialogContent sx={{ pt: 2 }}>
				<Typography component="p" variant="body1">
					{message}
				</Typography>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button onClick={() => setOpen(false)} variant="contained" color="error">
					Dismiss
				</Button>
			</DialogActions>
		</Dialog>
	);
}
