import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { formatStatus } from '../../utils/formatStatus';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import AddInviteeForm from './AddInviteeForm';

/**
 * Table component for managing invitees in the admin panel
 */
const InviteeTable = ({ invitees, addInvitee, updateInvitee, removeInvitee }) => {
	const [editId, setEditId] = useState(null);
	const [editData, setEditData] = useState({});
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [addOpen, setAddOpen] = useState(false);

	const asText = (value) => (value === null || value === undefined ? '' : String(value));

	// Start editing an invitee
	const startEdit = (invitee) => {
		setEditId(invitee.id);
		setEditData({ ...invitee });
	};

	// Handle change in an edit field
	const handleChange = (field, value) => {
		setEditData((prev) => ({ ...prev, [field]: value }));
	};

	// Save the edited invitee data
	const saveEdit = () => {
		updateInvitee(editId, editData);
		setEditId(null);
	};

	// Group couples by partner name
	const grouped = [];
	const usedIds = new Set();
	invitees.forEach((inv) => {
		if (usedIds.has(inv.id)) return;
		const partnerName = (inv.partner || '').trim();
		if (!partnerName) return;

		const partner = invitees.find(
			(i) =>
				i.id !== inv.id &&
				(i.name || '').trim().toLowerCase() === partnerName.toLowerCase() &&
				!usedIds.has(i.id)
		);

		if (partner) {
			grouped.push([inv, partner]);
			usedIds.add(inv.id);
			usedIds.add(partner.id);
			return;
		}

		// If partner/plus-one exists but is not a standalone invitee record,
		// render a linked second row so couples still show as a pair.
		grouped.push([
			inv,
			{
				id: `${inv.id}__linked_plus_one`,
				name: partnerName,
				partner: inv.name || '',
				email: inv.plusOneEmail || '',
				phone: inv.plusOnePhone || '',
				rsvp: inv.rsvp || null,
				isLinkedPlusOne: true,
				linkedInviteeId: inv.id,
			},
		]);
		usedIds.add(inv.id);
	});
	// Add singles
	invitees.forEach((inv) => {
		if (!usedIds.has(inv.id)) grouped.push([inv]);
	});

	// Paginate by grouped invitees (couples/singles)
	const totalGroups = grouped.length;
	const totalPages = pageSize === 'all' ? 1 : Math.ceil(totalGroups / pageSize);
	const pagedGroups = pageSize === 'all' ? grouped : grouped.slice(page * pageSize, (page + 1) * pageSize);

  const exportCsv = (statusFilter = 'all') => {
    const rows = invitees.filter((i) => {
      if (statusFilter === 'all') return true;
      const s = (i.rsvp || 'pending').toLowerCase();
      return s === statusFilter;
    });
    const exportSpec = [
      ['name', 'name'],
      ['partner', 'partner'],
      ['email', 'email'],
      ['phone', 'phone'],
      ['rsvp', 'rsvp'],
      ['allowPlusOne', 'allowPlusOne'],
      ['mealSelection', 'dietaryRequirementsAndAllergies'],
      ['songRequest', 'songRequest'],
      ['messageToCouple', 'messageToCouple'],
    ];
    const headers = exportSpec.map(([, label]) => label);
    const csv = [headers.join(',')]
      .concat(
        rows.map((r) => exportSpec.map(([key]) => JSON.stringify(r[key] ?? '')).join(','))
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invitees_${statusFilter}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleExport = (status) => { handleMenuClose(); exportCsv(status); };

  // Calculate statistics
  const coupleCount = grouped.filter(g => g.length === 2).length;
  const singleCount = grouped.filter(g => g.length === 1).length;
  const totalPeople = invitees.length;

  return (
		<>
			{/* Statistics Summary */}
			<Box sx={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				alignItems: 'center', 
				mb: 2, 
				p: 2, 
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				borderRadius: '8px',
				color: 'white'
			}}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<FavoriteIcon sx={{ fontSize: '1.5rem' }} />
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
							Guest Statistics
						</Typography>
						<Typography variant="body2" sx={{ opacity: 0.9 }}>
							{coupleCount} couples • {singleCount} singles • {totalPeople} total guests
						</Typography>
					</Box>
				</Box>
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Chip 
						label={`${coupleCount} Couples`} 
						sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} 
					/>
					<Chip 
						label={`${singleCount} Singles`} 
						sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} 
					/>
				</Box>
			</Box>

			{/* Export actions */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 1, width: '100%' }}>
				<Button
					size="small"
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => setAddOpen(true)}
					disabled={!addInvitee}
				>
					Add invitee
				</Button>
				<Box sx={{ display: 'flex', gap: 1 }}>
				<Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={handleMenuOpen}>
					Export CSV
				</Button>
				<Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
					<MenuItem onClick={() => handleExport('all')}>All</MenuItem>
					<MenuItem onClick={() => handleExport('accepted')}>Accepted</MenuItem>
					<MenuItem onClick={() => handleExport('declined')}>Declined</MenuItem>
					<MenuItem onClick={() => handleExport('pending')}>Pending</MenuItem>
				</Menu>
				</Box>
			</Box>

			<Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Add invitee</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 1 }}>
						<AddInviteeForm
							addInvitee={addInvitee}
							hideTitle
							onAdded={() => setAddOpen(false)}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={() => setAddOpen(false)}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
			<TableContainer 
				component={Paper} 
				sx={{ 
					mb: 1.5, 
					width: '100%', 
					borderRadius: 0, 
					boxShadow: 'none',
					overflow: 'auto',
					maxHeight: { xs: 400, sm: 600 }
				}}
			>
				<Table sx={{ minWidth: { xs: '800px', sm: 'auto' } }}>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Name</TableCell>
							<TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Partner</TableCell>
							<TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Email</TableCell>
							<TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Phone</TableCell>
							<TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>RSVP</TableCell>
							<TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Invite Link</TableCell>
							<TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{pagedGroups.map((group) => (
							group.length === 2 ? (
								<React.Fragment key={group[0].id + '-' + group[1].id}>
									{/* Couple Header Row */}
									<TableRow sx={{ 
										background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)',
										borderRadius: '8px 8px 0 0',
										'& td': { 
											border: 'none',
											color: 'white',
											fontWeight: 'bold',
											fontSize: '0.9rem',
											textAlign: 'center',
											py: 1
										}
									}}>
										<TableCell colSpan={10} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
											<FavoriteIcon sx={{ fontSize: '1.2rem' }} />
											<span>Couple: {group[0].name} & {group[1].name}</span>
											<FavoriteIcon sx={{ fontSize: '1.2rem' }} />
										</TableCell>
									</TableRow>
									{[group[0], group[1]].map((invitee, idx) => (
										<TableRow
											key={invitee.id}
											sx={{
												background: idx === 0 ? '#fff5f8' : '#f8f0f2',
												borderLeft: '4px solid #ff6b9d',
												borderRight: '1px solid #e0e0e0',
												borderTop: 'none',
												borderBottom: idx === 1 ? '2px solid #ff6b9d' : '1px solid #e0e0e0',
												position: 'relative',
												'&:hover': {
													background: idx === 0 ? '#ffeef2' : '#f5e8eb',
													transform: 'translateX(2px)',
													transition: 'all 0.2s ease'
												}
											}}
										>
											{editId === invitee.id ? (
												<React.Fragment>
													<TableCell>
                                                    <TextField value={editData.name || ''} onChange={(e) => handleChange('name', e.target.value.trimStart())} size="small" />
													</TableCell>
													<TableCell>
                                                    <TextField value={editData.partner || ''} onChange={(e) => handleChange('partner', e.target.value.trimStart())} size="small" />
													</TableCell>
													<TableCell>
                                                    <TextField value={editData.email || ''} onChange={(e) => handleChange('email', e.target.value.trimStart())} size="small" />
													</TableCell>
													<TableCell>
                                                    <TextField value={editData.phone || ''} onChange={(e) => handleChange('phone', e.target.value.trimStart())} size="small" />
													</TableCell>
													<TableCell>
														<TextField value={editData.rsvp || ''} onChange={(e) => handleChange('rsvp', e.target.value)} size="small" />
													</TableCell>
													<TableCell>
														<Button component={Link} to={`/invitation/${group[0].id}`}>View</Button>
													</TableCell>
                                                  <TableCell>
                                                        <Button onClick={saveEdit}>Save</Button>
                                                        <Button onClick={() => setEditId(null)}>Cancel</Button>
                                                        <Button color="error" onClick={() => removeInvitee(invitee.id)}>Delete</Button>
                                                  </TableCell>
												</React.Fragment>
											) : (
												<React.Fragment>
													<TableCell>
														<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
															<PersonIcon sx={{ fontSize: '1rem', color: '#ff6b9d' }} />
															<span style={{ fontWeight: '500' }}>{asText(invitee.name)}</span>
															{invitee.isLinkedPlusOne ? (
																<Chip label="Plus One" size="small" sx={{ bgcolor: '#c44569', color: 'white', fontSize: '0.7rem' }} />
															) : idx === 0 ? (
																<Chip label="Partner 1" size="small" sx={{ bgcolor: '#ff6b9d', color: 'white', fontSize: '0.7rem' }} />
															) : (
																<Chip label="Partner 2" size="small" sx={{ bgcolor: '#c44569', color: 'white', fontSize: '0.7rem' }} />
															)}
														</Box>
													</TableCell>
													<TableCell>
														<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
															<FavoriteIcon sx={{ fontSize: '0.8rem', color: '#ff6b9d' }} />
															<span style={{ fontStyle: 'italic', color: '#666' }}>{asText(invitee.partner)}</span>
														</Box>
													</TableCell>
													<TableCell>{asText(invitee.email)}</TableCell>
													<TableCell>{asText(invitee.phone)}</TableCell>
													<TableCell>{formatStatus(invitee.rsvp)}</TableCell>
													<TableCell>
														{invitee.isLinkedPlusOne ? (
															<span style={{ color: '#999', fontStyle: 'italic' }}>Linked</span>
														) : (
															<Button component={Link} to={`/invitation/${group[0].id}`}>View</Button>
														)}
													</TableCell>
													<TableCell>
														{invitee.isLinkedPlusOne ? (
															<span style={{ color: '#999', fontStyle: 'italic' }}>Edit primary row</span>
														) : (
															<Button onClick={() => startEdit(invitee)}>Edit</Button>
														)}
													</TableCell>
												</React.Fragment>
											)}
										</TableRow>
									))}
								</React.Fragment>
							) : (
            <TableRow 
								key={group[0].id}
								sx={{
									background: '#f8f9fa',
									borderLeft: '4px solid #6c757d',
									'&:hover': {
										background: '#e9ecef',
										transform: 'translateX(2px)',
										transition: 'all 0.2s ease'
									}
								}}
							>
									{editId === group[0].id ? (
										<React.Fragment>
											<TableCell>
                                                <TextField value={editData.name || ''} onChange={(e) => handleChange('name', e.target.value.trimStart())} size="small" />
											</TableCell>
											<TableCell>
                                                <TextField value={editData.partner || ''} onChange={(e) => handleChange('partner', e.target.value.trimStart())} size="small" />
											</TableCell>
											<TableCell>
                                                <TextField value={editData.email || ''} onChange={(e) => handleChange('email', e.target.value.trimStart())} size="small" />
											</TableCell>
											<TableCell>
                                                <TextField value={editData.phone || ''} onChange={(e) => handleChange('phone', e.target.value.trimStart())} size="small" />
											</TableCell>
											<TableCell>
												<TextField value={editData.rsvp || ''} onChange={(e) => handleChange('rsvp', e.target.value)} size="small" />
											</TableCell>
											<TableCell>
												<Button component={Link} to={`/invitation/${editId || editData.id || ''}`}>View</Button>
											</TableCell>
                                            <TableCell>
                                                <Button onClick={saveEdit}>Save</Button>
                                                <Button onClick={() => setEditId(null)}>Cancel</Button>
                                                <Button color="error" onClick={() => removeInvitee(group[0].id)}>Delete</Button>
                                            </TableCell>
										</React.Fragment>
									) : (
										<React.Fragment>
											<TableCell>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<PersonIcon sx={{ fontSize: '1rem', color: '#6c757d' }} />
													<span style={{ fontWeight: '500' }}>{asText(group[0].name)}</span>
													<Chip label="Single" size="small" sx={{ bgcolor: '#6c757d', color: 'white', fontSize: '0.7rem' }} />
												</Box>
											</TableCell>
											<TableCell>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													{group[0].partner ? (
														<>
															<FavoriteIcon sx={{ fontSize: '0.8rem', color: '#ff6b9d' }} />
															<span style={{ fontStyle: 'italic', color: '#666' }}>{asText(group[0].partner)}</span>
														</>
													) : (
														<span style={{ color: '#999', fontStyle: 'italic' }}>No partner</span>
													)}
												</Box>
											</TableCell>
											<TableCell>{asText(group[0].email)}</TableCell>
											<TableCell>{asText(group[0].phone)}</TableCell>
											<TableCell>{formatStatus(group[0].rsvp)}</TableCell>
											<TableCell>
												<Button component={Link} to={`/invitation/${group[0].id}`}>View</Button>
											</TableCell>
											<TableCell>
												<Button onClick={() => startEdit(group[0])}>Edit</Button>
											</TableCell>
										</React.Fragment>
									)}
								</TableRow>
							)
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Bottom subtle, right-aligned pagination */}
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mt: 2, opacity: 0.8 }}>
				{pageSize !== 'all' && (
					<>
						<IconButton size="small" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous page">
							<ChevronLeft fontSize="small" />
						</IconButton>
						<span style={{ fontSize: 12 }}>Page {page + 1} of {totalPages}</span>
						<IconButton size="small" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} aria-label="Next page">
							<ChevronRight fontSize="small" />
						</IconButton>
					</>
				)}
				{/* Compact page size buttons without label */}
				<Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
					<Button size="small" variant={pageSize === 10 ? 'contained' : 'outlined'} onClick={() => { setPageSize(10); setPage(0); }}>10</Button>
					<Button size="small" variant={pageSize === 20 ? 'contained' : 'outlined'} onClick={() => { setPageSize(20); setPage(0); }}>20</Button>
					<Button size="small" variant={pageSize === 'all' ? 'contained' : 'outlined'} onClick={() => { setPageSize('all'); setPage(0); }}>All</Button>
				</Box>
			</Box>
		</>
	);
};

export default InviteeTable;