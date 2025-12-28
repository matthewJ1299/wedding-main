/**
 * Service for handling invitee detail change approvals
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Send a request to approve invitee changes
 * @param {string} inviteeId - The ID of the invitee
 * @param {Object} changes - The changes to approve
 * @returns {Promise<Object>} The response from the server
 */
export async function approveInviteeChanges(inviteeId, changes) {
  const res = await fetch(`${API_BASE}/api/approve-invitee-changes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inviteeId, changes }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to approve changes');
  }
  
  return res.json();
}

/**
 * Generate approval link for email
 * @param {string} inviteeId - The ID of the invitee
 * @param {Object} changes - The changes to approve
 * @returns {string} The approval link
 */
export function generateApprovalLink(inviteeId, changes) {
  // Use the backend API URL for approval links
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const encodedChanges = encodeURIComponent(JSON.stringify(changes));
  return `${baseUrl}/api/approve-invitee-changes?inviteeId=${inviteeId}&changes=${encodedChanges}`;
}
