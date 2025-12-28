/**
 * Hash utility functions for secure password handling.
 * Uses the Web Crypto API for secure hashing.
 */

/**
 * Hash a password using SHA-256 algorithm
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password as a hexadecimal string
 */
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Verify if a provided password matches a stored hash
 * @param {string} password - The plain text password to verify
 * @param {string} storedHash - The stored hash to compare against
 * @returns {Promise<boolean>} - True if the password matches, false otherwise
 */
export const verifyPassword = async (password, storedHash) => {
  const hashedInput = await hashPassword(password);
  return hashedInput === storedHash;
};