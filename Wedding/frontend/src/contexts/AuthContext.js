import { createContext, useContext, useState, useEffect } from 'react';
import { verifyPassword } from '../utils/hashUtils';

// Create the authentication context
const AuthContext = createContext({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

/**
 * Constants for authentication storage
 */
const AUTH_STORAGE_KEY = 'wedding_auth';

/**
 * Default values
 */
// Hardcoded hashed password (for demo purposes)
// In production, this should come from an environment variable or secure config
// The default password is "weddingadmin" - you should change this
const DEFAULT_HASHED_PASSWORD = 'a90624b5bdbd2a12214ae911392133ba6ae48cae5650ce6000ef1fae3bac512a'; // SHA-256 of "weddingadmin"

/**
 * Provider component that wraps your app and makes auth available to any
 * child component that calls useAuth().
 */
export const AuthProvider = ({ children, storedHash = DEFAULT_HASHED_PASSWORD }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication on component mount
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  /**
   * Log in with password
   * @param {string} password - The password to verify
   * @returns {Promise<boolean>} - True if login successful, false otherwise
   */
  const login = async (password) => {
    try {
      const isValid = await verifyPassword(password, storedHash);
      if (isValid) {
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * Log out and clear authentication state
   */
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Make the context object with the functions and state:
  const contextValue = {
    isAuthenticated,
    login,
    logout,
  };

  // Pass the value into the context provider and return
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for components to get the current auth state and functions
 */
export const useAuth = () => useContext(AuthContext);