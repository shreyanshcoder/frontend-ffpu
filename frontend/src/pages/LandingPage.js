/**
 * Landing Page Component Module
 * Serves as the main entry point for the application
 * Features an interactive carousel showcasing key platform features
 * Includes responsive design and authentication integration
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  ThemeProvider,
  Button,
  Container,
  Grid,
  Fade,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../styles/theme";
import AuthDialog from "../components/AuthDialog";
import Footer from "../components/Footer";
import Header from "../components/Header";
import carousel1 from "../assets/carousel1.gif";
import carousel2 from "../assets/carousel2.gif";
import carousel3 from "../assets/carousel3.gif";

/**
 * Landing Page Component
 * Displays the main landing page with feature carousel
 * Handles authentication state and navigation
 *
 * @returns {React.ReactElement} Landing page with interactive carousel
 */
const LandingPage = () => {
  /** Router location hook for accessing URL state */
  const location = useLocation();
  /** Router navigation hook */
  const navigate = useNavigate();
  /** State for authentication dialog visibility */
  const [open, setOpen] = useState(false);
  /** State for current carousel slide index */
  const [activeIndex, setActiveIndex] = useState(0);
  /** Ref for carousel container */
  const carouselRef = useRef(null);
  /** Media query hook for responsive design */
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  /**
   * Effect to handle authentication dialog state from URL
   * Opens auth dialog if specified in location state
   */
  useEffect(() => {
    if (location.state?.openAuth) {
      setOpen(true);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state, location.pathname]);

  /**
   * Configuration for carousel slides
   * @type {Array<Object>}
   */
  const carouselItems = [
    {
      title: "Expert-Led, Data-Driven: Backtest Your Portfolio",
      description:
        "Leverage expert insights and AI-driven backtesting to refine your portfolio.",
      media: carousel1,
      mediaAlt: "Backtesting illustration",
      showButton: true,
      buttonText: "Continue to Screens",
      buttonAction: () => navigate("/screens"),
      mediaStyle: {
        width: "100%",
        maxWidth: "400px",
        height: "450px",
        objectFit: "contain",
      },
      mobileMediaStyle: {
        width: "100%",
        height: "250px",
        objectFit: "contain",
      },
    },
    {
      title: "Explore More Strategies",
      description:
        "Discover a curated selection of investment products built using the same powerful backtesting engine.",
      media: carousel2,
      mediaAlt: "Strategies overview",
      showButton: true,
      buttonText: "Explore Now",
      buttonAction: () =>
        window.open("https://fidelfolio.com/all-strategies/", "_blank"),
      mediaStyle: {
        width: "100%",
        maxWidth: "400px",
        height: "450px",
        objectFit: "contain",
      },
      mobileMediaStyle: {
        width: "100%",
        height: "250px",
        objectFit: "contain",
      },
    },
    {
      title: "Getting Started Guide",
      description: "Learn how to use our platform with this simple tutorial.",
      media: carousel3,
      mediaAlt: "Tutorial guide",
      mediaStyle: {
        width: "100%",
        maxWidth: "400px",
        height: "450px",
        objectFit: "contain",
      },
      mobileMediaStyle: {
        width: "100%",
        height: "250px",
        objectFit: "contain",
      },
      showButton: true,
      buttonText: "Continue to Guides",
      buttonAction: () => navigate("/guides/backtesting"),
    },
  ];

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToIndex = (index) => {
    setActiveIndex(index);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Custom carousel implementation
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${
        activeIndex * 100
      }%)`;
    }
  }, [activeIndex]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "rgba(96, 173, 94, 0.1)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <Box sx={{ height: { xs: "80px", md: "120px" } }} />
        <Box
          sx={{
            overflow: "hidden",
            position: "relative",
            flex: 1,
            width: "90%",
            margin: "0 auto",
            padding: { xs: "0 16px", md: 0 },
          }}
        >
          {/* Carousel container */}
          <Box
            ref={carouselRef}
            sx={{
              display: "flex",
              transition: "transform 0.5s ease-in-out",
              height: "100%",
              width: "100%",
              position: "relative", // Add this
              left: 0, // Explicitly set
            }}
          >
            {carouselItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  minWidth: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: { xs: "20px 0", md: 4 },
                }}
              >
                <Container maxWidth="lg">
                  <Grid
                    container
                    spacing={4}
                    alignItems="center"
                    direction={isMobile ? "column-reverse" : "row"}
                  >
                    {/* Text content - becomes top on mobile */}
                    <Grid item xs={12} md={6}>
                      <Fade in={activeIndex === index} timeout={800}>
                        <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
                          <Typography
                            variant={isMobile ? "h4" : "h3"}
                            component="h1"
                            gutterBottom
                            sx={{
                              fontWeight: "bold",
                              color: "primary.main",
                              fontSize: { xs: "1.8rem", md: "2.4rem" },
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant={isMobile ? "body1" : "h6"}
                            component="p"
                            gutterBottom
                            sx={{
                              mb: 4,
                              color: "text.secondary",
                              fontSize: { xs: "1rem", md: "1.25rem" },
                            }}
                          >
                            {item.description}
                          </Typography>
                          {item.showButton && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: isMobile
                                  ? "center"
                                  : "flex-start",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                size={isMobile ? "medium" : "large"}
                                onClick={item.buttonAction}
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
                                    boxShadow:
                                      "0 6px 14px rgba(0, 128, 0, 0.4)",
                                  },
                                  animation: "pulse 2s infinite",
                                  "@keyframes pulse": {
                                    "0%": {
                                      boxShadow: "0 0 0 0 rgba(0, 128, 0, 0.4)",
                                    },
                                    "70%": {
                                      boxShadow:
                                        "0 0 0 10px rgba(0, 128, 0, 0)",
                                    },
                                    "100%": {
                                      boxShadow: "0 0 0 0 rgba(0, 128, 0, 0)",
                                    },
                                  },
                                  transition: "all 0.3s ease",
                                }}
                              >
                                {item.buttonText}
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Fade>
                      <br />
                    </Grid>

                    {/* Media - becomes bottom on mobile */}
                    <Grid item xs={12} md={6}>
                      <Fade in={activeIndex === index} timeout={800}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Box
                            component="img"
                            src={item.media}
                            alt={item.mediaAlt}
                            sx={{
                              ...(isMobile
                                ? item.mobileMediaStyle
                                : item.mediaStyle || {
                                    width: "80%",
                                    height: "auto",
                                  }),
                              imageRendering: "auto",
                              display: "block",
                              boxShadow: 3,
                              "@media (prefers-reduced-motion: no-preference)":
                                {
                                  "&:hover": {
                                    transform: isMobile
                                      ? "none"
                                      : "scale(1.02)",
                                    transition: "transform 0.3s ease",
                                  },
                                },
                            }}
                          />
                        </Box>
                      </Fade>
                    </Grid>
                  </Grid>
                </Container>
              </Box>
            ))}
          </Box>

          {/* Indicators */}
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
            }}
          >
            {carouselItems.map((_, index) => (
              <Box
                key={index}
                onClick={() => goToIndex(index)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "20%",
                  bgcolor: activeIndex === index ? "primary.main" : "grey.500",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": { bgcolor: "grey" },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Rest of your page content can go here */}
        <Footer />
        <AuthDialog open={open} handleClose={() => setOpen(false)} />
        <Box sx={{ height: { xs: "60px", md: "85px" } }} />
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
