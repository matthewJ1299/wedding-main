-- Per-guest RSVP when an invitation row represents a couple (or primary + plus-one).

ALTER TABLE invitees ADD COLUMN IF NOT EXISTS "rsvpPrimary" TEXT;
ALTER TABLE invitees ADD COLUMN IF NOT EXISTS "rsvpPartner" TEXT;
