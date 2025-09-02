/**
 * Email Verification Success Page Component Module
 * Displays a success message after email verification
 * Provides navigation back to the home page
 * Features responsive design and animated button effects
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Container,
  Box,
  ThemeProvider,
} from "@mui/material";
import theme from "../styles/theme"; // Import the custom theme
import Header from "../components/Header";

/**
 * Email Verified Component
 * Renders a success message and navigation button
 * Confirms successful email verification to the user
 * 
 * @returns {React.ReactElement} Email verification success page
 */
const EmailVerified = () => {
  /** Router navigation hook */
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Box sx={{ height: "120px" }} />
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 5,
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "background.paper",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              fontSize: { xs: "1.8rem", md: "2.4rem" },
            }}
          >
            Fidelfolio
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Email Verified Successfully 🎉
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
            Your email has been successfully verified. You can now access your
            account.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate("/")}
            sx={{
              mt: 2,
              px: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: "0.9rem", md: "1rem" },
              borderRadius: 1,
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0, 128, 0, 0.3)",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 6px 14px rgba(0, 128, 0, 0.4)",
              },
            }}
          >
            Go to Home
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EmailVerified;
