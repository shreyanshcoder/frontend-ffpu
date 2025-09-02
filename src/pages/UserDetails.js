/**
 * User Details Page Component Module
 * Provides a user profile management interface
 * Allows viewing and editing user information
 * Includes profile picture, personal details, and edit functionality
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Container,
  Box,
  ThemeProvider,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import theme from "../styles/theme";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import Footer from "../components/Footer";

/**
 * User Details Component
 * Displays and manages user profile information
 * Provides functionality to view and edit user details
 * 
 * @returns {React.ReactElement} User profile management interface
 */
const UserDetails = () => {
  /** Authentication hook for user operations */
  const { handleGetUserDetails, updateUserDetails } = useAuth();
  /** State for user profile data */
  const [userDetails, setUserDetails] = useState(null);
  /** State to control edit mode */
  const [isEditing, setIsEditing] = useState(false);
  /** State for form input data */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
  });
  /** State for loading status */
  const [loading, setLoading] = useState(true);
  /** State for user's display initial */
  const [userInitial, setUserInitial] = useState("");

  /**
   * Fetches user details from the server
   * Updates local state with user information
   * Sets up initial form data and user display initial
   */
  const fetchUserDetails = useCallback(async () => {
    const email = localStorage.getItem("userName");
    if (email && loading) {
      setLoading(true);
      const details = await handleGetUserDetails(email);
      setUserDetails(details || {});
      setFormData({
        name: details?.name || "",
        email: details?.email || "",
        phone_number: details?.phone_number || "",
      });

      // Set user initial from name or email
      const name = details?.name || email;
      const initial = name ? name.charAt(0).toUpperCase() : "U";
      setUserInitial(initial);

      setLoading(false);
    }
  }, [handleGetUserDetails, loading]);

  /**
   * Effect to fetch user details on component mount
   */
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  /**
   * Toggles edit mode for user details
   */
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  /**
   * Handles form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission for updating user details
   * Updates user information and refreshes the page
   */
  const handleUpdate = async () => {
    const email = localStorage.getItem("userName");
    const updatedDetails = { ...formData, email };
    await updateUserDetails(updatedDetails);
    setIsEditing(false);
    window.location.reload();
  };

  /**
   * Cancels edit mode and resets form data
   */
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      phone_number: userDetails?.phone_number || "",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "rgba(96, 173, 94, 0.1)" }}>
        <Header />
        <Box sx={{ height: "100px" }} />
        <Container maxWidth="sm">
          <Box
            sx={{
              mt: 5,
              p: 4,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "background.paper",
              textAlign: "center",
              background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 70,
                height: 70,
                margin: "0 auto 20px",
                backgroundColor: "primary.main",
                fontSize: "2.5rem",
                fontWeight: "bold",
              }}
            >
              {userInitial}
            </Avatar>

            <Typography
              variant="h5"
              color="primary"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              User Profile
            </Typography>

            {loading ? (
              <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
                Loading user details...
              </Typography>
            ) : userDetails ? (
              isEditing ? (
                <Box sx={{ textAlign: "left", mt: 3 }}>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                  <TextField
                    label="Phone Number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdate}
                      sx={{ mr: 2, borderRadius: 1 }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCancel}
                      sx={{ borderRadius: 1 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: "left", mt: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PersonIcon sx={{ color: "primary.main", mr: 2 }} />
                    <Typography variant="body1">
                      <strong>Name:</strong> {userDetails.name || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EmailIcon sx={{ color: "primary.main", mr: 2 }} />
                    <Typography variant="body1">
                      <strong>Email:</strong> {userDetails.email || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <WorkIcon sx={{ color: "primary.main", mr: 2 }} />
                    <Typography variant="body1">
                      <strong>Phone Number:</strong>{" "}
                      {userDetails.phone_number || "N/A"}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleEditToggle}
                    sx={{
                      borderRadius: 1,
                      px: 3,
                      py: 1.5,
                      fontWeight: "bold",
                      boxShadow: "0 4px 10px rgba(0, 128, 0, 0.3)",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 6px 14px rgba(0, 128, 0, 0.4)",
                      },
                      display: "block",
                      mx: "auto",
                      width: "fit-content",
                    }}
                  >
                    Update Details
                  </Button>
                </Box>
              )
            ) : (
              <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
                No user details found.
              </Typography>
            )}
          </Box>
        </Container>
        <Box sx={{ height: "210px" }} />
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default UserDetails;
