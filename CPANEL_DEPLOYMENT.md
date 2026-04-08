# Wedding Application - cPanel Deployment Guide

This guide will help you deploy the wedding application to cPanel hosting with the following URLs:
- Frontend: https://matthewandsydney.co.za
- Backend API: https://api.matthewandsydney.co.za

## Prerequisites

1. cPanel hosting account with **Node.js 22.5 or newer** for the backend (required for built-in `node:sqlite`). The backend uses `next.config.mjs` (not `next.config.ts`) so Next can load config on typical hosts; select the newest **22.x** (or **24.x** if available) in **Setup Node.js App**, not Node 18.
2. DNS configured for both hostnames:
   - `matthewandsydney.co.za` (frontend / public site)
   - `api.matthewandsydney.co.za` (backend API)
3. SSL certificates for both domains
4. Access to cPanel File Manager or FTP

## Deployment Steps

### 1. Backend deployment (local build, then FTP)

The Next.js backend **must** have a production build output (the `.next` folder). The repo scripts used to delete `.next` when packaging; that is fixed. Use one of the flows below.

#### Recommended: `deployment/backend` package from your PC

1. From the **repository root** (`wedding-main`), run:
   - **Windows:** `build-production.bat`
   - **macOS/Linux:** `./build-production.sh`
2. That script runs `npm run build` inside `Wedding/backend`, then copies the result to `deployment/backend/` and **removes only `node_modules`** from the copy (the **`.next` folder is kept**).
3. FTP (or upload) the **full** contents of `deployment/backend/` to your API app directory on the server.
   - **Critical:** Include the **`.next`** directory. Some FTP clients hide dot-folders; enable “show hidden files” or sync `.next` explicitly. Without `.next`, `node server.js` cannot serve the API.
4. On the server (SSH or cPanel Terminal), in that app directory:
   - `npm ci --omit=dev` **or** `npm install --omit=dev`
   - Production only: you do **not** need devDependencies to **run** the app if `.next` was built on your machine.
5. **Environment:** copy `env.production.txt` to `.env` and set real secrets and SMTP. At minimum:
   ```
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://matthewandsydney.co.za
   ORIGIN_URL=https://matthewandsydney.co.za
   DB_PATH=./data.sqlite
   ```
   Use `DATABASE_PATH` instead of `DB_PATH` if you need an absolute path to `data.sqlite`.

6. **Start the Backend Service**
   - Use cPanel's Node.js Selector to create a new application
   - Set the application root to your backend directory
   - Set the application URL to `api.matthewandsydney.co.za`
   - Set the application startup file to `server.js`
   - Set Node.js version to 22.5 or higher (required for built-in `node:sqlite`)
   - If your host does not allow a custom startup command, startup file only is fine: this `server.js` defaults `NODE_ENV` to `production` when unset.
   - Start/restart the application

7. **Configure .htaccess**
   - Use `Wedding/backend/.htaccess` in the API document root. It proxies all non-file traffic to Node on port 3001.
   - **Do not** add a separate `RewriteRule` for `OPTIONS` that returns `R=200` without proxying; CORS preflight must reach Node so Express can respond with `204` and CORS headers.
   - CORS response headers come from the Node app only (Apache does not duplicate them, to avoid invalid double `Access-Control-Allow-Origin` values). After updates, re-upload `.htaccess` via FTP.

### 2. Frontend Deployment

1. **Upload Frontend Files**
   - Upload the entire `Wedding/frontend/` folder to your frontend domain's public_html directory
   - **Do NOT upload `node_modules`** - we will install dependencies on cPanel

2. **Set Environment Variables**
   - This repository includes `Wedding/frontend/.env.production` with the production API and site URLs. Create React App loads that file automatically when you run `npm run build` (no extra `.env` needed for a standard deploy).
   - Alternatively, create a `.env` or `.env.production` in the frontend root with:
     ```
     REACT_APP_API_URL=https://api.matthewandsydney.co.za
     REACT_APP_SITE_URL=https://matthewandsydney.co.za
     GENERATE_SOURCEMAP=false
     ```

3. **Install Dependencies on cPanel**
   - In cPanel Terminal or via SSH, navigate to the frontend directory
   - Run: `npm install`
   - This will install all dependencies needed for building

4. **Build the Frontend on cPanel**
   - While still in the frontend directory, run: `npm run build`
   - This will create a `build` folder with production files
   - The build process will use variables from `.env.production` (or `.env`) in the frontend root

5. **Move Build Files to Root**
   - Move all contents from the `build` folder to the `public_html` root directory
   - **CRITICAL**: Ensure the `.htaccess` file is in the root of `public_html` (same directory as `index.html`)
   - **`npm run build` copies `.htaccess` from `Wedding/frontend/public/.htaccess` into `build/`** (Create React App copies everything under `public/`). Upload the full `build` output so `/admin` and other client routes work; do not omit hidden files.
   - If you deploy without rebuilding, you can still upload `Wedding/frontend/.htaccess` manually (same rules as `public/.htaccess`).
   - You can optionally remove the source files and `node_modules` after building to save space
   - **Verify**: The `.htaccess` file should be at the same level as `index.html` in your `public_html` directory

6. **Verify Environment Variables**
   - The build process should have baked in the correct API URL from `.env.production` (or your `.env`)
   - Verify that all API calls point to `https://api.matthewandsydney.co.za`

### 3. Database Setup

1. **Initialize Database**
   - The SQLite database will be created automatically when the backend starts
   - If you need to seed initial data, access the `/api/seed` endpoint after deployment

2. **Database Backup**
   - The `data.sqlite` file will be created in the backend directory
   - Set up regular backups using cPanel's backup tools

### 4. Email Configuration

1. **SMTP Settings**
   - Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` (`true` or `false`), and when required `SMTP_USER` / `SMTP_PASS` in the backend `.env` file (see `Wedding/backend/env.production.txt`)
   - Optional: `SMTP_FROM` for the **From** address; `EMAIL_USER` / `EMAIL_PASS` are accepted as aliases for SMTP auth
   - Test email functionality using the admin panel

### 5. SSL Configuration

1. **Enable SSL**
   - Ensure SSL certificates are installed for both domains
   - Force HTTPS redirects in cPanel
   - Update any hardcoded HTTP URLs to HTTPS

### 6. Testing

1. **Health Check**
   - Visit `https://api.matthewandsydney.co.za/health`
   - Should return a JSON response with server status

2. **Frontend Access**
   - Visit `https://matthewandsydney.co.za`
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
     5. Test by accessing `https://matthewandsydney.co.za/.htaccess` - it should return 403 Forbidden (not 404), confirming the file exists
     6. Check cPanel error logs for any `.htaccess` syntax errors
   - **Alternative Solution:** If `.htaccess` rewrite rules don't work, you may need to configure the rewrite rules through cPanel's "Apache Handlers" or contact your hosting provider to enable `mod_rewrite` for your domain

2. **Build Script Issues**
   - If `npm run build:cpanel` doesn't work, use `npm run build` instead
   - Ensure environment variables are set in `.env` file before building
   - For frontend, the `.env` file must be in the frontend root directory before running `npm run build`
   - If build fails, check Node.js version (should be 22.5 or higher)
   - Some cPanel environments may require additional build tools - contact your hosting provider if builds fail

2. **CORS Errors**
   - Verify `FRONTEND_URL` and `ORIGIN_URL` in the backend `.env` match the public site (e.g. `https://matthewandsydney.co.za`, including `https` and no trailing slash unless you use that consistently).
   - If the browser reports CORS on a **500** response, fix the underlying server error (check Node logs); the app ships CORS headers on `/api` before rate limiting and on many error paths, but the real issue is often SQLite path/permissions or Node version.
   - Redeploy backend after changing `server.js` or `cors-origin.cjs` (`npm run build` in the backend folder, then restart the Node app).

3. **Node.js Application Not Starting**
   - Check the Node.js version (should be 22.5 or higher)
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
