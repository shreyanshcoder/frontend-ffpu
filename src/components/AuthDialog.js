/**
 * Authentication Dialog Component Module
 * Provides a modal dialog for user authentication
 * Includes login, signup, and password recovery functionality
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
  Link,
  Box,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { GoogleLogin } from "@react-oauth/google";
import useAuth from "../hooks/useAuth";
import Preloader from "./Preloader";
import { getToken } from "../utils/auth";

/**
 * Authentication Dialog Component
 * Modal dialog for user authentication with multiple tabs
 * Handles login, signup, and password recovery
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls dialog visibility
 * @param {Function} props.handleClose - Function to close the dialog
 * @returns {React.ReactElement} Authentication dialog with multiple tabs
 */
const AuthDialog = ({ open, handleClose }) => {
  /** Current tab index (0: login, 1: signup) */
  const [tabIndex, setTabIndex] = useState(0);
  /** Authentication hook for handling auth operations */
  const {
    handleSubmit,
    handleChange,
    formData,
    setFormData,
    handleGoogleAuth,
    handleForgotPassword,
    loading,
    snackbarOpen,
    snackbarMessage,
    handleSnackbarClose,
  } = useAuth(tabIndex, handleClose);

  /** State for forgot password email input */
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  /** State to control forgot password form visibility */
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  /**
   * Effect to close dialog when user is authenticated
   * Listens for authentication state changes
   */
  useEffect(() => {
    /**
     * Checks if user is authenticated and closes dialog if needed
     */
    const checkAuth = () => {
      const token = getToken();
      if (token && open) {
        handleClose();
      }
    };

    // Check on mount and when auth state changes
    checkAuth();
    window.addEventListener("authStateChanged", checkAuth);

    return () => {
      window.removeEventListener("authStateChanged", checkAuth);
    };
  }, [open, handleClose]);

  /**
   * Shows the forgot password form
   */
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  /**
   * Returns to the login form from forgot password
   * Resets form state
   */
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    handleSnackbarClose();
  };

  /**
   * Handles forgot password form submission
   * @param {Event} e - Form submission event
   */
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const success = await handleForgotPassword(forgotPasswordEmail);
    if (success) {
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    }
  };

  if (showForgotPassword) {
    return (
      <>
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            ".MuiDialog-paper": {
              borderRadius: "20px",
              padding: "20px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <DialogTitle
            sx={{ textAlign: "center", fontWeight: "bold", color: "#2e7d32" }}
          >
            Forgot Password
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", right: 10, top: 10 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleForgotPasswordSubmit}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Enter your email address and we'll send you a link to reset your
                password.
              </Typography>
              <TextField
                fullWidth
                label="Email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                margin="dense"
              />
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleBackToLogin}
                  disabled={loading}
                  sx={{ borderRadius: 1 }}
                >
                  Back to Login
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ backgroundColor: "#388e3c", borderRadius: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
                </Button>
              </Box>
            </form>
          </DialogContent>
        </Dialog>
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
      </>
    );
  }

  return (
    <>
      {loading && <Preloader />}
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          ".MuiDialog-paper": {
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", color: "#2e7d32" }}
        >
          {tabIndex === 0 ? "Login" : "Sign Up"}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          centered
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#2e7d32" },
            "& .MuiTab-root": { color: "#2e7d32" },
            "& .Mui-selected": { color: "#2e7d32", fontWeight: "bold" },
          }}
        >
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        <DialogContent>
          <form onSubmit={handleSubmit}>
            {tabIndex === 1 && (
              <TextField
                name="name"
                label="Name"
                onChange={handleChange}
                fullWidth
                margin="dense"
              />
            )}
            <TextField
              name="email"
              label="Email"
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            {tabIndex === 1 && (
              <TextField
                name="mobile"
                label="Phone Number"
                onChange={handleChange}
                fullWidth
                margin="dense"
              />
            )}
            <TextField
              name="password"
              label="Password"
              type="password"
              onChange={handleChange}
              fullWidth
              margin="dense"
            />

            {tabIndex === 1 && (
              <>
                <TextField
                  name="confirm_password"
                  label="Confirm Password"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        setFormData({ ...formData, terms: e.target.checked })
                      }
                    />
                  }
                  label="I accept the terms and conditions"
                />
              </>
            )}

            {tabIndex === 0 && (
              <Typography align="center" sx={{ mt: 1 }}>
                <Link
                  component="button"
                  type="button"
                  onClick={handleForgotPasswordClick}
                  sx={{
                    color: "#2e7d32",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Forgot Password?
                </Link>
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#388e3c",
                color: "white",
                borderRadius: 1,
              }}
            >
              {tabIndex === 0 ? "Login" : "Sign Up"}
            </Button>

            <br />
            <br />
            <GoogleLogin
              onSuccess={handleGoogleAuth}
              text={tabIndex === 0 ? "signin_with" : "signup_with"}
            />
          </form>
        </DialogContent>
      </Dialog>
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
    </>
  );
};

export default AuthDialog;
