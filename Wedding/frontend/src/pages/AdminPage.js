import React, { useState } from 'react';
import { useInvitees } from '../contexts/InviteeContext';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AdminLayout from '../components/layout/AdminLayout';
import InviteeTable from '../components/admin/InviteeTable';
import EnhancedSummaryTab from '../components/admin/EnhancedSummaryTab';
import AddInviteeForm from '../components/admin/AddInviteeForm';
import PhotoManagementTab from '../components/admin/PhotoManagementTab';
import BulkActionsToolbar from '../components/admin/BulkActionsToolbar';
import { EmailTemplateProvider } from '../contexts/EmailTemplateContext';
import EmailTab from '../components/email/EmailTab';

/**
 * Admin page component with invitee management and email capabilities
 */
const AdminPage = () => {
	const [tab, setTab] = useState(0);
	const [selectedInvitees, setSelectedInvitees] = useState([]);
	const { invitees, addInvitee, updateInvitee, removeInvitee } = useInvitees();

	return (
		<AdminLayout>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					py: 4,
					pb: 8,
				}}
			>
				<Tabs
					value={tab}
					onChange={(_, v) => setTab(v)}
					sx={{
						mb: 4,
						'& .MuiTab-root': {
							fontFamily: 'Arial, sans-serif',
							fontSize: '0.9rem',
							fontWeight: 400,
							letterSpacing: '1px',
							textTransform: 'uppercase',
							color: '#222',
							minWidth: '120px',
						},
						'& .Mui-selected': {
							color: '#222 !important',
						},
						'& .MuiTabs-indicator': {
							backgroundColor: '#222',
						},
					}}
				>
					<Tab label="Invitees" />
					<Tab label="Add Invitee" />
					<Tab label="Email" />
					<Tab label="Photos" />
					<Tab label="Summary" />
				</Tabs>

				{tab === 0 && (
					<>
						<BulkActionsToolbar
							selectedInvitees={selectedInvitees}
							onBulkUpdate={updateInvitee}
							onBulkDelete={removeInvitee}
							onClearSelection={() => setSelectedInvitees([])}
						/>
						<InviteeTable
							invitees={invitees}
							updateInvitee={updateInvitee}
							removeInvitee={removeInvitee}
							selectedInvitees={selectedInvitees}
							onSelectionChange={setSelectedInvitees}
						/>
					</>
				)}
				{tab === 1 && <AddInviteeForm addInvitee={addInvitee} />}
				{tab === 2 && (
					<EmailTemplateProvider>
						<EmailTab />
					</EmailTemplateProvider>
				)}
				{tab === 3 && <PhotoManagementTab />}
				{tab === 4 && <EnhancedSummaryTab invitees={invitees} />}
			</Box>
		</AdminLayout>
	);
};

export default AdminPage;
