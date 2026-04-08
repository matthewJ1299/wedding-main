# Wedding Site Deployment Guide

This guide provides step-by-step instructions for deploying the wedding site to cPanel hosting.

## Prerequisites

- cPanel hosting account with Node.js support
- Domain configured for both frontend and API subdomain
- SSL certificates installed
- Node.js version 22.5+ support on the backend (built-in SQLite module)

## Deployment Architecture

- **Frontend**: `matthewandsydney.co.za` (Static React build)
- **Backend API**: `api.matthewandsydney.co.za` (Node.js application)

## Frontend Deployment

### 1. Build the Frontend

```bash
cd Wedding/frontend
npm install
npm run build
```

### 2. Upload to cPanel

1. Access your cPanel file manager
2. Navigate to `public_html` (or your domain's root directory)
3. Upload the entire `build` folder contents (include hidden files: **`build` includes `.htaccess`** from `public/` for SPA routes such as `/admin`)
4. If `.htaccess` is missing after upload, copy `Wedding/frontend/.htaccess` to the same folder as `index.html`

### 3. Environment Configuration

Create a `.env.production` file in the frontend root with:

```env
REACT_APP_API_URL=https://api.matthewandsydney.co.za
REACT_APP_SITE_URL=https://matthewandsydney.co.za
GENERATE_SOURCEMAP=false
```

## Backend Deployment

### 1. Prepare Backend Files

```bash
cd Wedding/backend
npm install
npm run build
```

### 2. Upload Backend Files

1. Create a subdomain directory for your API (e.g., `api.matthewandsydney.co.za`)
2. Upload all backend files except `node_modules`
3. Upload the `.htaccess` file from `Wedding/backend/.htaccess`

### 3. Environment Configuration

Create a `.env.production` file in the backend root with:

```env
NODE_ENV=production
PORT=3001
DATABASE_PATH=./data.sqlite
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
ORIGIN_URL=https://matthewandsydney.co.za
ADMIN_EMAIL=matthew.j@live.com
JWT_SECRET=your-super-secret-jwt-key-change-this
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 4. Install Dependencies

In cPanel Terminal or SSH:

```bash
cd /path/to/backend
npm install --production
```

### 5. Start the Application

```bash
npm run start:production
```

## Database Setup

### 1. Initialize Database

The SQLite database will be created automatically on first run. Ensure the backend has write permissions to create:
- `data.sqlite` (main database)
- `uploads/` directory (for photo uploads)
- `logs/` directory (for application logs)
- `backups/` directory (for database backups)

### 2. Seed Initial Data (Optional)

```bash
curl -X POST https://api.matthewandsydney.co.za/api/seed
```

## SSL Configuration

Ensure SSL certificates are installed for both domains:
- `matthewandsydney.co.za`
- `api.matthewandsydney.co.za`

## File Permissions

Set appropriate file permissions:

```bash
# Database and uploads directory
chmod 755 data.sqlite
chmod 755 uploads/
chmod 755 logs/
chmod 755 backups/

# Application files
chmod 644 server.js
chmod 644 package.json
```

## Process Management

For production, consider using PM2 or similar process manager:

```bash
npm install -g pm2
pm2 start server.js --name "wedding-api"
pm2 save
pm2 startup
```

## Monitoring

### Health Check

Monitor the application health:

```bash
curl https://api.matthewandsydney.co.za/api/health
```

### Logs

Check application logs in the `logs/` directory:
- `error.log` - Error messages
- `combined.log` - All log messages

## Backup Strategy

### Database Backups

Set up automated backups:

```bash
# Create backup
npm run backup:db create

# List backups
npm run backup:db list

# Cleanup old backups (keep 10 most recent)
npm run backup:db cleanup 10
```

### File Backups

Regularly backup:
- `data.sqlite` (database)
- `uploads/` (photo uploads)
- Environment files

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `ORIGIN_URL` matches your frontend domain
2. **Database Permissions**: Check file permissions for SQLite database
3. **Email Issues**: Verify Gmail app password and SMTP settings
4. **Upload Failures**: Ensure `uploads/` directory exists and is writable

### Debug Mode

For debugging, temporarily set:

```env
NODE_ENV=development
```

### Log Analysis

Check logs for detailed error information:

```bash
tail -f logs/error.log
tail -f logs/combined.log
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Database Security**: Ensure SQLite file is not web-accessible
3. **File Uploads**: Validate file types and sizes
4. **Admin Access**: Change default admin password
5. **HTTPS**: Always use HTTPS in production

## Performance Optimization

1. **Enable Gzip**: Configured in `.htaccess` files
2. **Browser Caching**: Static assets cached for 1 year
3. **Image Optimization**: Photos compressed on upload
4. **Database Indexing**: SQLite automatically handles indexing

## Maintenance

### Regular Tasks

1. **Monitor Logs**: Check for errors weekly
2. **Database Backups**: Automated daily backups
3. **Photo Cleanup**: Review and approve uploaded photos
4. **Security Updates**: Keep dependencies updated

### Updates

To update the application:

1. Backup current version
2. Upload new files
3. Run `npm install` if dependencies changed
4. Restart the application
5. Test functionality

## Support

For technical support or questions:
- Check logs first
- Verify environment configuration
- Test API endpoints individually
- Review file permissions





