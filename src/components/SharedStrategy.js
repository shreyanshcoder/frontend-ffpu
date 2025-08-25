/**
 * Shared Strategy Component Module
 * Displays details of a shared trading strategy
 * Fetches and renders strategy information with proper error handling
 */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Container,
  CircularProgress,
  ThemeProvider,
} from "@mui/material";
import theme from "../styles/theme";
import useStrategy from "../hooks/useStrategy";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * Strategy Details Component
 * Displays detailed information about a shared trading strategy
 * Handles loading states, errors, and data fetching
 * 
 * @returns {React.ReactElement} Strategy details view with proper layout
 */
const StrategyDetails = () => {
  /** Strategy ID from URL parameters */
  const { strategyId } = useParams();
  /** User ID from local storage */
  const userId = localStorage.getItem("userName");
  /** Strategy hook for data fetching and state management */
  const { loading, error, getStrategy, currentStrategy } = useStrategy(userId);
  /** State for fetch-specific errors */
  const [fetchError, setFetchError] = useState(null);
  /** State for fetch operation status */
  const [isFetching, setIsFetching] = useState(false);

  /**
   * Effect to fetch strategy data when component mounts or strategyId changes
   * Implements proper cleanup and cancellation
   */
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    /**
     * Fetches strategy data using the strategy hook
     * Handles errors and loading states
     */
    const fetchData = async () => {
      if (!strategyId || isFetching) return;

      setIsFetching(true);
      setFetchError(null);

      try {
        const data = await getStrategy(strategyId);
      } catch (err) {
        if (isMounted && !axios.isCancel(err)) {
          console.error("Fetch error:", err);
          setFetchError(err.message || "Failed to fetch strategy");
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [strategyId, getStrategy]);

  /**
   * Loading state render
   * Displays a centered loading spinner
   */
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Header />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Container>
        <Footer />
      </ThemeProvider>
    );
  }

  // Handle both hook error and fetch error
  const displayError = error || fetchError;
  
  /**
   * Error state render
   * Displays error message with proper styling
   */
  if (displayError) {
    return (
      <ThemeProvider theme={theme}>
        <Header />
        <Container sx={{ mt: 4, textAlign: "center", minHeight: "60vh" }}>
          <Typography color="error">
            {typeof displayError === "string"
              ? displayError
              : "An unknown error occurred"}
          </Typography>
        </Container>
        <Footer />
      </ThemeProvider>
    );
  }

  /**
   * Empty state render
   * Displays when no strategy data is found
   */
  if (!currentStrategy) {
    return (
      <ThemeProvider theme={theme}>
        <Header />
        <Container sx={{ mt: 4, textAlign: "center", minHeight: "60vh" }}>
          <Typography>No strategy data found</Typography>
        </Container>
        <Footer />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "rgba(96, 173, 94, 0.1)", minHeight: "100vh" }}>
        <Header />
        <Box sx={{ height: "120px" }} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: "0 6px 14px rgba(0, 128, 0, 0.1)",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                mb: 3,
                borderBottom: "2px solid",
                borderColor: "primary.light",
                pb: 1,
              }}
            >
              {currentStrategy.ippf?.strat_name_alias ||
                currentStrategy.ippf?.strat_name ||
                "Untitled Strategy"}
            </Typography>

            {/* Basic Info Section */}
            <Box
              sx={{
                mb: 4,
                p: 3,
                bgcolor: "rgba(0, 128, 0, 0.05)",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "primary.dark", fontWeight: "bold" }}
              >
                Basic Information
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Created by: {currentStrategy.ippf?.user_id}
              </Typography>
              <Typography>
                Created at:{" "}
                {new Date(currentStrategy.ippf?.insert_time).toLocaleString()}
              </Typography>
            </Box>

            {/* Performance Metrics Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "primary.dark", fontWeight: "bold" }}
              >
                Performance Metrics
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {currentStrategy.pfst?.map((metric, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      flex: 1,
                      minWidth: "200px",
                      bgcolor: "rgba(0, 128, 0, 0.05)",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0, 128, 0, 0.1)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      {metric.nyears} Year Performance
                    </Typography>
                    <Typography sx={{ mb: 0.5 }}>
                      CAGR Mean:{" "}
                      <Box component="span" sx={{ fontWeight: "bold" }}>
                        {(metric.cagr_mean * 100).toFixed(2)}%
                      </Box>
                    </Typography>
                    <Typography sx={{ mb: 0.5 }}>
                      Sharpe Ratio:{" "}
                      <Box component="span" sx={{ fontWeight: "bold" }}>
                        {metric.sharpe_ratio.toFixed(2)}
                      </Box>
                    </Typography>
                    <Typography>
                      Alpha Mean:{" "}
                      <Box component="span" sx={{ fontWeight: "bold" }}>
                        {(metric.alpha_mean * 100).toFixed(2)}%
                      </Box>
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Yearly Performance Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "primary.dark", fontWeight: "bold" }}
              >
                Yearly Performance
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {currentStrategy.calyears?.map((yearData) => (
                  <Paper
                    key={yearData.year}
                    sx={{
                      p: 2,
                      minWidth: 120,
                      textAlign: "center",
                      bgcolor:
                        yearData.portfolio_cagr >= 0
                          ? "rgba(0, 128, 0, 0.1)"
                          : "rgba(255, 0, 0, 0.1)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {yearData.year}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color:
                          yearData.portfolio_cagr >= 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {(yearData.portfolio_cagr * 100).toFixed(2)}%
                    </Typography>
                    <Typography variant="caption">
                      Index: {(yearData.index_cagr * 100).toFixed(2)}%
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Portfolio Composition Section */}
            {currentStrategy.ippf && (
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.dark", fontWeight: "bold" }}
                >
                  Portfolio Composition
                </Typography>
                {Object.entries(currentStrategy.ippf)
                  .filter(([key]) => key.startsWith("y_"))
                  .map(([year, stocks]) => (
                    <Box
                      key={year}
                      sx={{
                        mb: 3,
                        p: 2,
                        bgcolor: "rgba(0, 128, 0, 0.05)",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {year.replace("y_", "")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          fontFamily: "monospace",
                          p: 1,
                          bgcolor: "background.paper",
                          borderRadius: 1,
                        }}
                      >
                        {stocks}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            )}
          </Paper>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default StrategyDetails;
