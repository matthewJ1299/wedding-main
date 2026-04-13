-- Optional note from guest when RSVPing (any response).
ALTER TABLE invitees ADD COLUMN IF NOT EXISTS "messageToCouple" TEXT;
