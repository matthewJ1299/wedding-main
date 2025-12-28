const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function fetchInvitees() {
	const res = await fetch(`${API_BASE}/api/invitees`);
	if (!res.ok) throw new Error('Failed to fetch invitees');
	return res.json();
}

export async function createInvitee(invitee) {
	const res = await fetch(`${API_BASE}/api/invitees`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(invitee),
	});
	if (!res.ok) throw new Error('Failed to create invitee');
	return res.json();
}

export async function updateInviteeApi(id, updates) {
	const res = await fetch(`${API_BASE}/api/invitees/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(updates),
	});
	if (!res.ok) throw new Error('Failed to update invitee');
	return res.json();
}

export async function deleteInvitee(id) {
	const res = await fetch(`${API_BASE}/api/invitees/${id}`, { method: 'DELETE' });
	if (!res.ok) throw new Error('Failed to delete invitee');
	return res.json();
}

export async function seedInvitees() {
	const res = await fetch(`${API_BASE}/api/seed`, { method: 'POST' });
	if (!res.ok) throw new Error('Failed to seed invitees');
	return res.json();
}
