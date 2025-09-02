import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
import useExecuteQuery from "../hooks/useExecuteQuery";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import AuthDialog from "./AuthDialog";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

const SearchInput = forwardRef(
  ({ onSearchButtonClick, initialQuery = "" }, ref) => {
    const [query, setQuery] = useState(
      initialQuery ||
        "DE CAGR 1 Years >= 25 AND\nPBIDT CAGR 9 Years < 40 AND\nAverage DE 6 Years > 16"
    );
    const [selectedOption, setSelectedOption] = useState("");
    const [description, setDescription] = useState("Custom query example:");
    const [formula, setFormula] = useState(`Market capitalization > 500 AND
Price to earning < 15 AND
Return on capital employed > 22%
`);
    const [queryResults, setQueryResults] = useState([]);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [strategyName, setStrategyName] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [shareableLink, setShareableLink] = useState("");
    const { executeQuery, saveStrategy } = useExecuteQuery();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
      if (initialQuery) {
        setQuery(initialQuery);
      }
    }, [initialQuery]);

    // Use useImperativeHandle to expose methods
    useImperativeHandle(ref, () => ({
      handleSaveStrategy: () => {
        if (!query.trim()) {
          showSnackbar("Please enter a query first");
          return;
        }
        setSaveDialogOpen(true);
      },
    }));
    const options = [
      {
        id: 1,
        name: "Average DE",
        description:
          "Debt-to-Equity Ratio measures a company's financial leverage.",
        formula: "Total Debt / Total Equity",
      },
      {
        id: 2,
        name: "Average ROCE",
        description:
          "Return on Capital Employed indicates profitability and efficiency in using capital.",
        formula: "EBIT / Capital Employed",
      },
      {
        id: 3,
        name: "Average ROE",
        description:
          "Return on Equity measures profitability relative to shareholders' equity.",
        formula: "Net Income / Shareholder's Equity",
      },
      {
        id: 4,
        name: "Average CFO/PBIT",
        description:
          "Cash Flow from Operations to Profit Before Interest and Tax measures cash efficiency.",
        formula: "CFO / PBIT",
      },
      {
        id: 5,
        name: "DE CAGR",
        description: "Compounded Annual Growth Rate of Debt-to-Equity Ratio.",
        formula: "((Ending DE / Beginning DE)^(1/Years)) - 1",
      },
      {
        id: 6,
        name: "ROCE CAGR",
        description:
          "Compounded Annual Growth Rate of Return on Capital Employed.",
        formula: "((Ending ROCE / Beginning ROCE)^(1/Years)) - 1",
      },
      {
        id: 7,
        name: "ROE CAGR",
        description: "Compounded Annual Growth Rate of Return on Equity.",
        formula: "((Ending ROE / Beginning ROE)^(1/Years)) - 1",
      },
      {
        id: 8,
        name: "NetSales CAGR",
        description: "Compounded Annual Growth Rate of Net Sales.",
        formula: "((Ending Net Sales / Beginning Net Sales)^(1/Years)) - 1",
      },
      {
        id: 9,
        name: "PBIDT CAGR",
        description:
          "Compounded Annual Growth Rate of Profit Before Interest, Depreciation, and Taxes.",
        formula: "((Ending PBIDT / Beginning PBIDT)^(1/Years)) - 1",
      },
      {
        id: 10,
        name: "PBIT CAGR",
        description:
          "Compounded Annual Growth Rate of Profit Before Interest and Taxes.",
        formula: "((Ending PBIT / Beginning PBIT)^(1/Years)) - 1",
      },
      {
        id: 11,
        name: "PBT CAGR",
        description: "Compounded Annual Growth Rate of Profit Before Tax.",
        formula: "((Ending PBT / Beginning PBT)^(1/Years)) - 1",
      },
      {
        id: 12,
        name: "PAT CAGR",
        description: "Compounded Annual Growth Rate of Profit After Tax.",
        formula: "((Ending PAT / Beginning PAT)^(1/Years)) - 1",
      },
      {
        id: 13,
        name: "CFO CAGR",
        description:
          "Compounded Annual Growth Rate of Cash Flow from Operations.",
        formula: "((Ending CFO / Beginning CFO)^(1/Years)) - 1",
      },
      {
        id: 14,
        name: "FCFF CAGR",
        description: "Compounded Annual Growth Rate of Free Cash Flow to Firm.",
        formula: "((Ending FCFF / Beginning FCFF)^(1/Years)) - 1",
      },
      {
        id: 15,
        name: "CFO/PBIT CAGR",
        description:
          "Compounded Annual Growth Rate of Cash Flow from Operations to Profit Before Interest and Tax.",
        formula: "((Ending CFO/PBIT / Beginning CFO/PBIT)^(1/Years)) - 1",
      },
      {
        id: 16,
        name: "PE (Trailing)",
        description:
          "Trailing Price-to-Earnings Ratio measures a company's valuation based on past earnings.",
        formula: "Market Price per Share / EPS (Trailing)",
      },
      {
        id: 17,
        name: "PE (1 Yr Forward)",
        description:
          "One-year forward Price-to-Earnings Ratio estimates valuation based on projected earnings.",
        formula: "Market Price per Share / EPS (Projected 1 Yr)",
      },
      {
        id: 18,
        name: "PE (2 Yr Forward)",
        description:
          "Two-year forward Price-to-Earnings Ratio estimates valuation based on projected earnings.",
        formula: "Market Price per Share / EPS (Projected 2 Yr)",
      },
      {
        id: 19,
        name: "Price / CFO",
        description:
          "Price to Cash Flow from Operations Ratio measures valuation relative to cash generation.",
        formula: "Market Capitalization / CFO",
      },
      {
        id: 20,
        name: "Price / FCFF",
        description:
          "Price to Free Cash Flow to Firm Ratio measures valuation relative to free cash flows.",
        formula: "Market Capitalization / FCFF",
      },
    ];

    function generateOptionsWithYears(options) {
      let newOptions = [];

      options.forEach((option) => {
        for (let year = 1; year <= 10; year++) {
          newOptions.push({
            id: option.id,
            name: `${option.name} ${year} Years`,
            looking_period: year,
            original_name: option.name,
          });
        }
      });

      return newOptions;
    }

    const newOptions = generateOptionsWithYears(options);
    const optionKeys = newOptions.map((option) => option.name);

    const formatQuery = (input) => {
      return input
        .replace(/\b(AND|OR)\b(?!\n)/gi, "$1\n")
        .replace(/\n\s+/g, "\n")
        .trim();
    };

    const handleChange = (event) => {
      let newValue = event.target.value;
      if (/\b(AND|OR)\b/i.test(newValue)) {
        newValue = formatQuery(newValue);
      }

      setQuery(newValue);

      const words = newValue.trim().split(/\s+/);
      const lastWord = words[words.length - 1];

      const selectedObj = options.find(
        (option) => option.name.toLowerCase() === lastWord.toLowerCase()
      );
      if (selectedObj) {
        setSelectedOption(selectedObj.name);
        setDescription(selectedObj.description);
        setFormula(selectedObj.formula);
      }
    };

    const handleSelect = (event, newValue) => {
      if (!newValue) return;

      let words = query.trim().split(/\s+/);

      if (words.length > 0 && !options[words[words.length - 1]]) {
        words[words.length - 1] = newValue;
      } else {
        words.push(newValue);
      }

      let updatedQuery = words.join(" ");
      if (/\b(AND|OR)\b/i.test(updatedQuery)) {
        updatedQuery = formatQuery(updatedQuery);
      }

      setQuery(updatedQuery);

      const selectedNewOption = newOptions.find((opt) => opt.name === newValue);

      if (selectedNewOption) {
        const originalOption = options.find(
          (opt) => opt.name === selectedNewOption.original_name
        );

        if (originalOption) {
          setSelectedOption(originalOption.name);
          setDescription(originalOption.description);
          setFormula(originalOption.formula);
        }
      }

      setTimeout(() => {
        const textarea = document.querySelector("textarea");
        if (textarea) {
          textarea.setSelectionRange(updatedQuery.length, updatedQuery.length);
          textarea.scrollTop = textarea.scrollHeight;
        }
      }, 0);
    };

    const parseExpression = (expression) => {
      try {
        const pattern = /^(.*?)\s*(\d+)\s*Years?\s*([<>]=?|=)\s*(\d+)$/;
        const parts = expression.match(pattern);

        if (!parts) {
          return null;
        }

        const [_, fullName, period, operator, value] = parts;

        const matchingOption = newOptions.find(
          (opt) =>
            opt.name.toLowerCase().startsWith(fullName.trim().toLowerCase()) &&
            opt.looking_period === parseInt(period)
        );

        if (!matchingOption) {
          return null;
        }

        const originalOption = options.find(
          (opt) => opt.name === matchingOption.original_name
        );

        if (!originalOption) {
          return null;
        }

        const signMap = {
          ">": "gt",
          ">=": "gte",
          "<": "lt",
          "<=": "lte",
          "=": "eq",
        };

        const result = {
          Data: {
            param: {
              name: originalOption.name,
              id: originalOption.id,
            },
            period: parseInt(period),
            sign: signMap[operator] || "eq",
            threshold: value,
            consisPeriod: 10,
          },
        };
        return result;
      } catch (error) {
        console.error("Error parsing expression:", error);
        return null;
      }
    };

    const parseQuery = (queryString) => {
      try {
        // Remove trailing AND/OR and clean up spaces
        const cleanQuery = queryString
          .replace(/\b(AND|OR)\s*$/i, "")
          .replace(/\s+/g, " ")
          .trim();

        // Split by AND/OR operators
        const parts = cleanQuery.split(/\b(AND|OR)\b/i);

        const results = [];

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i].trim();

          if (!part) continue;

          if (part.toUpperCase() === "AND" || part.toUpperCase() === "OR") {
            if (results.length > 0) {
              results[results.length - 1].Operator = part.toUpperCase();
            }
            continue;
          }

          const parsedExpression = parseExpression(part);
          if (parsedExpression) {
            results.push({
              ...parsedExpression,
              Operator: "AND",
            });
          }
        }

        return results;
      } catch (error) {
        console.error("Error parsing query:", error);
        return [];
      }
    };
    const [open, setOpen] = useState(false);
    const sessionIdRef = useRef(crypto.randomUUID());
    const handleRunQuery = async () => {
      const isLoggedIn = !!localStorage.getItem("userName");

      // Check if user is not logged in
      if (!isLoggedIn) {
        setOpen(true);
        return;
      }

      // Validate the query
      if (!query.trim()) {
        showSnackbar("Please enter a query first");
        return;
      }

      const parsedResults = parseQuery(query);

      // Handle invalid query format
      if (parsedResults.length === 0) {
        showSnackbar(`No valid expressions found in query. 
  Expected format: "Metric Name X Year operator Value"
  Example: "Average DE 2 Year >= 30 AND ROE CAGR 3 Year < 40"`);
        return;
      }

      // Format query results
      const formattedResults = { filters: parsedResults };
      setQueryResults(formattedResults);
      onSearchButtonClick(query, sessionIdRef.current);

      const user = localStorage.getItem("userName");

      try {
        // Execute query with valid results
        const data = await executeQuery(
          formattedResults,
          sessionIdRef.current,
          user
        );
        console.log("Data", data);
      } catch (error) {
        showSnackbar("Failed to execute query.");
      }
    };

    const handleSaveConfirm = async () => {
      if (!strategyName.trim()) {
        showSnackbar("Please enter a strategy name");
        return;
      }

      try {
        // Generate a unique identifier
        const uniqueId = Math.random().toString(36).substr(2, 8);
        const shareLink = isPublic ? `/strategy/shared/${uniqueId}` : null;

        // Save strategy to backend
        const response = await saveStrategy(
          sessionIdRef.current,
          strategyName,
          isPublic
        );
        if (response?.message !== "Strategy updated successfully") {
          throw new Error(response?.message || "Failed to save strategy");
        }

        // Save strategy to localStorage
        const strategy = {
          id: uniqueId,
          name: strategyName,
          query: query,
          isPublic: isPublic,
          shareLink: shareLink,
          createdAt: new Date().toISOString(),
        };

        const savedStrategies = JSON.parse(
          localStorage.getItem("savedStrategies") || "[]"
        );
        savedStrategies.push(strategy);
        localStorage.setItem(
          "savedStrategies",
          JSON.stringify(savedStrategies)
        );

        if (isPublic) {
          setShareableLink(window.location.origin + shareLink);
          showSnackbar(
            `Strategy saved! Shareable link: ${
              window.location.origin + shareLink
            }`
          );
        } else {
          showSnackbar("Strategy saved successfully!");
        }

        setSaveDialogOpen(false);
        setStrategyName("");
        setIsPublic(false);
      } catch (error) {
        console.error("Error saving strategy:", error);
        showSnackbar("Error saving strategy. Please try again.");
      }
    };

    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };

    const showSnackbar = (message) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    };

    const [showHelperPopup, setShowHelperPopup] = useState(false);

    return (
      <ThemeProvider theme={theme}>
        <Box
          id="search-input"
          sx={{
            maxWidth: 1200,
            mx: "auto",
            p: 3,
            backgroundColor: "white",
            borderRadius: 1,
          }}
        >
          <Typography
            color="primary.main"
            variant="h5"
            component="h2"
            fontWeight="bold"
            gutterBottom
          >
            FidelFolio Screener Query Builder
          </Typography>

          {/* Main Content Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
              gap: 3,
            }}
          >
            {/* Left Column */}
            <Box>
              <Box sx={{ position: "relative" }}>
                <Autocomplete
                  value={query}
                  onChange={handleSelect}
                  options={optionKeys}
                  freeSolo
                  disableClearable
                  filterOptions={(opts, { inputValue }) => {
                    const expressions = inputValue.split(/\b(AND|OR)\b/i);
                    const lastExpression =
                      expressions[expressions.length - 1].trim();
                    return !lastExpression
                      ? opts
                      : opts.filter((option) =>
                          option
                            .toLowerCase()
                            .startsWith(lastExpression.toLowerCase())
                        );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      multiline
                      minRows={6}
                      value={query}
                      onChange={handleChange}
                      placeholder="Type the query here..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: null,
                      }}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: theme.palette.background.paper,
                        },
                        "& .MuiInputBase-input": {
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{
                        py: 1,
                        px: 2,
                      }}
                    >
                      {option}
                    </Box>
                  )}
                />
                {query && (
                  <IconButton
                    onClick={() => setQuery("")}
                    size="small"
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: theme.palette.grey[500],
                      "&:hover": {
                        color: theme.palette.error.main,
                      },
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleRunQuery}
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
                  }}
                >
                  <PlayArrowIcon />
                  Execute
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowHelperPopup(true)}
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
                  }}
                >
                  Show Sample
                </Button>
              </Box>

              {/* Results Section */}
              {queryResults.length > 0 && (
                <Paper
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Query Structure
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      p: 2,
                      borderRadius: 1,
                      overflowX: "auto",
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        fontFamily: "monospace",
                        m: 0,
                      }}
                    >
                      {JSON.stringify(queryResults, null, 2)}
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Box>

            {/* Right Column - Help Panel */}
            <Paper
              sx={{
                p: 2,
                height: "fit-content",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Selected Metric Details
              </Typography>
              {selectedOption ? (
                <>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{ mb: 1 }}
                  >
                    {selectedOption}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {description}
                  </Typography>
                  {formula && (
                    <Box
                      sx={{
                        backgroundColor: theme.palette.background.default,
                        p: 1.5,
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {formula}
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select a metric to see its details
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Helper Popup Dialog */}
          <Dialog
            open={showHelperPopup}
            onClose={() => setShowHelperPopup(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">How to Use Query Builder</Typography>
                <IconButton onClick={() => setShowHelperPopup(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                  pt: 2,
                }}
              >
                {/* Sample Query Section */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                    }}
                  >
                    Sample Query
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.grey[100],
                      p: 2,
                      borderRadius: 1,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.6,
                      }}
                    >
                      {`DE CAGR 1 Years >= 25 AND\nPBIDT CAGR 9 Years < 40 AND\nAverage DE 6 Years > 16`}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Tips:</strong>
                  </Typography>
                  <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                    <li>
                      <Typography variant="body2">
                        Use AND/OR to combine multiple conditions
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Start typing to see available metrics
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Use comparison operators: &gt;, &lt;, &gt;=, &lt;=, =
                      </Typography>
                    </li>
                  </ul>
                </Box>

                {/* GIF Section */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.grey[300]}`,
                    height: "300px",
                  }}
                >
                  <img
                    src={require("../assets/helper.gif")}
                    alt="How to use query builder"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setQuery(
                    `DE CAGR 1 Years >= 25 AND\nPBIDT CAGR 9 Years < 40 AND\nAverage DE 6 Years > 16`
                  );
                  setShowHelperPopup(false);
                }}
                variant="outlined"
                startIcon={<ContentPasteIcon />}
                sx={{ borderRadius: 1 }}
              >
                Paste Sample
              </Button>
              <Button
                onClick={() => setShowHelperPopup(false)}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 1 }}
              >
                Got It!
              </Button>
            </DialogActions>
          </Dialog>

          {/* Save Strategy Dialog */}
          <Dialog
            open={saveDialogOpen}
            onClose={() => setSaveDialogOpen(false)}
          >
            <DialogTitle>Save Strategy</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Strategy Name"
                fullWidth
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                }
                label="Make this strategy public"
              />
              {shareableLink && (
                <TextField
                  margin="dense"
                  label="Shareable Link"
                  fullWidth
                  value={shareableLink}
                  InputProps={{
                    readOnly: true,
                  }}
                  onClick={(e) => e.target.select()}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setSaveDialogOpen(false)}
                variant="outlined"
                sx={{ borderRadius: 1 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveConfirm}
                variant="contained"
                sx={{ borderRadius: 1 }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <SnackbarContent
              message={snackbarMessage}
              onClose={handleSnackbarClose}
            />
          </Snackbar>
        </Box>
        <AuthDialog open={open} handleClose={() => setOpen(false)} />
      </ThemeProvider>
    );
  }
);

export default SearchInput;
