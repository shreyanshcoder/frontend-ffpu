/**
 * Reset Password Component Module
 * Provides functionality for users to reset their password
 * Handles password reset token validation and new password submission
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import { API_ENDPOINTS } from "../config/config";
import theme from "../styles/theme"; // Import the custom theme
import Header from "../components/Header";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";

/**
 * Reset Password Component
 * Allows users to set a new password using a reset token
 * Validates token and handles password reset submission
 * 
 * @returns {React.ReactElement} Password reset form with validation
 */
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extract token from URL
  const navigate = useNavigate();
  
  /**
   * Form data state for password reset
   * @type {{new_password: string, confirm_password: string}}
   */
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  /**
   * Effect to validate reset token
   * Redirects to login if token is missing or invalid
   */
  useEffect(() => {
    if (!token) {
      showSnackbar("Invalid or expired reset link.");
      navigate("/login");
    }
  }, [token, navigate]);

  /**
   * Handles form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /**
   * Handles form submission for password reset
   * Validates passwords match and submits to API
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      return showSnackbar("Passwords do not match.");
    }

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("token", token);
      formDataToSend.append("new_password", formData.new_password);

      const res = await axios.post(
        API_ENDPOINTS.RESET_PASSWORD,
        formDataToSend, // Send as FormData
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important!
          },
        }
      );

      showSnackbar(res.data.message);
      navigate("/");
    } catch (err) {
      console.error(err.response);
      showSnackbar(err.response?.data?.detail || "Something went wrong.");
    }
  };

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

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Box sx={{ height: 120 }} />
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 5,
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom color="primary">
            Fidelfolio
          </Typography>
          <Typography variant="h6" align="center" gutterBottom color="primary">
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="new_password"
              label="New Password"
              type="password"
              fullWidth
              margin="dense"
              onChange={handleChange}
            />
            <TextField
              name="confirm_password"
              label="Confirm Password"
              type="password"
              fullWidth
              margin="dense"
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              sx={{ mt: 2 }}
            >
              Reset Password
            </Button>
          </form>
        </Box>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          message={snackbarMessage}
          onClose={handleSnackbarClose}
        />
      </Snackbar>
    </ThemeProvider>
  );
};

export default ResetPassword;
