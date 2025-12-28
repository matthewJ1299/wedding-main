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
- **Modern Stack**: React 19, Node.js, SQLite
- **Production Ready**: cPanel deployment configuration
- **Security**: Input validation, CORS protection, secure authentication
- **Monitoring**: Health checks, structured logging, error tracking
- **Backup System**: Automated database backups

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Gmail account for email functionality

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
   # - Email credentials (Gmail app password)
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

#### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SITE_URL=http://localhost:3000
REACT_APP_ADMIN_EMAIL=admin@example.com
```

#### Backend (.env.local)
```env
NODE_ENV=development
PORT=3001
DATABASE_PATH=./data.sqlite
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ORIGIN_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
JWT_SECRET=your-secret-key
```

### Email Configuration

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password for the application
3. Use the app password in `EMAIL_PASS` environment variable

## Deployment

### Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to cPanel hosting.

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
   - Upload frontend build to web root
   - Deploy backend to API subdomain
   - Configure .htaccess files

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





