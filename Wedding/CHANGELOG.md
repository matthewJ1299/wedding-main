# Changelog

## Unreleased
- `POST /api/send-email` returns explicit `missingFields` and a clear error when `to`, `subject`, or body is missing; HTML-only payloads are accepted (`text` may be empty if `html` is non-empty). Plain text for SMTP is derived from HTML when `text` is omitted.
- Client `apiFetch` error toasts include `missingFields` when the API returns them.
- Rebuilt `Wedding/invite.html` as valid transactional HTML for email (removed Word-escaped markup, scripts, preload tags; table layout, inline-safe styles, `{guestName}` / `{websiteLink}` placeholders). See `frontend/src/components/email/README.md` for static template usage.
- Gate invitee API loading to only routes that require it (admin/invitation/rsvp/edit-details), preventing pre-login/background API calls on unrelated pages.
- Restrict invitee seeding to authenticated admin route only.

