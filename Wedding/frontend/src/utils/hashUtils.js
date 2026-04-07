/**
 * Hash utility functions for secure password handling.
 * Uses the Web Crypto API for secure hashing.
 */

/**
 * Check if crypto.subtle is available (requires HTTPS/secure context)
 * @returns {boolean} - True if crypto.subtle is available
 */
const isCryptoAvailable = () => {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' &&
         typeof window !== 'undefined' &&
         window.isSecureContext;
};

/**
 * Hash a password using SHA-256 algorithm
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password as a hexadecimal string
 * @throws {Error} - If crypto.subtle is not available (requires HTTPS)
 */
export const hashPassword = async (password) => {
  // Check if crypto.subtle is available
  if (!isCryptoAvailable()) {
    throw new Error(
      'Secure context required: crypto.subtle is only available over HTTPS. ' +
      'Please ensure the site is accessed via HTTPS (https://matthewandsydney.co.za)'
    );
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password. Please ensure you are accessing the site over HTTPS.');
  }
};

/**
 * Verify if a provided password matches a stored hash
 * @param {string} password - The plain text password to verify
 * @param {string} storedHash - The stored hash to compare against
 * @returns {Promise<boolean>} - True if the password matches, false otherwise
 */
export const verifyPassword = async (password, storedHash) => {
  try {
    const hashedInput = await hashPassword(password);
    return hashedInput === storedHash;
  } catch (error) {
    console.error('Password verification error:', error);
    // Re-throw the error so the caller can handle it appropriately
    throw error;
  }
};