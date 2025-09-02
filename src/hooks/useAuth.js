/**
 * Authentication Hook Module
 * Provides comprehensive authentication functionality including login, signup,
 * Google authentication, password management, and user profile operations
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/config";
import { useAuth as useAuthContext } from "../context/AuthContext";

/**
 * Custom hook for handling authentication operations
 *
 * @param {number} tabIndex - Index indicating current auth tab (0: login, 1: signup)
 * @param {Function} handleClose - Function to close the auth modal/dialog
 * @returns {Object} Authentication-related functions and state
 */
const useAuth = (tabIndex, handleClose) => {
  const { updateAuth } = useAuthContext();

  /**
   * Form data state for authentication
   * @type {Object}
   */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
    terms: false,
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  /**
   * Handles form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /**
   * Closes the snackbar notification
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  /**
   * Displays a snackbar notification with the given message
   * @param {string} message - Message to display
   */
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  /**
   * Handles form submission for login/signup
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!formData.email || !formData.password) {
      return showSnackbar("Please fill in all required fields.");
    }
    if (
      tabIndex === 1 &&
      (!formData.name || !formData.mobile || !formData.confirm_password)
    ) {
      return showSnackbar("Please complete all fields.");
    }
    if (tabIndex === 1 && formData.password !== formData.confirm_password) {
      return showSnackbar("Passwords do not match.");
    }
    if (tabIndex === 1 && !formData.terms) {
      return showSnackbar("You must accept the terms.");
    }

    setLoading(true);
    try {
      const endpoint =
        tabIndex === 0 ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.SIGNUP;
      const res = await axios.post(endpoint, formData);
      console.log(res);
      updateAuth(res.data.token, res.data.role);
      navigate(tabIndex === 0 ? "/screens" : "/", {
        state: { openAuth: true },
      });
      handleClose();
      localStorage.setItem("userName", formData.email);

      window.dispatchEvent(new Event("authStateChanged"));
    } catch (err) {
      console.error("Error Details:", err.response);
      showSnackbar(err.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiates Google OAuth authentication
   */
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      window.location.href = API_ENDPOINTS.GOOGLE_LOGIN;
    } catch (error) {
      console.error("Google Authentication Error:", error);
      showSnackbar("Google authentication failed.");
      setLoading(false);
    }
  };

  /**
   * Handles forgot password request
   * @param {string} email - User's email address
   * @returns {Promise<boolean>} Success status of the operation
   */
  const handleForgotPassword = async (email) => {
    if (!email) {
      showSnackbar("Please enter your email.");
      return false;
    }

    setLoading(true);
    try {
      const res = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      showSnackbar(
        res.data.message || "Password reset link sent to your email."
      );
      return true;
    } catch (error) {
      console.error("Forgot Password Error:", error);
      if (error.response) {
        if (error.response.status === 404) {
          showSnackbar("No registered user found with this email address.");
        } else {
          showSnackbar(
            error.response.data?.detail ||
              error.response.data?.message ||
              "Failed to send password reset email."
          );
        }
      } else if (error.request) {
        showSnackbar("No response from server. Please try again.");
      } else {
        showSnackbar("An error occurred. Please try again.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retrieves user details from the server
   * @param {string} email - User's email address
   * @returns {Promise<Object|null>} User details or null if failed
   */
  const handleGetUserDetails = async (email) => {
    if (!email) {
      showSnackbar("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.GET_USER_DETAILS, {
        email,
      });
      return response.data.user_details;
    } catch (error) {
      console.error("Error fetching user details:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to get user details."
      );
      return null;
    }
  };

  /**
   * Updates user profile details
   * @param {Object} userDetails - Updated user details
   */
  const updateUserDetails = async (userDetails) => {
    try {
      const response = await axios.put(
        API_ENDPOINTS.UPDATE_USER_DETAILS,
        userDetails
      );
      showSnackbar(
        response.data.message || "User details updated successfully."
      );
    } catch (error) {
      console.error("Error updating user details:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to update user details."
      );
    }
  };

  return {
    handleSubmit,
    handleChange,
    formData,
    setFormData,
    handleGoogleAuth,
    forgotPasswordEmail,
    setForgotPasswordEmail,
    handleForgotPassword,
    loading,
    handleGetUserDetails,
    updateUserDetails,
    snackbarOpen,
    snackbarMessage,
    handleSnackbarClose,
  };
};

export default useAuth;
