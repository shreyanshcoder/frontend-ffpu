/**
 * Google Authentication Callback Component Module
 * Handles the OAuth callback from Google authentication
 * Processes authentication tokens and redirects users appropriately
 */

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Preloader from "./Preloader";

/**
 * Google Authentication Callback Component
 * Processes the OAuth callback from Google authentication service
 * Extracts authentication parameters from URL and updates application state
 * 
 * @returns {React.ReactElement} Loading screen while processing authentication
 */
const GoogleAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateAuth } = useAuth();

  /**
   * Effect to process Google authentication parameters
   * Extracts email, token, and role from URL and updates authentication state
   */
  useEffect(() => {
    /**
     * Process Google authentication parameters from URL
     * Updates authentication state and redirects user
     */
    const processGoogleAuth = () => {
      // Get parameters from URL
      const params = new URLSearchParams(location.search);
      const email = params.get("email");
      const token = params.get("token");
      const role = params.get("role");

      if (email && token && role) {
        // Update authentication state
        updateAuth(token, role);

        // Store user information
        localStorage.setItem("userName", email);

        // Redirect to screens page
        navigate("/screens");
      } else {
        // If parameters are missing, redirect to home page
        navigate("/");
      }
    };

    processGoogleAuth();
  }, [location, navigate, updateAuth]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Preloader />
      <p>Processing Google authentication...</p>
    </div>
  );
};

export default GoogleAuthCallback;
