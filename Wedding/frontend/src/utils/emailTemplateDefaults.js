import { WEDDING_DATE, WEDDING_VENUE, APP_URLS, RSVP_CONFIG } from './constants';

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
