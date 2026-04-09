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

## Future Enhancements

- Server-side template storage
- More advanced rich text editor with image support
- Additional template variables
- Advanced segmentation for bulk sending
- Improved email analytics