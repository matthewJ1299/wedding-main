import { WEDDING_DATE, WEDDING_VENUE, APP_URLS, RSVP_CONFIG } from './constants';

/**
 * Merge fields for a single invitee (Admin send, RSVP confirmation email, etc.).
 * @param {object} invitee - Invitee record (expects `id`, `name`, `partner`, …)
 * @param {Record<string, string>} [overrides] - Shallow overrides (e.g. updated `partner` or `rsvp`)
 * @returns {Record<string, string>}
 */
export function getGuestEmailMergeFields(invitee, overrides = {}) {
  if (!invitee || typeof invitee !== 'object') {
    return { ...getEmailTemplateMergeDefaults() };
  }
  const inv = { ...invitee, ...overrides };
  const siteBase = (APP_URLS.SITE_URL || '').replace(/\/+$/, '');
  const id = inv.id;
  const invitationLink = id ? `${siteBase}/invitation/${id}` : '';
  const rsvpLink = id ? `${siteBase}/rsvp/${id}` : '';
  return {
    ...getEmailTemplateMergeDefaults(),
    guestName: inv.name || '',
    guestPartner: inv.partner || '',
    email: inv.email || '',
    phone: inv.phone || '',
    rsvp: inv.rsvp || 'pending',
    rsvpLink,
    invitationLink,
    name: inv.name || '',
    partner: inv.partner || '',
  };
}

/**
 * Static merge fields shared by all transactional templates (dates, venue, site URL).
 * Guest-specific fields (guestName, rsvpLink, …) are layered on top by callers.
 * @returns {Record<string, string>}
 */
export function getEmailTemplateMergeDefaults() {
  const siteBase = (APP_URLS.SITE_URL || '').replace(/\/+$/, '');
  const when = new Date(WEDDING_DATE);
  const weddingDate = when.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const weddingTime = when.toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const rsvpDeadline = new Date(`${RSVP_CONFIG.DEADLINE}T12:00:00`).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    weddingDate,
    weddingTime,
    weddingLocation: WEDDING_VENUE.name,
    eventAddress: WEDDING_VENUE.location,
    websiteLink: siteBase,
    rsvpDeadline,
  };
}
