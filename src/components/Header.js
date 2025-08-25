/**
 * Header Component Module
 * Provides the main navigation header for the application
 * Includes user authentication status, navigation menus, and responsive design
 */

import { useState, useEffect } from "react";
import {
  Menu,
  MenuItem,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Button,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CompanyLogo from "../assets/img.png";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import { getToken, removeToken } from "../utils/auth";
import AuthDialog from "../components/AuthDialog";

/**
 * Header Component
 * Main navigation component that displays the application header
 * Handles user authentication state and provides navigation options
 * 
 * @returns {React.ReactElement} Application header with navigation
 */
const Header = () => {
  /** State for profile menu anchor element */
  const [anchorEl, setAnchorEl] = useState(null);
  /** State for guides menu anchor element */
  const [guidesAnchor, setGuidesAnchor] = useState(null);
  /** State for mobile menu anchor element */
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  /** State for user authentication status */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  /** State for user's display name */
  const [userName, setUserName] = useState("");
  /** State for user's initial (first letter of name) */
  const [userInitial, setUserInitial] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  /** Flag indicating if the viewport is mobile-sized */
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  /** State for authentication dialog */
  const [open, setOpen] = useState(false);

  /**
   * Checks the current authentication status
   * Updates the component state based on token presence
   */
  const checkAuth = () => {
    const token = getToken();
    setIsLoggedIn(!!token);
    if (token) {
      const name = localStorage.getItem("userName") || "User";
      setUserName(name);
      setUserInitial(name.charAt(0).toUpperCase());
    } else {
      setUserName("");
      setUserInitial("");
    }
  };

  /**
   * Effect to initialize authentication state
   * Sets up event listeners for authentication changes
   */
  useEffect(() => {
    // Check auth status on component mount
    checkAuth();

    // Listen for auth changes from other components
    window.addEventListener("authStateChanged", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("authStateChanged", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  /**
   * Handles user logout
   * Clears authentication data and redirects to home
   */
  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserName("");
    localStorage.setItem("userName", "");
    navigate("/");
    handleProfileClose();
    handleMobileMenuClose();

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("authStateChanged"));
  };

  /**
   * Opens the profile menu on hover
   * @param {Event} event - Mouse event
   */
  const handleProfileHover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the profile menu
   */
  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  /**
   * Opens the guides menu
   * @param {Event} event - Click event
   */
  const handleGuidesClick = (event) => {
    setGuidesAnchor(event.currentTarget);
  };

  /**
   * Closes the guides menu
   */
  const handleGuidesClose = () => {
    setGuidesAnchor(null);
  };

  /**
   * Opens the mobile menu
   * @param {Event} event - Click event
   */
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  /**
   * Closes the mobile menu
   */
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
    handleGuidesClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        py: { xs: 1, md: 2 },
        ml: { xs: 0, md: 3 },
        mr: { xs: 0, md: 3 },
        mt: { xs: 0, md: 2 },
        width: { xs: "100%", md: "calc(100% - 48px)" },
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              flexGrow: isMobile ? 1 : 0,
            }}
            onClick={() => navigate("/")}
          >
            <img
              src={CompanyLogo || "/placeholder.svg"}
              alt="Company Logo"
              style={{
                height: "auto",
                width: "auto",
                maxHeight: "60px",
                maxWidth: "200px",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Navigation Links - Desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 4,
            }}
          >
            {/* Home Link - Always visible */}
            <Typography
              variant="body1"
              sx={{
                color:
                  location.pathname === "/" ? "primary.main" : "text.primary",
                fontWeight: 500,
                cursor: "pointer",
                transition: "color 0.2s ease-in-out",
                "&:hover": {
                  color: "primary.main",
                },
              }}
              onClick={() => navigate("/")}
            >
              Home
            </Typography>

            {/* Screens Link - Always visible */}
            <Typography
              variant="body1"
              sx={{
                color:
                  location.pathname === "/screens"
                    ? "primary.main"
                    : "text.primary",
                fontWeight: 500,
                cursor: "pointer",
                transition: "color 0.2s ease-in-out",
                "&:hover": {
                  color: "primary.main",
                },
              }}
              onClick={() => handleNavigation("/screens")}
            >
              Screens
            </Typography>

            {/* Guides Dropdown - Always visible */}
            <Box
              sx={{ position: "relative" }}
              onMouseEnter={handleGuidesClick}
              onMouseLeave={handleGuidesClose}
            >
              <Typography
                variant="body1"
                sx={{
                  color: location.pathname.startsWith("/guides")
                    ? "primary.main"
                    : "text.primary",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "color 0.2s ease-in-out",
                  "&:hover": {
                    color: "primary.main",
                  },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Guides <ArrowDropDown />
              </Typography>

              <Menu
                anchorEl={guidesAnchor}
                open={Boolean(guidesAnchor)}
                onClose={handleGuidesClose}
                MenuListProps={{
                  onMouseLeave: handleGuidesClose,
                }}
                PaperProps={{
                  sx: {
                    borderRadius: 1,
                    minWidth: 220,
                    mt: 1.5,
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                    "& .MuiMenuItem-root": {
                      fontSize: "0.9rem",
                      py: 1.5,
                      px: 2,
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => handleNavigation("/guides/backtesting")}
                >
                  Backtesting Tutorial
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/guides/analysis")}>
                  Result Analysis Tutorial
                </MenuItem>
              </Menu>
            </Box>
            {/* Conditional Login/Avatar */}
            {isLoggedIn ? (
              <Box
                onMouseEnter={handleProfileHover}
                onMouseLeave={handleProfileClose}
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "green",
                    color: "white",
                    width: 40,
                    height: 40,
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {userInitial}
                </Avatar>
                <ArrowDropDown
                  sx={{ cursor: "pointer", color: "text.primary" }}
                />

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileClose}
                  MenuListProps={{
                    onMouseLeave: handleProfileClose,
                  }}
                  PaperProps={{
                    sx: {
                      borderRadius: 1,
                      minWidth: 180,
                      mt: 1.5,
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                      "& .MuiMenuItem-root": {
                        fontSize: "0.9rem",
                        py: 1.5,
                        px: 2,
                      },
                    },
                  }}
                >
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() => setOpen(true)}
                  color="primary"
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
                    transition: "all 0.3s ease",
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            sx={{
              color: "text.primary",
              ml: 2,
              display: { xs: "flex", md: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Menu */}
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            PaperProps={{
              sx: {
                width: "100%",
                maxWidth: "50vw",
                borderRadius: 0,
                boxShadow: "none",
                borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                mt: 0,
                py: 0,
              },
            }}
          >
            <MenuItem
              onClick={() => handleNavigation("/")}
              sx={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                py: 2,
              }}
            >
              <Typography variant="body1">Home</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleNavigation("/screens")}
              sx={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                py: 2,
              }}
            >
              <Typography variant="body1">Screens</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleNavigation("/guides/backtesting")}
              sx={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                py: 2,
              }}
            >
              <Typography variant="body1">Backtesting Tutorial</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleNavigation("/guides/analysis")}
              sx={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                py: 2,
              }}
            >
              <Typography variant="body1">Analysis Tutorial</Typography>
            </MenuItem>

            {isLoggedIn ? (
              <>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleMobileMenuClose();
                  }}
                  sx={{
                    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                    py: 2,
                  }}
                >
                  <Typography variant="body1">Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 2,
                  }}
                >
                  <Typography variant="body1">Logout</Typography>
                </MenuItem>
              </>
            ) : (
              <></>
            )}
          </Menu>
        </Toolbar>
      </Container>
      <AuthDialog open={open} handleClose={() => setOpen(false)} />
    </AppBar>
  );
};

export default Header;
