/**
 * Footer Component Module
 * Provides a fixed position footer with social media links
 * Displays company social media icons with hover effects
 */

import React from "react";
import { Box, IconButton } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

/**
 * Footer Component
 * Renders a fixed position footer with social media links
 * 
 * @returns {React.ReactElement} Footer component with social media links
 */
const Footer = () => {
  /**
   * Social media links configuration
   * @type {Array<{icon: React.ReactElement, url: string, label: string}>}
   */
  const socialLinks = [
    {
      icon: <LinkedInIcon />,
      url: "https://www.linkedin.com/company/fidelfolio-investments/",
      label: "LinkedIn",
    },
    {
      icon: <TwitterIcon />,
      url: "https://x.com/fidelfolio",
      label: "Twitter",
    },
    {
      icon: <YouTubeIcon />,
      url: "https://www.youtube.com/@fidelfolio",
      label: "YouTube",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        left: 20,
        bottom: 20,
        zIndex: 1000,
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
        gap: 1,
      }}
    >
      {socialLinks.map((social, index) => (
        <IconButton
          key={index}
          component="a"
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          sx={{
            color: "primary.main",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.1)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {social.icon}
        </IconButton>
      ))}
    </Box>
  );
};

export default Footer;
