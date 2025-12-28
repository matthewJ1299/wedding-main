/**
 * Email tracking service for wedding application
 * Tracks email sends, delivery status, and provides statistics
 */

// Local storage key for email tracking data
const EMAIL_TRACKING_KEY = 'wedding_email_tracking';

/**
 * Email event types
 */
export const EMAIL_EVENTS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  OPENED: 'opened',
  CLICKED: 'clicked',
  FAILED: 'failed'
};

/**
 * Get all email tracking records
 * 
 * @returns {Array} Array of email tracking records
 */
export const getAllEmailTracking = () => {
  try {
    const tracking = localStorage.getItem(EMAIL_TRACKING_KEY);
    return tracking ? JSON.parse(tracking) : [];
  } catch (error) {
    console.error('Error retrieving email tracking data:', error);
    return [];
  }
};

/**
 * Add a new email tracking record
 * 
 * @param {Object} emailData - Email data to track
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.templateId - ID of the template used
 * @param {string} emailData.event - Event type (sent, delivered, opened, etc.)
 * @param {Object} [emailData.metadata] - Additional metadata
 * @returns {Object} The created tracking record
 */
export const trackEmail = (emailData) => {
  try {
    const tracking = getAllEmailTracking();
    
    const trackingRecord = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...emailData
    };
    
    tracking.push(trackingRecord);
    localStorage.setItem(EMAIL_TRACKING_KEY, JSON.stringify(tracking));
    
    return trackingRecord;
  } catch (error) {
    console.error('Error tracking email:', error);
    return null;
  }
};

/**
 * Update an existing email tracking record
 * 
 * @param {string} id - Tracking record ID
 * @param {Object} updateData - Data to update
 * @returns {Object|null} Updated tracking record or null if not found
 */
export const updateEmailTracking = (id, updateData) => {
  try {
    const tracking = getAllEmailTracking();
    const index = tracking.findIndex(record => record.id === id);
    
    if (index === -1) return null;
    
    const updatedRecord = {
      ...tracking[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    tracking[index] = updatedRecord;
    localStorage.setItem(EMAIL_TRACKING_KEY, JSON.stringify(tracking));
    
    return updatedRecord;
  } catch (error) {
    console.error('Error updating email tracking:', error);
    return null;
  }
};

/**
 * Get email tracking statistics
 * 
 * @returns {Object} Email statistics
 */
export const getEmailStatistics = () => {
  try {
    const tracking = getAllEmailTracking();
    
    // Group by date (YYYY-MM-DD)
    const groupedByDate = tracking.reduce((acc, record) => {
      const date = record.timestamp.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(record);
      return acc;
    }, {});
    
    // Count events by type
    const eventCounts = tracking.reduce((acc, record) => {
      const event = record.event || 'unknown';
      acc[event] = (acc[event] || 0) + 1;
      return acc;
    }, {});
    
    // Count by template
    const templateCounts = tracking.reduce((acc, record) => {
      if (record.templateId) {
        acc[record.templateId] = (acc[record.templateId] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Get top recipients
    const recipientCounts = tracking.reduce((acc, record) => {
      if (record.to) {
        acc[record.to] = (acc[record.to] || 0) + 1;
      }
      return acc;
    }, {});
    
    const topRecipients = Object.entries(recipientCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, count]) => ({ email, count }));
    
    // Create timeline data for chart
    const timelineData = Object.entries(groupedByDate)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .map(([date, records]) => ({
        date,
        sent: records.filter(r => r.event === EMAIL_EVENTS.SENT).length,
        opened: records.filter(r => r.event === EMAIL_EVENTS.OPENED).length,
        failed: records.filter(r => r.event === EMAIL_EVENTS.FAILED).length
      }));
    
    return {
      totalEmails: tracking.length,
      eventCounts,
      templateCounts,
      topRecipients,
      timelineData
    };
  } catch (error) {
    console.error('Error getting email statistics:', error);
    return {
      totalEmails: 0,
      eventCounts: {},
      templateCounts: {},
      topRecipients: [],
      timelineData: []
    };
  }
};

/**
 * Clear all email tracking data
 */
export const clearEmailTracking = () => {
  localStorage.removeItem(EMAIL_TRACKING_KEY);
};

/**
 * Generate a tracking pixel HTML for email opens
 * 
 * @param {string} trackingId - Tracking ID
 * @returns {string} HTML for tracking pixel
 */
export const generateTrackingPixel = (trackingId) => {
  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const trackingUrl = `${apiBase}/api/track-email?id=${trackingId}&event=opened`;
  return `<img src="${trackingUrl}" width="1" height="1" alt="" style="display:none;" />`;
};

/**
 * Add tracking to links in HTML content
 * 
 * @param {string} html - HTML content
 * @param {string} trackingId - Tracking ID
 * @returns {string} HTML with tracking links
 */
export const addLinkTracking = (html, trackingId) => {
  // Simple implementation - in a real app, you'd use a proper HTML parser
  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  return html.replace(
    /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["']/gi,
    (match, url) => {
      const trackingUrl = `${apiBase}/api/track-email?id=${trackingId}&event=clicked&url=${encodeURIComponent(url)}`;
      return `<a href="${trackingUrl}" target="_blank" rel="noopener"`;
    }
  );
};