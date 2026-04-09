/**
 * Service for handling invitee detail change approvals
 */

import { apiFetch } from './apiFetch';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * @param {string} inviteeId
 * @param {object} changes
 * @returns {Promise<object>}
 */
export async function approveInviteeChanges(inviteeId, changes) {
  return apiFetch(`${API_BASE}/api/approve-invitee-changes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inviteeId, changes }),
  });
}

/**
 * @param {string} inviteeId
 * @param {object} changes
 * @returns {string}
 */
export function generateApprovalLink(inviteeId, changes) {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const encodedChanges = encodeURIComponent(JSON.stringify(changes));
  return `${baseUrl}/api/approve-invitee-changes?inviteeId=${inviteeId}&changes=${encodedChanges}`;
}
