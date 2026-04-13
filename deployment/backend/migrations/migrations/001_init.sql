-- Core schema (PostgreSQL). Column names quoted where needed to match API / former SQLite row keys.

CREATE TABLE IF NOT EXISTS invitees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  partner TEXT,
  email TEXT,
  phone TEXT,
  rsvp TEXT,
  "inviteCode" TEXT,
  "allowPlusOne" BOOLEAN DEFAULT FALSE,
  "plusOneName" TEXT,
  "mealSelection" TEXT,
  "songRequest" TEXT,
  "messageToCouple" TEXT
);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  size INTEGER NOT NULL,
  "uploaderName" TEXT,
  "uploaderEmail" TEXT,
  approved BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS photos_approved_created_at ON photos (approved, "createdAt" DESC);

CREATE TABLE IF NOT EXISTS email_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT,
  "text" TEXT,
  html TEXT
);

CREATE TABLE IF NOT EXISTS themes (
  id TEXT PRIMARY KEY,
  "primary" TEXT,
  "secondary" TEXT,
  accent TEXT,
  "fontSize" INTEGER,
  "isDarkMode" BOOLEAN
);
