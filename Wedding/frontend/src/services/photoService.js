const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Photo service for handling photo uploads and gallery operations
 */
export class PhotoService {
  /**
   * Upload a photo
   * @param {File} file - Photo file to upload
   * @param {string} uploaderName - Name of the uploader
   * @param {string} uploaderEmail - Email of the uploader
   * @returns {Promise<Object>} - Uploaded photo data
   */
  static async uploadPhoto(file, uploaderName = '', uploaderEmail = '') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploaderName', uploaderName);
    formData.append('uploaderEmail', uploaderEmail);

    const response = await fetch(`${API_BASE}/api/photos`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload photo');
    }

    return response.json();
  }

  /**
   * Get all photos
   * @param {boolean} approved - Filter by approval status
   * @returns {Promise<Array>} - Array of photos
   */
  static async getPhotos(approved = null) {
    let url = `${API_BASE}/api/photos`;
    
    if (approved !== null) {
      url += `?approved=${approved}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch photos');
    }

    return response.json();
  }

  /**
   * Get approved photos for gallery display
   * @returns {Promise<Array>} - Array of approved photos
   */
  static async getApprovedPhotos() {
    return this.getPhotos(true);
  }

  /**
   * Get pending photos for admin review
   * @returns {Promise<Array>} - Array of pending photos
   */
  static async getPendingPhotos() {
    return this.getPhotos(false);
  }

  /**
   * Get photo by ID
   * @param {string} id - Photo ID
   * @returns {Promise<Object>} - Photo data
   */
  static async getPhoto(id) {
    const response = await fetch(`${API_BASE}/api/photos/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch photo');
    }

    return response.json();
  }

  /**
   * Get photo image URL
   * @param {string} id - Photo ID
   * @returns {string} - Photo image URL
   */
  static getPhotoUrl(id) {
    return `${API_BASE}/api/photos/${id}`;
  }

  /**
   * Update photo (approve/reject)
   * @param {string} id - Photo ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} - Updated photo data
   */
  static async updatePhoto(id, updates) {
    const response = await fetch(`${API_BASE}/api/photos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update photo');
    }

    return response.json();
  }

  /**
   * Approve a photo
   * @param {string} id - Photo ID
   * @returns {Promise<Object>} - Updated photo data
   */
  static async approvePhoto(id) {
    return this.updatePhoto(id, { approved: true });
  }

  /**
   * Reject a photo
   * @param {string} id - Photo ID
   * @returns {Promise<Object>} - Updated photo data
   */
  static async rejectPhoto(id) {
    return this.updatePhoto(id, { approved: false });
  }

  /**
   * Delete a photo
   * @param {string} id - Photo ID
   * @returns {Promise<Object>} - Deletion result
   */
  static async deletePhoto(id) {
    const response = await fetch(`${API_BASE}/api/photos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete photo');
    }

    return response.json();
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @returns {Object} - Validation result
   */
  static validateFile(file) {
    const errors = [];

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('File too large. Maximum size is 10MB.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export individual functions for backward compatibility
export const {
  uploadPhoto,
  getPhotos,
  getApprovedPhotos,
  getPendingPhotos,
  getPhoto,
  getPhotoUrl,
  updatePhoto,
  approvePhoto,
  rejectPhoto,
  deletePhoto,
  validateFile
} = PhotoService;





