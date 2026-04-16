import React from 'react';
import Card from '../ui/Card';
import Box from '@mui/material/Box';

const SummaryTab = ({ invitees }) => {
	const total = invitees.length;
	const accepted = invitees.filter((i) => (i.rsvp || '').toLowerCase() === 'accepted').length;
	const mixed = invitees.filter((i) => (i.rsvp || '').toLowerCase() === 'mixed').length;
	const declined = invitees.filter((i) => (i.rsvp || '').toLowerCase() === 'declined').length;
	const pending = total - accepted - mixed - declined;

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
			<Card style={{ padding: 24, maxWidth: 520, textAlign: 'center' }}>
				<div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Summary</div>
				<div style={{ fontSize: 14, lineHeight: 1.8 }}>
					<strong>Total:</strong> {total} &nbsp; | &nbsp;
					<strong>Pending:</strong> {pending} &nbsp; | &nbsp;
					<strong>Accepted:</strong> {accepted} &nbsp; | &nbsp;
					<strong>Mixed:</strong> {mixed} &nbsp; | &nbsp;
					<strong>Declined:</strong> {declined}
				</div>
			</Card>
		</Box>
	);
};

export default SummaryTab;
