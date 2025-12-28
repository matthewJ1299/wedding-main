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
   - Ensure all files including `node_modules` are uploaded

2. **Set Environment Variables**
   - Copy `env.production.txt` to `.env` in the backend root directory
   - Update the following values in `.env`:
     ```
     SMTP_USER=your-actual-email@gmail.com
     SMTP_PASS=your-actual-app-password
     JWT_SECRET=your-unique-jwt-secret-key
     SESSION_SECRET=your-unique-session-secret-key
     ```

3. **Install Dependencies**
   - In cPanel Terminal or via SSH, navigate to the backend directory
   - Run: `npm install --production`

4. **Start the Backend Service**
   - Use cPanel's Node.js Selector to create a new application
   - Set the application root to your backend directory
   - Set the application URL to `matthewandsydneyapi.triadtech.co.za`
   - Set the application startup file to `server.js`
   - Set Node.js version to 18.x or higher
   - Start the application

5. **Configure .htaccess**
   - The `.htaccess` file is already configured for the backend
   - It will proxy requests to the Node.js server running on port 3001

### 2. Frontend Deployment

1. **Build the Frontend**
   - On your local machine, navigate to `Wedding/frontend/`
   - Run: `npm run build:cpanel`
   - This will create a `build` folder with production files

2. **Upload Frontend Files**
   - Upload the contents of the `build` folder to your frontend domain's public_html directory
   - Upload the `.htaccess` file to the root of the frontend domain

3. **Verify Environment Variables**
   - The build process should have used the correct API URL
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

1. **CORS Errors**
   - Verify the `FRONTEND_URL` environment variable in the backend
   - Check that the frontend domain is correctly configured in CORS settings

2. **Node.js Application Not Starting**
   - Check the Node.js version (should be 18.x or higher)
   - Verify all dependencies are installed
   - Check the application logs in cPanel

3. **Database Issues**
   - Ensure the backend directory has write permissions
   - Check that SQLite is supported on your hosting

4. **File Upload Issues**
   - Verify the `uploads` directory exists and has write permissions
   - Check file size limits in both PHP and Node.js settings

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

## Support

If you encounter issues during deployment:
1. Check the troubleshooting section above
2. Review cPanel and hosting provider documentation
3. Check application logs for specific error messages
4. Verify all environment variables are correctly set
