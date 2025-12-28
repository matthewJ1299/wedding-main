# Wedding Application - Production URLs & Settings

## Deployment URLs
- **Frontend**: https://matthewandsydney.triadtech.co.za
- **Backend API**: https://matthewandsydneyapi.triadtech.co.za

## Environment Variables

### Frontend (.env.production)
```
REACT_APP_SITE_URL=https://matthewandsydney.triadtech.co.za
REACT_APP_API_URL=https://matthewandsydneyapi.triadtech.co.za
REACT_APP_ADMIN_EMAIL=admin@matthewandsydney.triadtech.co.za
GENERATE_SOURCEMAP=false
NODE_ENV=production
```

### Backend (.env.production)
```
NODE_ENV=production
PORT=3001
DB_PATH=./data.sqlite
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=https://matthewandsydney.triadtech.co.za
ADMIN_EMAIL=admin@matthewandsydney.triadtech.co.za
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

## Build Commands

### Frontend
```bash
# Production build with correct URLs
npm run build:cpanel

# Or manually with environment variables
GENERATE_SOURCEMAP=false \
REACT_APP_API_URL=https://matthewandsydneyapi.triadtech.co.za \
REACT_APP_SITE_URL=https://matthewandsydney.triadtech.co.za \
npm run build
```

### Backend
```bash
# Production start
npm run start:cpanel

# Or manually
NODE_ENV=production PORT=3001 node server.js
```

## Quick Deployment Steps

1. **Run build script**: `./build-production.sh` (Linux/Mac) or `build-production.bat` (Windows)
2. **Upload frontend**: Upload `deployment/frontend/` contents to frontend domain's public_html
3. **Upload backend**: Upload `deployment/backend/` contents to backend domain's public_html
4. **Setup Node.js**: Use cPanel Node.js Selector to start the backend application
5. **Configure .env**: Update backend .env file with actual SMTP credentials and secrets
6. **Test**: Visit both URLs to verify deployment

## Health Check Endpoints
- Backend health: https://matthewandsydneyapi.triadtech.co.za/health
- Frontend: https://matthewandsydney.triadtech.co.za

## Important Files Created
- `Wedding/frontend/.htaccess` - Frontend Apache configuration
- `Wedding/backend/.htaccess` - Backend Apache configuration  
- `Wedding/frontend/env.production.txt` - Frontend environment template
- `Wedding/backend/env.production.txt` - Backend environment template
- `CPANEL_DEPLOYMENT.md` - Detailed deployment guide
- `build-production.sh` - Linux/Mac build script
- `build-production.bat` - Windows build script
