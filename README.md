# Matt & Sydney's Wedding Site

A beautiful, modern wedding website built with React and Node.js, featuring RSVP management, photo gallery, and admin panel.

## Features

### Guest Features
- **Wedding Information**: Beautiful homepage with countdown timer
- **RSVP System**: Secure RSVP with email confirmation
- **Photo Gallery**: Share and view wedding photos
- **Wedding Details**: Schedule, accommodation, registry, and FAQ pages
- **Responsive Design**: Works perfectly on all devices

### Admin Features
- **Guest Management**: Add, edit, and manage invitees
- **RSVP Tracking**: Monitor responses and guest details
- **Photo Moderation**: Approve/reject uploaded photos
- **Email Templates**: Customize email communications
- **Analytics**: View RSVP statistics and summaries

### Technical Features
- **Modern Stack**: React 19, Node.js 22.5+ (backend), SQLite via built-in `node:sqlite`
- **Production Ready**: cPanel deployment configuration
- **Security**: Input validation, CORS protection, secure authentication
- **Monitoring**: Health checks, structured logging, error tracking
- **Backup System**: Automated database backups

## Quick Start

### Prerequisites
- Node.js 22.5+ (required for the backend API; uses built-in `node:sqlite`)
- npm or yarn
- SMTP server (or relay) for email, or run without SMTP to log messages only in development

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wedding-main
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd Wedding/frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment templates
   cp .env.example .env.local
   
   # Edit with your configuration
   # - SMTP settings (SMTP_HOST, etc.; see Configuration)
   # - Admin email address
   # - Database settings
   ```

4. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd Wedding/backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd Wedding/frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Admin: http://localhost:3000/login (default password: weddingadmin)

## Project Structure

```
Wedding/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── admin/       # Admin panel components
│   │   │   ├── common/      # Shared components
│   │   │   ├── gallery/     # Photo gallery components
│   │   │   ├── layout/      # Layout components
│   │   │   └── ui/          # UI components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS styles
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── build/               # Production build
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── app/
│   │   │   └── api/         # API routes
│   │   ├── utils/           # Utility functions
│   │   └── seed/            # Database seeding
│   ├── repositories/        # Data access layer
│   ├── uploads/             # File uploads
│   ├── logs/                # Application logs
│   ├── backups/             # Database backups
│   └── data.sqlite          # SQLite database
├── .htaccess                # Apache configuration
├── server.js                # Production server wrapper
└── package.json             # Dependencies and scripts
```

## Configuration

### Environment Variables

#### Frontend (local development: `.env.local`)

Use localhost URLs for `npm start`:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SITE_URL=http://localhost:3000
REACT_APP_ADMIN_EMAIL=admin@example.com
```

#### Frontend (production build: `.env.production`)

Create React App loads `Wedding/frontend/.env.production` when you run `npm run build`. This repo includes production public URLs so the bundle calls the live API (required for CSP `connect-src` on cPanel):

```env
REACT_APP_API_URL=https://api.matthewandsydney.co.za
REACT_APP_SITE_URL=https://matthewandsydney.co.za
```

You can still override at build time (e.g. `npm run build:cpanel` sets the same variables inline).

#### Backend (.env.local)
```env
NODE_ENV=development
PORT=3001
DATABASE_PATH=./data.sqlite
UPLOAD_DIR=./uploads
ORIGIN_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
JWT_SECRET=your-secret-key

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

`EMAIL_USER` / `EMAIL_PASS` are still accepted as aliases for `SMTP_USER` / `SMTP_PASS` if you prefer those names.

### Email Configuration

Configure generic SMTP via `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE` (`true` for implicit TLS on port 465, usually `false` for STARTTLS on 587). Set `SMTP_USER` and `SMTP_PASS` when your server requires authentication. Optional `SMTP_FROM` sets the **From** header (defaults to `SMTP_USER`, then `ADMIN_EMAIL`). If `SMTP_HOST` is not set, outbound mail is not sent; the backend logs the payload instead.

## Deployment

### Docker (full stack)

From the repository root (`wedding-main/`), with Docker installed:

1. Copy `.env.docker.example` to `.env` and set SMTP, secrets, and public URLs if not using the localhost defaults.
2. Run one of:

   - **Coolify / production-style proxy (no host ports):** avoids conflicts when something else already uses 8080 or 3001 on the server.

     ```bash
     docker compose up --build
     ```

   - **Local machine with http://localhost:8080 and :3001:**

     ```bash
     docker compose -f docker-compose.yml -f docker-compose.local.yml up --build
     ```

3. **With `docker-compose.local.yml`:** frontend http://localhost:8080, API http://localhost:3001 (health: `/health` or `/api/health`). **Without it:** open the app only via your reverse proxy / Coolify domains (containers expose ports 80 and 3001 internally only).

The compose file mounts a named volume at `/data` in the backend container for SQLite (`DATABASE_PATH=/data/data.sqlite`), uploads (`UPLOAD_DIR=/data/uploads`), and backups (`BACKUP_DIR=/data/backups`). The static site image is built with `REACT_APP_API_URL` / `REACT_APP_SITE_URL` build args so the browser calls the correct API origin.

**Coolify:** attach domains in the UI to the **frontend** (container port **80**) and **backend** (container port **3001**). Do not rely on publishing host ports 8080/3001; the default `docker-compose.yml` is built for that. If you ever see `Bind for 0.0.0.0:8080 failed: port is already allocated`, you are using a compose file that publishes 8080 on the host; use the repo default or remove host `ports` for Coolify.

### Production URLs

- **Frontend (public site)**: `https://matthewandsydney.co.za`
- **Backend API**: `https://api.matthewandsydney.co.za`

Ensure the frontend build uses the production URLs (via `Wedding/frontend/.env.production` or `build:cpanel`), and set `FRONTEND_URL` plus `ORIGIN_URL` on the backend so CORS matches the browser origin. Shared allow-origin rules live in `Wedding/backend/cors-origin.cjs` (used by Express `server.js` and `/api/invitees`). Full steps: [DEPLOYMENT.md](DEPLOYMENT.md), [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md), [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md).

### Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to cPanel hosting.

**Backend (FTP from your PC):** run `npm run build` in `Wedding/backend` so the **`.next`** folder exists, upload it with the rest of the app, then on the server run `npm ci --omit=dev` (or use `build-production.bat` / `build-production.sh`, which build the backend and stage `deployment/backend/` without stripping `.next`). See [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md).

### Key Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Configure production environment**
   - Set up environment variables
   - Configure email settings
   - Set up SSL certificates

3. **Deploy to hosting**
   - Upload the full frontend `build` folder to the site web root (include hidden files: `Wedding/frontend/public/.htaccess` is copied into `build/` for Apache SPA routing so `/admin` works)
   - Deploy backend to API subdomain
   - Configure backend `.htaccess` if required by your host

4. **Initialize database**
   - Database created automatically
   - Seed initial data if needed

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/photos?approved=true` - Get approved photos
- `POST /api/photos` - Upload photo (with moderation)

### Admin Endpoints
- `GET /api/invitees` - Get all invitees
- `POST /api/invitees` - Create invitee
- `PUT /api/invitees/:id` - Update invitee
- `DELETE /api/invitees/:id` - Delete invitee

### Email Endpoints
- `POST /api/send-email` - Send email
- `GET /api/email-templates` - Get email templates

## Database Schema

### Invitees Table
- `id` - Unique identifier
- `name` - Guest name
- `partner` - Partner name (if couple)
- `email` - Email address
- `phone` - Phone number
- `rsvp` - RSVP status (pending/accepted/declined)
- `inviteCode` - Unique invitation code
- `allowPlusOne` - Whether plus one is allowed
- `plusOneName` - Plus one name if attending

### Photos Table
- `id` - Unique identifier
- `filename` - Stored filename
- `originalName` - Original filename
- `mimeType` - File MIME type
- `size` - File size in bytes
- `uploaderName` - Name of uploader
- `uploaderEmail` - Email of uploader
- `approved` - Approval status
- `createdAt` - Upload timestamp
- `updatedAt` - Last update timestamp

## Security Features

- **Input Validation**: All inputs validated and sanitized
- **CORS Protection**: Configured for specific origins
- **File Upload Security**: Type and size validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization and CSP headers
- **Authentication**: Secure admin login system

## Backup and Recovery

### Database Backups
```bash
# Create backup
npm run backup:db create

# List backups
npm run backup:db list

# Restore backup
npm run backup:db restore backup_name.sqlite

# Cleanup old backups
npm run backup:db cleanup 10
```

### File Backups
- Regular backup of `uploads/` directory
- Backup of configuration files
- Backup of database file

## Monitoring and Logs

### Health Monitoring
- Health check endpoint: `/api/health`
- Application metrics and uptime
- Database connectivity status

### Logging
- Structured logging with Winston
- Error tracking and debugging
- Application performance monitoring
- Log rotation and retention

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For technical support or questions:
- Check the logs first
- Review environment configuration
- Test API endpoints individually
- Consult the deployment guide

## License

This project is for personal use. All rights reserved.

---

**Built with ❤️ for Matt & Sydney's special day**





