/**
 * Invitee data model type definitions
 * @typedef {Object} Invitee
 * @property {string} id - Unique identifier for the invitee
 * @property {string} name - Invitee name
 * @property {string} partner - Partner's name, if any
 * @property {string} email - Invitee email address
 * @property {string} phone - Invitee phone number
 * @property {string|null} rsvp - Aggregate RSVP: 'accepted', 'declined', 'mixed', or null (pending)
 * @property {string|null} rsvpPrimary - Primary guest: 'accepted' or 'declined'
 * @property {string|null} rsvpPartner - Partner/plus-one guest when present on the same invitation row
 * @property {string|null} mealSelection - Free-text dietary requirements and allergies (RSVP)
 * @property {string|null} songRequest - Optional song request (RSVP)
 * @property {string|null} messageToCouple - Optional message to the couple (RSVP)
 */

/**
 * Constants for storage keys
 */
export const STORAGE_KEYS = {
  INVITEES: 'wedding_invitees',
};