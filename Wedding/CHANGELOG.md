# Changelog

## Unreleased
- Rebuilt `Wedding/invite.html` as valid transactional HTML for email (removed Word-escaped markup, scripts, preload tags; table layout, inline-safe styles, `{guestName}` / `{websiteLink}` placeholders). See `frontend/src/components/email/README.md` for static template usage.
- Gate invitee API loading to only routes that require it (admin/invitation/rsvp/edit-details), preventing pre-login/background API calls on unrelated pages.
- Restrict invitee seeding to authenticated admin route only.

