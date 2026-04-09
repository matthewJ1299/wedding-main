# Production Deployment Checklist

Use this checklist to ensure your wedding site is properly configured for production deployment.

## Pre-Deployment Checklist

### Environment Configuration
- [ ] Frontend `.env.production` created with correct API URL
- [ ] Backend `.env.production` created with all required variables
- [ ] Email credentials configured (Gmail app password)
- [ ] Admin email address set correctly
- [ ] JWT secret key changed from default
- [ ] CORS origin URL matches frontend domain

### Security
- [ ] Default admin password changed
- [ ] Environment files not committed to version control
- [ ] `DATABASE_URL` set and Postgres reachable from the app
- [ ] Upload directory permissions set correctly (755)
- [ ] SSL certificates installed for both domains
- [ ] HTTPS redirects configured

### File Permissions
- [ ] `uploads/` directory - 755 (read/write for app, read for web)
- [ ] `logs/` directory - 755 (read/write for app)
- [ ] `backups/` directory - 755 (read/write for app)
- [ ] `server.js` - 644 (read/execute for app)
- [ ] `.htaccess` files uploaded and configured

### Database Setup
- [ ] PostgreSQL provisioned and migrations applied (`npm run migrate`)
- [ ] Initial data seeded (if needed)
- [ ] Backup strategy implemented
- [ ] Database file not web-accessible

### Application Configuration
- [ ] Node.js version 18+ available
- [ ] All dependencies installed (`npm install`)
- [ ] Production build created (`npm run build`)
- [ ] Application starts successfully
- [ ] Health check endpoint responding
- [ ] API endpoints accessible

### Domain Configuration
- [ ] Frontend domain: `matthewandsydney.co.za`
- [ ] API domain: `api.matthewandsydney.co.za`
- [ ] DNS records configured correctly
- [ ] SSL certificates installed for both domains
- [ ] CORS configuration matches domains

## Post-Deployment Verification

### Frontend Testing
- [ ] Homepage loads correctly
- [ ] Navigation works properly
- [ ] RSVP functionality works
- [ ] Photo gallery loads
- [ ] Countdown timer displays
- [ ] All pages accessible
- [ ] Mobile responsiveness works

### Backend Testing
- [ ] Health check endpoint: `/api/health`
- [ ] Invitees API: `/api/invitees`
- [ ] Photos API: `/api/photos`
- [ ] Email sending works
- [ ] Admin login works
- [ ] Photo upload works
- [ ] Database operations work

### Admin Panel Testing
- [ ] Admin login accessible
- [ ] Invitee management works
- [ ] Photo approval/rejection works
- [ ] Email templates functional
- [ ] Summary dashboard displays
- [ ] CSV export works

### Email Configuration
- [ ] RSVP confirmation emails send
- [ ] Admin notification emails work
- [ ] Email templates render correctly
- [ ] SMTP authentication successful
- [ ] Email delivery to inbox (not spam)

### Photo Gallery Testing
- [ ] Photo upload works
- [ ] Photo approval process works
- [ ] Gallery displays approved photos
- [ ] Lightbox/modal viewer works
- [ ] Photo deletion works
- [ ] File size limits enforced

## Performance Testing

### Load Testing
- [ ] Homepage loads in under 3 seconds
- [ ] API responses under 1 second
- [ ] Photo uploads work under 10MB
- [ ] Multiple concurrent users supported
- [ ] Database queries optimized

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Security Testing

### Access Control
- [ ] Admin routes protected
- [ ] Guest routes accessible
- [ ] CORS headers configured correctly
- [ ] File upload restrictions working
- [ ] SQL injection prevention tested

### Data Protection
- [ ] User data properly sanitized
- [ ] File uploads validated
- [ ] Database queries parameterized
- [ ] Error messages don't expose sensitive data
- [ ] Logs don't contain sensitive information

## Monitoring Setup

### Logging
- [ ] Application logs being written
- [ ] Error logs being captured
- [ ] Log rotation configured
- [ ] Log file permissions correct
- [ ] Log monitoring in place

### Health Monitoring
- [ ] Health check endpoint monitoring
- [ ] Database connectivity monitoring
- [ ] File system monitoring
- [ ] Email service monitoring
- [ ] Uptime monitoring configured

## Backup Verification

### Database Backups
- [ ] Backup script working
- [ ] Backup files created successfully
- [ ] Backup restoration tested
- [ ] Automated backup schedule set
- [ ] Backup retention policy configured

### File Backups
- [ ] Upload directory backed up
- [ ] Configuration files backed up
- [ ] Database file backed up
- [ ] Backup verification process
- [ ] Recovery procedure documented

## Documentation

### User Documentation
- [ ] Admin user guide created
- [ ] Deployment guide updated
- [ ] Troubleshooting guide available
- [ ] Contact information provided
- [ ] FAQ section updated

### Technical Documentation
- [ ] API documentation available
- [ ] Database schema documented
- [ ] Environment variables documented
- [ ] Security considerations documented
- [ ] Maintenance procedures documented

## Go-Live Checklist

### Final Verification
- [ ] All tests passing
- [ ] Performance metrics acceptable
- [ ] Security scan completed
- [ ] Backup procedures tested
- [ ] Monitoring alerts configured

### Launch Preparation
- [ ] DNS propagation verified
- [ ] SSL certificates active
- [ ] Admin credentials distributed
- [ ] Support contacts available
- [ ] Rollback plan prepared

### Post-Launch
- [ ] Monitor for first 24 hours
- [ ] Check error logs regularly
- [ ] Verify email delivery
- [ ] Test user feedback channels
- [ ] Document any issues found

## Emergency Procedures

### Incident Response
- [ ] Contact information for hosting provider
- [ ] Database backup restoration procedure
- [ ] Application restart procedure
- [ ] Emergency maintenance mode
- [ ] User communication plan

### Rollback Plan
- [ ] Previous version backup available
- [ ] Database rollback procedure
- [ ] File rollback procedure
- [ ] DNS rollback procedure
- [ ] Communication plan for users

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Verified By**: _______________
**Sign-off**: _______________





