/**
 * Application Routes Module
 * Defines the main routing configuration for the application using React Router
 * Includes protected routes for authenticated users and public routes
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Screens from "../pages/ScreensPage";
// import AdminPage from "../pages/AdminPage";
import UnauthorizedPage from "../pages/Unauthorized";
import ProtectedRoute from "../utils/ProtectedRoute";
import ResetPassword from "../components/ResetPassword";
import EmailVerified from "../pages/EmailVerfiedPage";
import CreateScreens from "../pages/CreateScreensPage";
import UserDetails from "../pages/UserDetails";
import BackTestingGuide from "../pages/BackTestingGuide";
import ResultAnalysisGuide from "../pages/ResultAnalysisGuide";

/**
 * Main routing component for the application
 * Defines all available routes and their corresponding components
 * 
 * @returns {React.ReactElement} Routes configuration
 */
const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/screens" element={<Screens />} />
        <Route path="/create-screens" element={<CreateScreens />} />
        
        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="Standard User">
              <UserDetails />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Route (Currently Commented Out) */}
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminPage />
            </ProtectedRoute>
          }
        /> */}
        
        {/* Error and Guide Routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/guides/backtesting" element={<BackTestingGuide />} />
        <Route path="/guides/analysis" element={<ResultAnalysisGuide />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
