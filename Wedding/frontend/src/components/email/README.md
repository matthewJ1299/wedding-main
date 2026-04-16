# Wedding Website Email Template System

This document explains the email template system added to the wedding website application.

## Overview

The email template system allows wedding hosts to create, manage, and send beautiful email templates to guests. It includes:

- Pre-defined templates for common wedding communications (Save the Date, Invitation, RSVP Confirmation, Thank You)
- Rich text editor for customizing templates
- Template variable system for personalization (guest names, dates, etc.)
- Email preview functionality
- Email tracking and statistics

## Architecture

The system consists of several components:

1. **Models**: Define the structure of email templates and their variables
2. **Context**: Manages template state across the application
3. **Components**: UI elements for template management, editing, and previewing
4. **Services**: Handle email sending and tracking

## Key Files

### Static invitation HTML (copy/paste source)

- `Wedding/invite.html`, `Wedding/rsvpyes.html`, and `Wedding/rsvpno.txt` at the repo root are **email-oriented HTML** (no RTF wrapper, no scripts, preload tags removed). They stay in sync with the database seed bodies when you run `npm run email-templates:generate` from `Wedding/backend` (see `scripts/generate-email-template-bodies.mjs`). The same layouts are inserted automatically for **new** databases as `tpl-canva-invite`, `tpl-canva-rsvp-yes`, and `tpl-canva-rsvp-no` in `backend/src/seed/emailTemplates.js` (via `generatedEmailBodies.js`).
- Merge fields: `{guestName}`, `{rsvpLink}` (primary CTA in Canva layouts), `{websiteLink}` (optional / homepage), `{weddingDate}`, `{weddingTime}`, `{weddingLocation}`, `{eventAddress}`, `{rsvpDeadline}`, plus `{invitationLink}`, `{guestPartner}`, and aliases `{name}` / `{{name}}`. Shared fields are filled from `frontend/src/utils/constants.js` through `getEmailTemplateMergeDefaults()`; per-invitee values use `getGuestEmailMergeFields(invitee)` (same shape for Admin sends and guest-facing flows).
- **Automated RSVP reply**: When a guest submits RSVP on `RsvpForm`, the app sends **RSVP thanks — attending** (`tpl-canva-rsvp-yes`) if they accept, otherwise **RSVP thanks — unable to attend** (`tpl-canva-rsvp-no`). IDs are exported as `RSVP_THANK_YOU_TEMPLATE_IDS` in `utils/constants.js`. If templates are not in context (e.g. API load failed and only local defaults exist), a minimal built-in subject/body is used instead.
- Images use absolute Canva CDN URLs; for production longevity, mirror assets to your own HTTPS host and update `img` `src` values.

### Models
- `models/emailTemplateModel.js`: Defines template structure and provides helper functions

### Context
- `contexts/EmailTemplateContext.js`: Manages template state across the application

### Components
- `components/email/EmailTemplate.js`: Individual template card component
- `components/email/EmailTemplateEditor.js`: Rich text editor for templates
- `components/email/EmailTemplateManager.js`: Template management UI
- `components/email/EmailPreview.js`: Live preview of templates with variable substitution
- `components/email/EmailStats.js`: Email statistics display
- `components/email/EmailTab.js`: Main email tab for AdminPage

### Services
- `services/emailService.js`: Email sending functionality
- `services/emailTrackingService.js`: Email tracking and analytics

## Usage

### Creating Templates

1. Navigate to the Admin page
2. Select the "Email" tab
3. Select "Templates" sub-tab
4. Click "Create New Template"
5. Fill in template details:
   - Template name
   - Subject line
   - HTML content (using rich text editor)
   - Plain text content
6. Use variables like `{guestName}` to personalize templates

**Variable placeholder formats**

- `{guestName}` style is supported
- `{{guestName}}` (Handlebars-style) is also supported, including whitespace like `{{ guestName }}`

### Available Template Variables

- `{guestName}`: Guest's name
- `{guestPartner}`: Guest's partner/plus one name
- `{weddingDate}`: Wedding date
- `{weddingLocation}`: Wedding venue/location
- `{eventAddress}`: Complete venue address
- `{rsvpLink}`: Link to RSVP page
- `{websiteLink}`: Link to wedding website
- `{weddingTime}`: Ceremony time (from `WEDDING_DATE` in constants)
- `{rsvpDeadline}`: RSVP cutoff date (from `RSVP_CONFIG.DEADLINE`)

**Common aliases**

- `{name}` / `{{name}}`: Alias for guest name
- `{partner}` / `{{partner}}`: Alias for partner name
- `{invitationLink}` / `{{invitationLink}}`: Link to the guest’s invitation page

### Sending Emails

1. Navigate to Admin > Email > Send Email
2. Select a template
3. Choose a **recipient group** (All, Accepted, Declined, Pending/No response)
4. (Optional) Choose a **Preview as** invitee to see personalization variables populated
5. Preview the email
6. Send to an individual recipient (using the recipient email field), or click **Send to group** to send to everyone in the selected group

### Tracking Statistics

The Email Statistics tab shows:
- Total emails sent
- Email open rates
- Delivery failures
- Recent email activity

## Implementation Notes

- Email templates are stored in localStorage for persistence
- Default templates are provided but can be customized
- Email tracking uses web beacons and link tracking
- The editor uses browser's contentEditable for simplicity

## Deliverability (why mail goes to Junk / Spam)

Transactional mail from a wedding app often hits Junk first because **inbox providers score trust**, not because your template is “wrong”.

**Common causes**

- **Missing or misaligned DNS auth**: SPF, DKIM, and DMARC must align with the **envelope sender** and **From** domain you use in SMTP (`SMTP_FROM` / provider defaults). Sending “from” your personal Gmail while using a different SMTP host fails alignment unless configured correctly.
- **New domain or IP**: Low reputation until volume and engagement build.
- **Content and URLs**: Heavy images, URL shorteners, spammy words, or mismatched link domains can add risk (usually secondary to authentication).
- **Bounces and complaints**: Bad lists or test loops hurt sender reputation.

**What actually fixes it**

1. Send from a domain **you control** (e.g. `hello@matthewandsydney.co.za`), not a free mailbox as the technical From domain, unless the provider documents that exact setup.
2. Configure **SPF**, **DKIM**, and **DMARC** for that domain in DNS; use your SMTP host’s wizard (SendGrid, SES, Mailgun, Microsoft 365, Google Workspace, etc.).
3. Use a **consistent From** address and a sensible **Reply-To**; avoid no-reply if you want replies, but keep the domain aligned.
4. After DNS changes, use your provider’s **domain verification** tools and send test messages to Gmail, Outlook, and Yahoo; use **Google Postmaster Tools** / Microsoft SNDS where applicable.
5. For production, prefer a **transactional SMTP** product with documented alignment rather than ad-hoc SMTP on a shared host.

This app sends mail via the backend SMTP module (`Wedding/backend/src/emailModule.js`); fixing Junk is almost always **DNS + SMTP identity**, not a React change.

## Future Enhancements

- Server-side template storage
- More advanced rich text editor with image support
- Additional template variables
- Advanced segmentation for bulk sending
- Improved email analytics