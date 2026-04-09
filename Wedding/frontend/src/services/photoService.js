import { apiFetch } from './apiFetch';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Photo service for handling photo uploads and gallery operations
 */
export class PhotoService {
  /**
   * @param {File} file
   * @param {string} uploaderName
   * @param {string} uploaderEmail
   * @returns {Promise<Object>}
   */
  static async uploadPhoto(file, uploaderName = '', uploaderEmail = '') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploaderName', uploaderName);
    formData.append('uploaderEmail', uploaderEmail);

    return apiFetch(`${API_BASE}/api/photos`, {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * @param {boolean | null} approved
   * @returns {Promise<Array>}
   */
  static async getPhotos(approved = null) {
    let url = `${API_BASE}/api/photos`;
    if (approved !== null) {
      url += `?approved=${approved}`;
    }
    return apiFetch(url);
  }

  /**
   * @returns {Promise<Array>}
   */
  static async getApprovedPhotos() {
    return this.getPhotos(true);
  }

  /**
   * @returns {Promise<Array>}
   */
  static async getPendingPhotos() {
    return this.getPhotos(false);
  }

  /**
   * Binary photo from API (returns Blob).
   * @param {string} id
   * @returns {Promise<Blob>}
   */
  static async getPhoto(id) {
    const res = await apiFetch(`${API_BASE}/api/photos/${id}`, {
      parseJson: false,
    });
    return res.blob();
  }

  /**
   * @param {string} id
   * @returns {string}
   */
  static getPhotoUrl(id) {
    return `${API_BASE}/api/photos/${id}`;
  }

  /**
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  static async updatePhoto(id, updates) {
    return apiFetch(`${API_BASE}/api/photos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
  }

  /**
   * @param {string} id
   * @returns {Promise<Object>}
   */
  static async approvePhoto(id) {
    return this.updatePhoto(id, { approved: true });
  }

  /**
   * @param {string} id
   * @returns {Promise<Object>}
   */
  static async rejectPhoto(id) {
    return this.updatePhoto(id, { approved: false });
  }

  /**
   * @param {string} id
   * @returns {Promise<Object>}
   */
  static async deletePhoto(id) {
    return apiFetch(`${API_BASE}/api/photos/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * @param {File} file
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validateFile(file) {
    const errors = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('File too large. Maximum size is 10MB.');
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

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
  validateFile,
} = PhotoService;
