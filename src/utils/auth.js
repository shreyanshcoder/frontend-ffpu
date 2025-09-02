/**
 * Authentication Utilities Module
 * Provides functions for managing authentication tokens and user roles
 * in local storage with proper event handling for state changes
 */

/**
 * Stores the authentication token in local storage
 * @param {string} token - The authentication token to store
 */
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

/**
 * Retrieves the authentication token from local storage
 * @returns {string|null} The stored authentication token or null if not found
 */
export const getToken = () => localStorage.getItem("token");

/**
 * Removes authentication data from local storage and notifies components
 * Clears token, user role, and username on logout
 */
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole"); // Clear role on logout
  localStorage.removeItem("userName"); // Clear username on logout

  // Dispatch event to notify other components about auth state change
  window.dispatchEvent(new Event("authStateChanged"));
};

/**
 * Stores the user role in local storage
 * @param {string} role - The user role to store
 */
export const setUserRole = (role) => {
  if (role) {
    localStorage.setItem("userRole", role);
  }
};

/**
 * Retrieves the user role from local storage
 * @returns {string|null} The stored user role or null if not found
 */
export const getUserRole = () => {
  return localStorage.getItem("userRole") || null;
};

/**
 * Checks if a user is currently authenticated
 * @returns {boolean} True if a token exists, false otherwise
 */
export const isAuthenticated = () => !!getToken();
