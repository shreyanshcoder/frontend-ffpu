/**
 * Protected Route Component Module
 * Provides route protection based on authentication and role-based access control
 * Handles URL parameters for authentication tokens and user roles
 */

import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protected Route Component
 * Wraps routes that require authentication and specific role permissions
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered if access is granted
 * @param {string} props.requiredRole - Role required to access the route
 * @returns {React.ReactElement} Protected route component
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { checkAccess, updateAuth } = useAuth();
  /** Loading state while checking authentication */
  const [isChecking, setIsChecking] = useState(true);

  /**
   * Effect to handle URL parameters for authentication
   * Processes token, role, and email from URL if present
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlRole = params.get("role");
    const email = params.get("email");
    if (urlToken && urlRole && email) {
      updateAuth(urlToken, urlRole);
      localStorage.setItem("userName", email);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setIsChecking(false);
  }, [updateAuth]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (!checkAccess(requiredRole)) {
    return <Navigate to="/" state={{ openAuth: true }} />;
  }

  return children;
};

export default ProtectedRoute;
