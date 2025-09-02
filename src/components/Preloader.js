/**
 * Preloader Component Module
 * Provides a full-screen loading overlay with a circular progress indicator
 * Includes a frosted glass effect and animated loading text
 */

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

/**
 * Preloader Component
 * Renders a full-screen loading overlay with a centered circular progress indicator
 * and loading text
 * 
 * @returns {React.ReactElement} Full-screen loading overlay
 */
const Preloader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)", // Frosted glass effect
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        animation: "fadeIn 0.5s ease-in-out",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          animation: "scaleUp 1.5s infinite alternate ease-in-out",
        }}
      >
        <CircularProgress
          sx={{
            color: "#2e7d32",
            filter: "drop-shadow(0px 0px 10px #f4f6f8)",
          }}
        />
        <span
          style={{
            color: "#fff",
            fontSize: "18px",
            fontWeight: "bold",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Loading...
        </span>
      </Box>
    </Box>
  );
};

export default Preloader;
