/**
 * Main Application Component Module
 * Serves as the root component of the application
 * Handles routing and authentication context
 * Integrates Google OAuth for authentication
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes"; // Separate file for routes
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from './context/AuthContext';
import StrategyDetails from './components/SharedStrategy';
import GoogleAuthCallback from './components/GoogleAuthCallback';

/**
 * Main Application Component
 * Wraps the application with necessary providers and routing
 * 
 * @returns {React.ReactElement} The root application component
 */
const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/strategy/shared/:strategyId" element={<StrategyDetails />} />
            <Route path="/google/callback" element={<GoogleAuthCallback />} />
            <Route path="*" element={<AppRoutes />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
