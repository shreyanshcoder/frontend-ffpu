/**
 * Screens Page Component Module
 * Provides a dashboard for managing and viewing trading screens
 * Includes screen creation, viewing, and results analysis functionality
 * Features pagination and responsive grid layout
 */

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Pagination,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "../components/Header";
import theme from "../styles/theme";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import useStrategy from "../hooks/useStrategy";
import { API_ENDPOINTS } from "../config/config";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IconButton } from "@mui/material";

// ==== robust query helpers (top of file) ====

const signMap = { gt: ">", gte: ">=", lt: "<", lte: "<=", eq: "=" };

const safeParse = (input) => {
  if (!input) return null;
  if (typeof input === "object") return input;
  try { return JSON.parse(input); } catch (_) {}
  try { return JSON.parse(input.replace(/'/g, '"')); } catch (_) {}
  return null;
};

const extractFilters = (rowOrStrategy) => {
  console.log("extractFilters called with:", rowOrStrategy);

  if (!rowOrStrategy) {
    console.log("No rowOrStrategy provided");
    return [];
  }

  // Prefer normalized backend field
  if (Array.isArray(rowOrStrategy.filters)) {
    console.log("Found filters array directly:", rowOrStrategy.filters);
    return rowOrStrategy.filters;
  }

  // If a full object with .strategy exists
  if (rowOrStrategy.strategy && typeof rowOrStrategy.strategy === "object") {
    const strategyFilters = rowOrStrategy.strategy.filters;
    console.log("Found strategy.filters:", strategyFilters);
    return Array.isArray(strategyFilters) ? strategyFilters : [];
  }

  // If a `query` field is provided (string or object), parse it for filters
  if (rowOrStrategy.query) {
    if (typeof rowOrStrategy.query === "string") {
      const parsedFromQuery = safeParse(rowOrStrategy.query);
      console.log("Parsed from query string:", parsedFromQuery);
      if (Array.isArray(parsedFromQuery?.filters)) return parsedFromQuery.filters;
    } else if (typeof rowOrStrategy.query === "object") {
      const qFilters = rowOrStrategy.query.filters;
      console.log("Found query.filters object:", qFilters);
      if (Array.isArray(qFilters)) return qFilters;
    }
  }

  // Fallback: parse legacy string or plain object
  const parsed = safeParse(rowOrStrategy.strategy ?? rowOrStrategy.query ?? rowOrStrategy);
  console.log("Parsed result:", parsed);
  const fallbackFilters = Array.isArray(parsed?.filters) ? parsed.filters : [];
  console.log("Fallback filters:", fallbackFilters);
  return fallbackFilters;
};

const formatQuery = (rowOrStrategy) => {
  const filters = extractFilters(rowOrStrategy);
  if (!filters.length) return "—";

  return filters
    .map((f) => {
      const d = f?.Data || {};
      const name = d?.param?.name ?? "Param";
      const sign = signMap[d?.sign] || d?.sign || "";
      const thr  = d?.threshold ?? "";
      const per  = d?.period != null ? ` (period ${d.period})` : "";
      return `${name} ${sign} ${thr}${per}`.trim();
    })
    .join(" • ");
};

// Multiline variant for table display
const formatQueryMultiline = (rowOrStrategy) => {
  const filters = extractFilters(rowOrStrategy);
  if (!filters.length) return "—";
  
  return filters
    .map((f) => {
      const d = f?.Data || {};
      const name = d?.param?.name ?? "Param";
      const sign = signMap[d?.sign] || d?.sign || "";
      const thr  = d?.threshold ?? "";
      const per  = d?.period != null ? ` (period ${d.period})` : "";
      const op   = f?.Operator ? ` ${f.Operator}` : "";
      
      // Format the threshold nicely for readability
      let formattedThreshold = thr;
      if (typeof thr === 'number') {
        if (thr >= 1_000_000_000) {
          formattedThreshold = `${(thr / 1_000_000_000).toFixed(1)}B`;
        } else if (thr >= 1_000_000) {
          formattedThreshold = `${(thr / 1_000_000).toFixed(1)}M`;
        } else if (thr >= 1_000) {
          formattedThreshold = `${(thr / 1_000).toFixed(1)}K`;
        } else {
          formattedThreshold = thr.toFixed(2);
        }
      }
      
      // Convert parameter names to readable labels
      const readableName = {
        'return_on_equity': 'ROE',
        'pe_ratio': 'P/E Ratio',
        'market_cap': 'Market Cap',
        'dividend_yield': 'Dividend Yield',
        'beta': 'Beta',
        'expected_return': 'Expected Return',
        'sharpe_ratio': 'Sharpe Ratio'
      }[name] || name;
      
      // Convert signs to mathematical symbols
      const mathSign = {
        'gte': '≥',
        'lte': '≤',
        'gt': '>',
        'lt': '<',
        'eq': '=',
        'ne': '≠'
      }[sign] || sign;
      
      return `${readableName} ${mathSign} ${formattedThreshold}${per}${op}`.trim();
    })
    .join("\n");
};

const getRawQueryJson = (rowOrStrategy) => {
  if (!rowOrStrategy) return "";
  // If caller passed a plain JSON string already
  if (typeof rowOrStrategy === "string") return rowOrStrategy;

  // Prefer sample endpoint shape
  if (rowOrStrategy.query) return JSON.stringify(rowOrStrategy.query);

  // Popular / saved may have normalized object
  if (rowOrStrategy.strategy && typeof rowOrStrategy.strategy === "object") {
    return JSON.stringify(rowOrStrategy.strategy);
  }

  // Last resort: extract filters and wrap
  const filters = extractFilters(rowOrStrategy);
  return filters.length ? JSON.stringify({ filters }) : "";
};

// ==== Screen Card ====

/**
 * Screen Card Component
 * Displays individual screen information in a card format
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Screen title
 * @param {string|Object} props.query - Screen query (string or object)
 * @param {Function} props.onViewResults - Callback for viewing results
 * @returns {React.ReactElement} Screen card component
 */
const ScreenCard = ({ title, query, onViewResults }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        color: "primary.contrastText",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 6px 16px rgba(0, 128, 0, 0.3)",
        },
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          color="primary.main"
          sx={{ textTransform: "capitalize", letterSpacing: "0.5px" }}
        >
          {title}
        </Typography>
        <Divider
          sx={{
            my: 1,
            width: "50%",
            mx: "auto",
            borderBottomWidth: 3,
            backgroundColor: "primary.light",
            borderRadius: 5,
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.9rem", fontStyle: "italic" }}
        >
          Query: {formatQuery(query)}
        </Typography>
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
        <Button
          variant="outlined"
          color="success"
          size="medium"
          onClick={onViewResults}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            fontSize: "0.875rem",
            fontWeight: "bold",
            color: "primary.main",
            boxShadow: "0px 4px 10px rgba(0, 128, 0, 0.3)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 6px 14px rgba(0, 128, 0, 0.4)",
            },
          }}
        >
          View Results
        </Button>
      </Box>
    </Card>
  );
};

ScreenCard.propTypes = {
  title: PropTypes.string.isRequired,
  query: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onViewResults: PropTypes.func.isRequired,
};

export default function Screens() {
  const userId = localStorage.getItem("userName");
  const {
    strategies,
    allStrategies,
    savedPagination,
    publicPagination,
    fetchStrategies,
    fetchAllStrategies,
  } = useStrategy(userId);
  const navigate = useNavigate();

  // State for sample strategies from database
  const [sampleStrategies, setSampleStrategies] = useState([]);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [publicPage, setPublicPage] = useState(1);

  useEffect(() => {
    fetchStrategies(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchAllStrategies(publicPage);
  }, [publicPage]);

  // Fetch sample strategies from database
  const fetchSampleStrategies = async () => {
    setIsLoadingSamples(true);
    try {
      const response = await fetch(API_ENDPOINTS.GET_TEMPLATES);
      console.log('Templates API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Templates API data:', data);
        console.log('Strategies array:', data.strategies);
        setSampleStrategies(data.strategies || []);
      } else {
        console.error('Failed to fetch sample strategies, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        // No fallback; show nothing if API fails
        setSampleStrategies([]);
      }
    } catch (error) {
      console.error('Error fetching sample strategies:', error);
      // No fallback; show nothing if API fails
      setSampleStrategies([]);
    } finally {
      setIsLoadingSamples(false);
    }
  };

  useEffect(() => {
    fetchSampleStrategies();
  }, []);

  // Update pagination handlers
  const handleSavedPageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handlePublicPageChange = (event, page) => {
    setPublicPage(page);
  };

  // Send RAW JSON (not pretty string) to create-screens
  const handleViewResults = (rowOrStrategy, id) => {
    navigate("/create-screens", {
      state: { initialQuery: getRawQueryJson(rowOrStrategy), strategyId: id },
    });
  };

  // Remove the duplicate pagination calculations since we're using backend pagination
  const isLoggedIn = !!localStorage.getItem("userName");

  // Removed hardcoded default strategies; we only show API-driven items

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "rgba(96, 173, 94, 0.1)",
          px: { xs: 2, sm: 3, md: 2 },
          py: 2,
          overflowX: "hidden",
        }}
      >
        <Header />
        <Box sx={{ height: 120 }} />

        {/* Create Button with right alignment and margin */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: { xs: 2, sm: 3 },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/create-screens")}
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
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Create a New Screen
            </Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
              Screen
            </Box>
          </Button>
        </Box>

        <Container
          maxWidth="xl"
          sx={{
            p: 2,
            mx: { xs: 2, sm: 3, md: 4 },
            my: 2,
            mr: { xs: 4, sm: 6, md: 8 },
            pr: 2,
          }}
        >
          {isLoggedIn && strategies && strategies.length > 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 4,
                  pr: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
                    Saved Screens
                  </Typography>
                  <Typography variant="body1" color="black">
                    Manage and create new screening rules
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ pr: 2 }}>
                {strategies.map((strategy, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={strategy.strategy_id}>
                    <ScreenCard
                      title={strategy.name || `Screen ${index + 1}`}
                      query={strategy}  // pass whole row to formatter
                      onViewResults={() => handleViewResults(strategy, strategy.strategy_id)}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination for Saved Screens */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
                <Pagination
                  count={savedPagination?.total_pages || 1}
                  page={currentPage}
                  onChange={handleSavedPageChange}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "primary.main",
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                    },
                  }}
                />
              </Box>
            </>
          )}

          <Box sx={{ mt: 2, mb: 4, pr: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
              Sample Investment Strategies
            </Typography>
            <Typography variant="body1" color="black">
              Explore strategies based on your actual portfolio performance data
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {isLoadingSamples ? (
                <Grid item xs={12}>
                  <Typography variant="body2" align="center">
                    Loading sample strategies from database...
                  </Typography>
                </Grid>
              ) : sampleStrategies.length > 0 ? (
                sampleStrategies.map((strategy, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0px 4px 12px rgba(0, 128, 0, 0.2)",
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          gutterBottom
                          color="primary.main"
                          sx={{ textTransform: "capitalize", fontSize: "0.9rem" }}
                        >
                          {strategy.title || strategy.name || `Strategy ${index + 1}`}
                        </Typography>
                        <Divider sx={{ my: 0.5, borderBottomWidth: 1 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ 
                            fontSize: "0.7rem", 
                            mb: 1, 
                            lineHeight: 1.3,
                            whiteSpace: "pre-line",
                            fontFamily: "monospace"
                          }}
                        >
                          {strategy.description || formatQueryMultiline(strategy) || "N/A"}
                        </Typography>
                        

                        {strategy.performance && (
                          <Typography
                            variant="caption"
                            color="success.main"
                            sx={{ fontSize: "0.6rem", display: "block", mt: 0.5 }}
                          >
                            Return: {strategy.performance.mean_return}% | Sharpe: {strategy.performance.sharpe_ratio}
                          </Typography>
                        )}
                      </CardContent>
                      <Box
                        sx={{
                          p: 1,
                          pt: 0,
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                        }}
                      >
                        <IconButton
                          color="success"
                          onClick={() => handleViewResults(strategy, strategy.strategy_id)}
                          sx={{
                            border: "1px solid",
                            borderColor: "success.main",
                            borderRadius: 1.5,
                            p: 0.3,
                            "&:hover": { backgroundColor: "rgba(0, 128, 0, 0.1)" },
                          }}
                        >
                          <ArrowForwardIcon fontSize="small" sx={{ fontSize: "0.9rem" }} />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body2">No strategies found</Typography>
              )}
            </Grid>
          </Box>

          <Box sx={{ mt: 2, mb: 4, pr: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
              Popular Investment Strategies
            </Typography>
            <Typography variant="body1" color="black">
              Explore the interesting strategies others have created
            </Typography>

            <TableContainer
              component={Paper}
              sx={{
                mt: 3,
                mb: 3,
                boxShadow: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                      Query
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.main", fontWeight: "bold", textAlign: "center" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allStrategies && allStrategies.length > 0 ? (
                    allStrategies.map((strategy, index) => (
                      <TableRow
                        key={strategy.strategy_id}
                        sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                      >
                        <TableCell sx={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                          {strategy.name || `Public Screen ${index + 1}`}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "0.9rem",
                            fontStyle: "italic",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {formatQueryMultiline(strategy)}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => handleViewResults(strategy, strategy.strategy_id)}
                            sx={{
                              borderRadius: 1,
                              px: 2,
                              py: 1,
                              fontSize: "0.875rem",
                              fontWeight: "bold",
                              color: "primary.main",
                              boxShadow: "0 4px 10px rgba(0, 128, 0, 0.3)",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0 6px 14px rgba(0, 128, 0, 0.4)",
                              },
                            }}
                          >
                            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                              View Results
                            </Box>
                            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                              View
                            </Box>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No public strategies found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* Add pagination for public strategies */}
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <Pagination
                  count={publicPagination?.total_pages || 1}
                  page={publicPage}
                  onChange={handlePublicPageChange}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "primary.main",
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                    },
                  }}
                />
              </Box>
            </TableContainer>
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
