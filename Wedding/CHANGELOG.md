# Changelog

## Unreleased
- **Canva email templates in DB**: Stripped RTF from `Wedding/invite.html`, `rsvpyes.html`, and `rsvpno.txt`, normalized merge fields to `{guestName}`, `{websiteLink}`, `{weddingDate}`, `{weddingTime}`, `{weddingLocation}`, `{eventAddress}`, `{rsvpDeadline}`. Added `backend/src/utils/rtfEmailHtmlStripper.js`, `npm run email-templates:generate` (writes clean HTML back to `Wedding/` and refreshes `src/seed/generatedEmailBodies.js`), and three default rows in `DEFAULT_EMAIL_TEMPLATES` (`tpl-canva-invite`, `tpl-canva-rsvp-yes`, `tpl-canva-rsvp-no`). **Existing databases** that already have `email_templates` rows are not auto-updated; clear the table or insert manually if you need these on an old DB.
- **Email merge defaults**: `frontend/src/utils/emailTemplateDefaults.js` supplies shared fields from `constants.js`; `EmailTemplateContext.prepareTemplate` merges them so subjects/bodies resolve even when only guest-specific keys are passed.
- `POST /api/send-email` returns explicit `missingFields` and a clear error when `to`, `subject`, or body is missing; HTML-only payloads are accepted (`text` may be empty if `html` is non-empty). Plain text for SMTP is derived from HTML when `text` is omitted.
- Client `apiFetch` error toasts include `missingFields` when the API returns them.
- Gate invitee API loading to only routes that require it (admin/invitation/rsvp/edit-details), preventing pre-login/background API calls on unrelated pages.
- Restrict invitee seeding to authenticated admin route only.

