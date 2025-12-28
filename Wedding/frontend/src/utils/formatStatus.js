// Utility to format RSVP status for display
export function formatStatus(status) {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
