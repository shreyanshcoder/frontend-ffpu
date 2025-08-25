/**
 * Authentication Context Module
 * Provides authentication state management and user role-based access control
 * throughout the application using React Context API
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, getUserRole, setToken, setUserRole } from "../utils/auth";

/**
 * Context object for authentication state
 * @type {React.Context}
 */
const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Manages authentication state and provides authentication-related functionality
 * to child components
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {React.ReactElement} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRoleState] = useState(null);

  /**
   * Initialize authentication state from stored tokens
   */
  useEffect(() => {
    const token = getToken();
    const role = getUserRole();
    setIsAuthenticated(!!token);
    setUserRoleState(role);
  }, []);

  /**
   * Updates authentication state with new token and role
   * 
   * @param {string} token - Authentication token
   * @param {string} role - User role
   */
  const updateAuth = (token, role) => {
    if (token) {
      setToken(token);
      setUserRole(role);
      setIsAuthenticated(true);
      setUserRoleState(role);

      // Dispatch event to notify other components about auth state change
      window.dispatchEvent(new Event("authStateChanged"));
    }
  };

  /**
   * Checks if user has required role for access
   * 
   * @param {string} requiredRole - Role required for access
   * @returns {boolean} Whether user has required role
   */
  const checkAccess = (requiredRole) => {
    const token = getToken();
    const role = getUserRole();
    return token && role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        checkAccess,
        updateAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * 
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
