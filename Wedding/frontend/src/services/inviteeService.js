import { apiFetch } from './apiFetch';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function fetchInvitees() {
  return apiFetch(`${API_BASE}/api/invitees`);
}

export async function createInvitee(invitee) {
  return apiFetch(`${API_BASE}/api/invitees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invitee),
  });
}

export async function updateInviteeApi(id, updates) {
  return apiFetch(`${API_BASE}/api/invitees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteInvitee(id) {
  return apiFetch(`${API_BASE}/api/invitees/${id}`, { method: 'DELETE' });
}

export async function seedInvitees() {
  return apiFetch(`${API_BASE}/api/seed`, { method: 'POST' });
}
