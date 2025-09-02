/**
 * Result Analysis Guide Page Component Module
 * Provides a comprehensive guide for analyzing trading strategy results
 * Includes interactive tutorials and visual demonstrations
 * Features tabbed navigation and animated sections
 */

import React from "react";
import theme from "../styles/theme";
import {
  Box,
  ThemeProvider,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Grow,
  Container,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import {
  CheckCircle,
  ImageNotSupported,
  TableChart,
  Timeline,
  ShowChart,
  BubbleChart,
  BarChart,
} from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * Collection of GIF assets for tutorial demonstrations
 * @type {Object.<string, string>}
 */
const gifs = {
  summaryTable: require("../assets/h1.gif").default,
  summaryCard: require("../assets/h1.gif").default,
  calendarReturns: require("../assets/h1.gif").default,
  averageReturn: require("../assets/h1.gif").default,
  riskAnalysis: require("../assets/h1.gif").default,
  sharpeRatio: require("../assets/h1.gif").default,
  highlowReturns: require("../assets/h1.gif").default,
  riskReturn: require("../assets/h1.gif").default,
};

/**
 * Tab Panel Component
 * Renders content for a specific tab
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display
 * @param {number} props.value - Current tab index
 * @param {number} props.index - Tab panel index
 * @returns {React.ReactElement} Tab panel component
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Guide sections configuration
 * Defines the structure and content of the analysis guide
 * @type {Array<Object>}
 */
const sections = [
  {
    title: "Quick Summary",
    icon: <TableChart />,
    tabs: [
      {
        title: "Portfolio Companies by Year",
        description: [
          "Table showing portfolio companies selected for each year from 1999 to 2022",
          "Export button to download the company selection data",
          "Filter by specific years or sectors",
          "Detailed view for each year's selection",
        ],
        gifKey: "summaryTable",
      },
      {
        title: "Performance Summary",
        description: [
          "Card showing return and risk percentages for 1-5 year investment periods",
          "Comparison between your strategy and Nifty50 benchmark",
          "Visual indicators for outperformance/underperformance",
          "Key metrics at a glance",
        ],
        gifKey: "summaryCard",
      },
    ],
  },
  {
    title: "Calendar Year Returns",
    icon: <Timeline />,
    description: [
      "Annual returns from 2000 to 2021 for your strategy",
      "Side-by-side comparison with Nifty50 returns",
      "Visualization of outperformance/underperformance years",
      "Export option for the complete return series",
    ],
    gifKey: "calendarReturns",
  },
  {
    title: "Rolling Returns Analysis",
    icon: <ShowChart />,
    charts: [
      {
        title: "Average Return",
        icon: <ShowChart />,
        description: [
          "Line chart showing average returns for 1-10 year investment periods",
          "Comparison between your strategy and Nifty50",
          "Visualization of how returns stabilize with longer holding periods",
          "Hover interactivity to see exact return percentages",
        ],
        gifKey: "averageReturn",
      },
      {
        title: "Risk Analysis",
        icon: <BarChart />,
        description: [
          "Line chart showing average risk (standard deviation) for 1-10 year periods",
          "Comparison between your strategy and Nifty50",
          "Visualization of risk reduction with longer holding periods",
          "Risk-return tradeoff insights",
        ],
        gifKey: "riskAnalysis",
      },
      {
        title: "Sharpe Ratio",
        icon: <ShowChart />,
        description: [
          "Line chart showing risk-adjusted returns (Sharpe Ratio) for 1-10 year periods",
          "Comparison between your strategy and Nifty50",
          "Visualization of consistency in risk-adjusted performance",
          "Benchmark line at 1.0 for reference",
        ],
        gifKey: "sharpeRatio",
      },
      {
        title: "High-Low Returns",
        icon: <BarChart />,
        description: [
          "Bar chart showing best and worst returns for each investment period (1-10 years)",
          "Comparison between your strategy and Nifty50",
          "Visualization of performance range and consistency",
          "Highlighting of extreme outcomes",
        ],
        gifKey: "highlowReturns",
      },
      {
        title: "Risk vs Return",
        icon: <BubbleChart />,
        description: [
          "Bubble chart comparing risk and return for 10-year periods",
          "Comparison between your strategy and Nifty50",
          "Bubble size represents investment period",
          "Efficient frontier visualization",
        ],
        gifKey: "riskReturn",
      },
    ],
  },
];

const GifPlaceholder = () => (
  <Box
    sx={{
      width: "100%",
      height: 200,
      bgcolor: "rgba(0, 0, 0, 0.04)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 2,
      border: "1px dashed rgba(0, 0, 0, 0.12)",
    }}
  >
    <ImageNotSupported
      sx={{ fontSize: 48, color: "rgba(0, 0, 0, 0.3)", mb: 1 }}
    />
    <Typography color="text.secondary">GIF demonstration</Typography>
  </Box>
);

const ResultAnalysisGuide = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "rgba(96, 173, 94, 0.1)",
        }}
      >
        <Header />
        <Box sx={{ height: "120px" }} />
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: 4,
            minHeight: "calc(100vh - 264px)",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: 2,
              backdropFilter: "blur(4px)",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              Result Analysis Guide
            </Typography>

            <Typography
              variant="body1"
              paragraph
              sx={{
                mb: 4,
                color: theme.palette.text.secondary,
                fontSize: "1.1rem",
              }}
            >
              Understand your backtesting results through these comprehensive
              analysis sections.
            </Typography>

            <br />
            <br />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {sections.map((section, index) => (
                <Fade in={true} key={index} timeout={800}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      {section.icon}
                      <Typography
                        variant="h5"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: "600",
                        }}
                      >
                        {section.title}
                      </Typography>
                    </Box>

                    {section.tabs ? (
                      <>
                        <Tabs
                          value={tabValue}
                          onChange={handleTabChange}
                          variant="fullWidth"
                          sx={{
                            mb: 3,
                            "& .MuiTabs-indicator": {
                              backgroundColor: theme.palette.primary.main,
                              height: 3,
                            },
                          }}
                        >
                          {section.tabs.map((tab, tabIndex) => (
                            <Tab
                              key={tabIndex}
                              label={tab.title}
                              sx={{
                                fontWeight: "600",
                                color:
                                  tabValue === tabIndex
                                    ? theme.palette.primary.main
                                    : "text.secondary",
                              }}
                            />
                          ))}
                        </Tabs>

                        {section.tabs.map((tab, tabIndex) => (
                          <TabPanel
                            key={tabIndex}
                            value={tabValue}
                            index={tabIndex}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                gap: 4,
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                <List dense>
                                  {tab.description.map((item, idx) => (
                                    <Grow
                                      in={true}
                                      key={idx}
                                      timeout={800 + idx * 100}
                                    >
                                      <ListItem sx={{ py: 0.5, pl: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                          <CheckCircle color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={item}
                                          primaryTypographyProps={{
                                            variant: "body1",
                                            sx: {
                                              lineHeight: 1.6,
                                              color: theme.palette.text.primary,
                                            },
                                          }}
                                        />
                                      </ListItem>
                                    </Grow>
                                  ))}
                                </List>
                              </Box>

                              <Box
                                sx={{
                                  flex: 1,
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  boxShadow: 3,
                                  maxWidth: "100%",
                                  height: "auto",
                                }}
                              >
                                {gifs[tab.gifKey] ? (
                                  <img
                                    src={gifs[tab.gifKey]}
                                    alt={`${tab.title} demonstration`}
                                    style={{
                                      width: "100%",
                                      height: "auto",
                                      display: "block",
                                    }}
                                  />
                                ) : (
                                  <GifPlaceholder />
                                )}
                              </Box>
                            </Box>
                          </TabPanel>
                        ))}
                      </>
                    ) : section.charts ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        {section.charts.map((chart, chartIndex) => (
                          <Card
                            key={chartIndex}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              boxShadow: 3,
                              background: "rgba(255, 255, 255, 0.9)",
                            }}
                          >
                            <CardContent>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  mb: 2,
                                }}
                              >
                                {chart.icon}
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: theme.palette.primary.main,
                                    fontWeight: "600",
                                  }}
                                >
                                  {chart.title}
                                </Typography>
                              </Box>

                              <List dense sx={{ mb: 2 }}>
                                {chart.description.map((item, idx) => (
                                  <Grow
                                    in={true}
                                    key={idx}
                                    timeout={800 + idx * 100}
                                  >
                                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 36 }}>
                                        <CheckCircle color="primary" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={item}
                                        primaryTypographyProps={{
                                          variant: "body1",
                                          sx: {
                                            lineHeight: 1.6,
                                            color: theme.palette.text.primary,
                                            fontSize: "0.9rem",
                                          },
                                        }}
                                      />
                                    </ListItem>
                                  </Grow>
                                ))}
                              </List>

                              <Box
                                sx={{
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  boxShadow: 2,
                                  maxWidth: "100%",
                                  height: "auto",
                                  mt: 2,
                                }}
                              >
                                {gifs[chart.gifKey] ? (
                                  <img
                                    src={gifs[chart.gifKey]}
                                    alt={`${chart.title} demonstration`}
                                    style={{
                                      width: "100%",
                                      height: "auto",
                                      display: "block",
                                    }}
                                  />
                                ) : (
                                  <GifPlaceholder />
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    ) : (
                      // This is for the Calendar Year Returns section
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          gap: 4,
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <List dense>
                            {section.description.map((item, idx) => (
                              <Grow
                                in={true}
                                key={idx}
                                timeout={800 + idx * 100}
                              >
                                <ListItem sx={{ py: 0.5, pl: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <CheckCircle color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{
                                      variant: "body1",
                                      sx: {
                                        lineHeight: 1.6,
                                        color: theme.palette.text.primary,
                                      },
                                    }}
                                  />
                                </ListItem>
                              </Grow>
                            ))}
                          </List>
                        </Box>

                        <Box
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: 3,
                            maxWidth: "100%",
                            height: "auto",
                          }}
                        >
                          {gifs[section.gifKey] ? (
                            <img
                              src={gifs[section.gifKey]}
                              alt={`${section.title} demonstration`}
                              style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                              }}
                            />
                          ) : (
                            <GifPlaceholder />
                          )}
                        </Box>
                      </Box>
                    )}

                    {index < sections.length - 1 && (
                      <Divider
                        sx={{
                          my: 4,
                          width: "80%",
                          mx: "auto",
                          borderBottomWidth: 2,
                          borderColor: "rgba(96, 173, 94, 0.5)",
                          boxShadow: "0 2px 4px rgba(96, 173, 94, 0.2)",
                        }}
                      />
                    )}
                  </Box>
                </Fade>
              ))}
            </Box>
          </Paper>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default ResultAnalysisGuide;
