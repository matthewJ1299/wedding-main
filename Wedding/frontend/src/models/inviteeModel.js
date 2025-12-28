/**
 * Invitee data model type definitions
 * @typedef {Object} Invitee
 * @property {string} id - Unique identifier for the invitee
 * @property {string} name - Invitee name
 * @property {string} partner - Partner's name, if any
 * @property {string} email - Invitee email address
 * @property {string} phone - Invitee phone number
 * @property {string|null} rsvp - RSVP status: 'accepted', 'declined', or null (pending)
 */

/**
 * Dummy invitees for development/demo purposes
 */
export const DUMMY_INVITEES = [
  // Couples (6 people, 3 pairs)
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'John Doe',
    partner: 'Jane Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    rsvp: null,
    allowPlusOne: true,
  },
  {
    id: 'b2c3d4e5-f6a1-8901-bcde-f23456789012',
    name: 'Jane Doe',
    partner: 'John Doe',
    email: 'jane@example.com',
    phone: '123-456-7891',
    rsvp: null,
    allowPlusOne: false,
  },
  {
    id: 'c3d4e5f6-a1b2-9012-cdef-345678901234',
    name: 'Mike Ross',
    partner: 'Rachel Zane',
    email: 'mike@example.com',
    phone: '321-654-0987',
    rsvp: 'accepted',
    allowPlusOne: true,
  },
  {
    id: 'd4e5f6a1-b2c3-0123-def4-456789012345',
    name: 'Rachel Zane',
    partner: 'Mike Ross',
    email: 'rachel@example.com',
    phone: '321-654-0988',
    rsvp: 'accepted',
    allowPlusOne: false,
  },
  {
    id: 'e5f6a1b2-c3d4-1234-ef56-567890123456',
    name: 'Tom Hanks',
    partner: 'Rita Wilson',
    email: 'tom@example.com',
    phone: '555-555-5555',
    rsvp: null,
    allowPlusOne: true,
  },
  {
    id: 'f6a1b2c3-d4e5-2345-f678-678901234567',
    name: 'Rita Wilson',
    partner: 'Tom Hanks',
    email: 'rita@example.com',
    phone: '555-555-5556',
    rsvp: null,
    allowPlusOne: false,
  },
  // Singles (4 people)
  {
    id: 'a7b8c9d0-e1f2-3456-abcd-789012345678',
    name: 'Alice Smith',
    partner: '',
    email: 'alice@example.com',
    phone: '234-567-8901',
    rsvp: 'accepted',
    allowPlusOne: true,
  },
  {
    id: 'b8c9d0e1-f2a3-4567-bcde-890123456789',
    name: 'Bob Brown',
    partner: '',
    email: 'bob@example.com',
    phone: '345-678-9012',
    rsvp: null,
    allowPlusOne: false,
  },
  {
    id: 'c9d0e1f2-a3b4-5678-cdef-901234567890',
    name: 'Cathy Green',
    partner: '',
    email: 'cathy@example.com',
    phone: '456-789-0123',
    rsvp: null,
    allowPlusOne: true,
  },
  {
    id: 'd0e1f2a3-b4c5-6789-def0-012345678901',
    name: 'David Black',
    partner: '',
    email: 'david@example.com',
    phone: '567-890-1234',
    rsvp: null,
    allowPlusOne: false,
  },
];

/**
 * Constants for storage keys
 */
export const STORAGE_KEYS = {
  INVITEES: 'wedding_invitees',
};