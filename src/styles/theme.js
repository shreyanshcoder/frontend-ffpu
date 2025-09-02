/**
 * Material-UI Theme Configuration Module
 * Defines the application's visual theme including colors, typography,
 * spacing, and component-specific styles using Material-UI's theming system
 */

import { createTheme } from "@mui/material/styles";

/**
 * Custom theme configuration for the application
 * Extends Material-UI's default theme with custom styling
 */
const theme = createTheme({
  /**
   * Color palette configuration
   * Defines primary and secondary colors with their variants
   */
  palette: {
    primary: {
      main: "#008000", // Green
      light: "#4caf50",
      dark: "#005005",
      contrastText: "#ffffff", // White text for contrast
    },
    secondary: {
      main: "#ffffff", // White
      contrastText: "#008000", // Green text for contrast
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
  },

  /**
   * Responsive breakpoint configuration
   * Defines standard breakpoints for responsive design
   */
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },

  /**
   * Global shape configuration
   * Defines standard border radius for components
   */
  shape: {
    borderRadius: 8,
  },

  /**
   * Base spacing unit for consistent layout
   */
  spacing: 8,

  /**
   * Z-index configuration for proper component layering
   */
  zIndex: {
    appBar: 1200,
    drawer: 1100,
    tooltip: 1300,
  },

  /**
   * Animation timing configuration
   * Defines standard durations and easing functions
   */
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
  },

  /**
   * Shadow configuration for elevation
   * Defines standard shadow values for different elevation levels
   */
  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2)",
    "0px 3px 1px -2px rgba(0,0,0,0.2)",
  ],

  /**
   * Component-specific style overrides
   * Customizes the appearance of Material-UI components
   */
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
          borderRadius: 1,
          padding: "8px 16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease-in-out, opacity 0.2s ease-in-out",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(46, 125, 50, 0.9)",
          fontSize: "0.75rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease-in-out",
          boxShadow: "0 6px 14px rgba(0, 128, 0, 0.4)",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
          "@media (min-width:600px)": {
            paddingLeft: "24px",
            paddingRight: "24px",
          },
        },
      },
    },
  },

  /**
   * Typography configuration
   * Defines font families and responsive text styles
   */
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: "2.5rem",
      "@media (min-width:600px)": {
        fontSize: "3.5rem",
      },
      "@media (min-width:960px)": {
        fontSize: "4rem",
      },
    },
    h2: {
      fontSize: "2rem",
      "@media (min-width:600px)": {
        fontSize: "2.5rem",
      },
      "@media (min-width:960px)": {
        fontSize: "3rem",
      },
    },
    h4: {
      fontSize: "1.5rem",
      "@media (min-width:600px)": {
        fontSize: "1.75rem",
      },
      "@media (min-width:960px)": {
        fontSize: "2rem",
      },
    },
    body1: {
      fontSize: "1rem",
      "@media (min-width:600px)": {
        fontSize: "1.1rem",
      },
    },
    body2: {
      fontSize: "0.875rem",
    },
    button: {
      fontWeight: 600,
    },
  },
});

export default theme;
