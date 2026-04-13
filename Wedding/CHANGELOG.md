# Changelog

## Unreleased
- **Header navigation**: Added **HOME** as the first item in the main top nav (desktop and mobile drawer); links to `/` with existing `?invitee=` context when present, and smooth-scrolls to top when already on the home page.
- **Email templates / Coolify**: Legacy `tpl-welcome-1` and `tpl-rsvp-reminder-1` removed from `DEFAULT_EMAIL_TEMPLATES` (only the three Canva layouts remain). Invite/RSVP email HTML primary button uses **`{rsvpLink}`** and label **RSVP** (not `{websiteLink}` / “Website”). Set **`REPLACE_EMAIL_TEMPLATES=true`** on the backend container to run `src/db/reseed-email-templates.mjs` on startup (after migrations): deletes **all** `email_templates` rows and inserts defaults — use on Coolify when you do not need old rows; turn off after the first deploy if you edit templates in admin.
- **Canva email templates in DB**: Stripped RTF from `Wedding/invite.html`, `rsvpyes.html`, and `rsvpno.txt`, normalized merge fields including `{guestName}`, `{rsvpLink}`, `{weddingDate}`, `{weddingTime}`, `{weddingLocation}`, `{eventAddress}`, `{rsvpDeadline}`. Added `backend/src/utils/rtfEmailHtmlStripper.js`, `npm run email-templates:generate` (writes clean HTML back to `Wedding/` and refreshes `src/seed/generatedEmailBodies.js`). **Empty DB**: GET `/api/email-templates` seeds the three Canva rows only.
- **Email merge defaults**: `frontend/src/utils/emailTemplateDefaults.js` supplies shared fields from `constants.js`; `EmailTemplateContext.prepareTemplate` merges them so subjects/bodies resolve even when only guest-specific keys are passed.
- `POST /api/send-email` returns explicit `missingFields` and a clear error when `to`, `subject`, or body is missing; HTML-only payloads are accepted (`text` may be empty if `html` is non-empty). Plain text for SMTP is derived from HTML when `text` is omitted.
- Client `apiFetch` error toasts include `missingFields` when the API returns them.
- Gate invitee API loading to only routes that require it (admin/invitation/rsvp/edit-details), preventing pre-login/background API calls on unrelated pages.
- Restrict invitee seeding to authenticated admin route only.

