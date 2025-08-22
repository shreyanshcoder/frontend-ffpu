/**
 * Create Screens Page Component Module
 * Provides interface for creating and managing trading screens
 * Features search functionality, query building, and strategy saving
 * Includes responsive design and loading states
 */

import {
  Box,
  ThemeProvider,
  Button,
  Dialog,
  DialogContent,
  Container,
  Grid,
  Fade,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import theme from "../styles/theme"; // Import the centralized theme
import SearchInput from "../components/SearchInput";
import SearchOutput from "../components/SearchOutput";
import { useState, useRef, useEffect } from "react";
import Preloader from "../components/Preloader";
import SaveIcon from "@mui/icons-material/Save";
import Footer from "../components/Footer";

/**
 * Create Screens Component
 * Manages the creation and configuration of trading screens
 * Handles search functionality and strategy saving
 *
 * @returns {React.ReactElement} Screen creation interface
 */
export default function CreateScreens() {
  /** Router location hook for accessing navigation state */
  const location = useLocation();
  /** State to control search output visibility */
  const [showOutput, setShowOutput] = useState(false);
  /** State for loading indicator */
  const [isLoading, setIsLoading] = useState(false);
  /** State to control query visibility */
  const [isQueryHidden, setIsQueryHidden] = useState(false);
  /** State for query popup dialog */
  const [isQueryPopupOpen, setIsQueryPopupOpen] = useState(false);
  /** State for current query string */
  const [currentQuery, setCurrentQuery] = useState("");
  /** State for strategy identifier */
  const [strategyId, setStrategyId] = useState("");
  /** State for session identifier */
  const [sessionId, setSessionId] = useState("");
  /** Ref for search input component */
  const searchInputRef = useRef(null);

  /**
   * Effect to handle initial query from navigation state
   * Sets up initial search if query is provided
   */
  useEffect(() => {
    if (location.state?.initialQuery) {
      setCurrentQuery(location.state.initialQuery);
      setStrategyId(location.state.strategyId);
      handleSearchButtonClick(
        location.state.initialQuery,
        location.state.sessionId
      );
    }
  }, [location.state]);

  /**
   * Handles search button click
   * Updates query state and triggers search process
   *
   * @param {string} query - Search query string
   * @param {string} session_id - Session identifier
   */
  const handleSearchButtonClick = (query, session_id) => {
    setCurrentQuery(query);
    setSessionId(session_id);
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setIsQueryHidden(true);
      setShowOutput(true);
    }, 1500);
  };

  /**
   * Handles strategy save action
   * Delegates to search input component's save method
   */
  const handleSaveStrategyClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.handleSaveStrategy();
    } else {
      console.error("Search input reference not found");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          bgcolor: "rgba(96, 173, 94, 0.1)", // Match the background color of LandingPage
        }}
      >
        {/* Header */}
        <Header />
        {/* Add space at the top */}
        <Box sx={{ height: 120 }} /> {/* Adjust the height as needed */}
        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      gap: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Query Button - Only show when query is hidden */}
                    {isQueryHidden && (
                      <Button
                        variant="contained"
                        onClick={() => setIsQueryPopupOpen(true)}
                        color="primary"
                        sx={{
                          position: "fixed",
                          bottom: { xs: 350, md: 150 },
                          right: 30,
                          zIndex: 9999, // Ensures it floats above all other elements
                          borderRadius: 1,
                          px: 3,
                          py: 1.5,
                          fontWeight: "bold",
                          boxShadow: "0 4px 10px rgba(0, 128, 0, 0.3)",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 6px 14px rgba(0, 128, 0, 0.4)",
                          },
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": { boxShadow: "0 0 0 0 rgba(0, 128, 0, 0.4)" },
                            "70%": {
                              boxShadow: "0 0 0 10px rgba(0, 128, 0, 0)",
                            },
                            "100%": { boxShadow: "0 0 0 0 rgba(0, 128, 0, 0)" },
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Edit Query
                      </Button>
                    )}
                  </Box>
                  {/* Loading State */}
                  {isLoading && <Preloader />}

                  {/* Always render SearchInput but control visibility */}
                  <Box sx={{ display: isQueryHidden ? "none" : "block" }}>
                    <SearchInput
                      onSearchButtonClick={handleSearchButtonClick}
                      ref={searchInputRef}
                      initialQuery={currentQuery}
                    />
                  </Box>

                  {/* Query Popup */}
                  <Dialog
                    open={isQueryPopupOpen}
                    onClose={() => setIsQueryPopupOpen(false)}
                    maxWidth="md"
                    fullWidth
                  >
                    <DialogContent>
                      <SearchInput
                        initialQuery={currentQuery}
                        onSearchButtonClick={(query) => {
                          setIsQueryPopupOpen(false);
                          handleSearchButtonClick(query, sessionId);
                        }}
                        ref={searchInputRef}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Search Output */}
                  {showOutput && !isLoading && (
                    <>
                      <SearchOutput
                        ref={searchInputRef}
                        strategyId={strategyId}
                        sessionId={sessionId}
                      />
                      <Box
                        sx={{
                          mt: 3,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveStrategyClick}
                          startIcon={<SaveIcon />} // This automatically spaces the icon
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
                          }}
                        >
                          Save Strategy
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
        <Box sx={{ height: "250px" }} />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
