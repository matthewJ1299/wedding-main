# Wedding Application - cPanel Deployment Guide

This guide will help you deploy the wedding application to cPanel hosting with the following URLs:
- Frontend: https://matthewandsydney.triadtech.co.za
- Backend API: https://matthewandsydneyapi.triadtech.co.za

## Prerequisites

1. cPanel hosting account with Node.js support
2. Two subdomains configured:
   - `matthewandsydney.triadtech.co.za` (for frontend)
   - `matthewandsydneyapi.triadtech.co.za` (for backend)
3. SSL certificates for both domains
4. Access to cPanel File Manager or FTP

## Deployment Steps

### 1. Backend Deployment

1. **Upload Backend Files**
   - Upload the entire `Wedding/backend/` folder to your backend domain's public_html directory
   - **Do NOT upload `node_modules`** - we will install dependencies on cPanel

2. **Set Environment Variables**
   - Copy `env.production.txt` to `.env` in the backend root directory
   - Update the following values in `.env`:
     ```
     NODE_ENV=production
     PORT=3001
     SMTP_USER=your-actual-email@gmail.com
     SMTP_PASS=your-actual-app-password
     JWT_SECRET=your-unique-jwt-secret-key
     SESSION_SECRET=your-unique-session-secret-key
     FRONTEND_URL=https://matthewandsydney.triadtech.co.za
     DATABASE_PATH=./data.sqlite
     UPLOAD_DIR=./uploads
     ```

3. **Install Dependencies on cPanel**
   - In cPanel Terminal or via SSH, navigate to the backend directory
   - Run: `npm install`
   - This will install all dependencies including dev dependencies needed for building

4. **Build the Backend (if needed)**
   - If your backend uses Next.js build process, run: `npm run build`
   - This step may not be required if you're using `server.js` directly

5. **Start the Backend Service**
   - Use cPanel's Node.js Selector to create a new application
   - Set the application root to your backend directory
   - Set the application URL to `matthewandsydneyapi.triadtech.co.za`
   - Set the application startup file to `server.js`
   - Set Node.js version to 18.x or higher
   - Set the startup command to: `npm run start:cpanel`
   - Start the application

6. **Configure .htaccess**
   - The `.htaccess` file is already configured for the backend
   - It will proxy requests to the Node.js server running on port 3001

### 2. Frontend Deployment

1. **Upload Frontend Files**
   - Upload the entire `Wedding/frontend/` folder to your frontend domain's public_html directory
   - **Do NOT upload `node_modules`** - we will install dependencies on cPanel

2. **Set Environment Variables**
   - Create a `.env` file in the frontend root directory with:
     ```
     REACT_APP_API_URL=https://matthewandsydneyapi.triadtech.co.za
     REACT_APP_SITE_URL=https://matthewandsydney.triadtech.co.za
     GENERATE_SOURCEMAP=false
     ```

3. **Install Dependencies on cPanel**
   - In cPanel Terminal or via SSH, navigate to the frontend directory
   - Run: `npm install`
   - This will install all dependencies needed for building

4. **Build the Frontend on cPanel**
   - While still in the frontend directory, run: `npm run build`
   - This will create a `build` folder with production files
   - The build process will use the environment variables from the `.env` file

5. **Move Build Files to Root**
   - Move all contents from the `build` folder to the `public_html` root directory
   - **CRITICAL**: Ensure the `.htaccess` file is in the root of `public_html` (same directory as `index.html`)
   - The `.htaccess` file must be uploaded from `Wedding/frontend/.htaccess` or created with the correct SPA routing rules
   - You can optionally remove the source files and `node_modules` after building to save space
   - **Verify**: The `.htaccess` file should be at the same level as `index.html` in your `public_html` directory

6. **Verify Environment Variables**
   - The build process should have used the correct API URL from the `.env` file
   - Verify that all API calls point to `https://matthewandsydneyapi.triadtech.co.za`

### 3. Database Setup

1. **Initialize Database**
   - The SQLite database will be created automatically when the backend starts
   - If you need to seed initial data, access the `/api/seed` endpoint after deployment

2. **Database Backup**
   - The `data.sqlite` file will be created in the backend directory
   - Set up regular backups using cPanel's backup tools

### 4. Email Configuration

1. **SMTP Settings**
   - Update the SMTP settings in the backend `.env` file
   - For Gmail, use App Passwords instead of your regular password
   - Test email functionality using the admin panel

### 5. SSL Configuration

1. **Enable SSL**
   - Ensure SSL certificates are installed for both domains
   - Force HTTPS redirects in cPanel
   - Update any hardcoded HTTP URLs to HTTPS

### 6. Testing

1. **Health Check**
   - Visit `https://matthewandsydneyapi.triadtech.co.za/health`
   - Should return a JSON response with server status

2. **Frontend Access**
   - Visit `https://matthewandsydney.triadtech.co.za`
   - Verify the application loads correctly
   - Test API connectivity by using the admin features

3. **API Testing**
   - Test all API endpoints through the frontend
   - Verify CORS is working correctly
   - Test file uploads and email sending

## Troubleshooting

### Common Issues

1. **404 Errors on Routes (e.g., /admin)**
   - This is a common SPA routing issue - the `.htaccess` file must be in the root of `public_html` (same directory as `index.html`)
   - **Solution Steps:**
     1. Verify the `.htaccess` file exists in the root of `public_html` (same directory as `index.html`)
     2. Check that `mod_rewrite` is enabled on your cPanel hosting (contact hosting provider if unsure)
     3. Ensure the `.htaccess` file has the correct rewrite rule: `RewriteRule ^ index.html [L]`
     4. If the above doesn't work, try changing the rewrite rule to: `RewriteRule ^ /index.html [L]` (with leading slash)
     5. Test by accessing `https://matthewandsydney.triadtech.co.za/.htaccess` - it should return 403 Forbidden (not 404), confirming the file exists
     6. Check cPanel error logs for any `.htaccess` syntax errors
   - **Alternative Solution:** If `.htaccess` rewrite rules don't work, you may need to configure the rewrite rules through cPanel's "Apache Handlers" or contact your hosting provider to enable `mod_rewrite` for your domain

2. **Build Script Issues**
   - If `npm run build:cpanel` doesn't work, use `npm run build` instead
   - Ensure environment variables are set in `.env` file before building
   - For frontend, the `.env` file must be in the frontend root directory before running `npm run build`
   - If build fails, check Node.js version (should be 18.x or higher)
   - Some cPanel environments may require additional build tools - contact your hosting provider if builds fail

2. **CORS Errors**
   - Verify the `FRONTEND_URL` environment variable in the backend `.env` file
   - Check that the frontend domain is correctly configured in CORS settings
   - Ensure the backend is using the correct frontend URL in production

3. **Node.js Application Not Starting**
   - Check the Node.js version (should be 18.x or higher)
   - Verify all dependencies are installed with `npm install`
   - Check the application logs in cPanel
   - Ensure the startup command in Node.js Selector is set to `npm run start:cpanel`

4. **Dependency Installation Issues**
   - If `npm install` fails, try clearing npm cache: `npm cache clean --force`
   - Some packages may require additional system dependencies on the server
   - Check cPanel error logs for specific package installation errors
   - Ensure you have sufficient disk space for node_modules

5. **Database Issues**
   - Ensure the backend directory has write permissions
   - Check that SQLite is supported on your hosting
   - Verify the `data.sqlite` file can be created in the backend directory

6. **File Upload Issues**
   - Verify the `uploads` directory exists and has write permissions
   - Check file size limits in both PHP and Node.js settings
   - Ensure the uploads directory is created before starting the application

### Log Files

- Backend logs are handled by Winston logger
- Check cPanel's error logs for additional debugging information
- Monitor the Node.js application logs in cPanel

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use strong, unique secrets for JWT and session keys
   - Regularly rotate API keys and passwords

2. **File Permissions**
   - Set appropriate file permissions (644 for files, 755 for directories)
   - Restrict access to sensitive files like `.env` and database files

3. **Rate Limiting**
   - The application includes rate limiting for API endpoints
   - Monitor for unusual traffic patterns

## Maintenance

1. **Regular Updates**
   - Keep Node.js and npm packages updated
   - Monitor security advisories for dependencies

2. **Backup Strategy**
   - Regular database backups
   - Backup uploaded files
   - Keep configuration files backed up

3. **Monitoring**
   - Monitor application performance
   - Set up uptime monitoring
   - Monitor error rates and logs

## Quick Troubleshooting Checklist for 404 on Routes

If you're getting 404 errors when accessing routes like `/admin`:

1. **Verify `.htaccess` file location:**
   - File must be in: `public_html/.htaccess` (root of your domain)
   - Same directory as `index.html`
   - Not in a subdirectory

2. **Check file contents:**
   - Open `.htaccess` in cPanel File Manager
   - Must contain: `RewriteEngine On`
   - Must contain: `RewriteRule ^ index.html [L]` or `RewriteRule ^ /index.html [L]`

3. **Verify file permissions:**
   - `.htaccess` should have permissions: 644
   - Can be set in cPanel File Manager

4. **Test mod_rewrite:**
   - Create a test file `test.php` in `public_html` with: `<?php phpinfo(); ?>`
   - Access it via browser and search for "mod_rewrite" - should show as loaded
   - Or contact hosting provider to confirm `mod_rewrite` is enabled

5. **Check for conflicting rules:**
   - Ensure no other `.htaccess` files in parent directories are interfering
   - Check cPanel's "Redirects" tool for conflicting rules

6. **Clear browser cache:**
   - Sometimes cached 404 responses persist
   - Try incognito/private browsing mode

## Support

If you encounter issues during deployment:
1. Check the troubleshooting section above
2. Review cPanel and hosting provider documentation
3. Check application logs for specific error messages
4. Verify all environment variables are correctly set
5. For 404 route issues, follow the Quick Troubleshooting Checklist above
