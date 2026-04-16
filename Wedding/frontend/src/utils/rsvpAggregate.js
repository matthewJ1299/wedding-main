/**
 * Derive a single invitee `rsvp` field from per-guest responses.
 * @param {string|null|undefined} rsvpPrimary - 'accepted' | 'declined' | null
 * @param {string|null|undefined} rsvpPartner - 'accepted' | 'declined' | null (omit when no second guest)
 * @returns {string|null}
 */
export function deriveAggregateRsvp(rsvpPrimary, rsvpPartner) {
  const primary = rsvpPrimary || null;
  const partner = rsvpPartner || null;
  if (!partner) {
    return primary;
  }
  if (!primary) {
    return null;
  }
  if (primary === 'accepted' && partner === 'accepted') {
    return 'accepted';
  }
  if (primary === 'declined' && partner === 'declined') {
    return 'declined';
  }
  return 'mixed';
}
