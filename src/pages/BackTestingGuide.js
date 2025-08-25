/**
 * Backtesting Guide Page Component Module
 * Provides step-by-step instructions for using the backtesting feature
 * Includes visual demonstrations and interactive tutorials
 * Features animated transitions and responsive design
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
} from "@mui/material";
import { CheckCircle, ImageNotSupported } from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import step1Gif from "../assets/h1.gif";
import step2Gif from "../assets/h2.gif";
import step3Gif from "../assets/h3.gif";
import step4Gif from "../assets/h4.gif";

/**
 * Collection of GIF assets for tutorial demonstrations
 * @type {Object.<string, string>}
 */
const gifs = {
  step1: step1Gif,
  step2: step2Gif,
  step3: step3Gif,
  step4: step4Gif,
};

/**
 * Configuration for tutorial steps
 * Defines the structure and content of each guide step
 * @type {Array<Object>}
 */
const steps = [
  {
    label: "Write & Execute Query",
    description: [
      "Write your screening criteria in the FidelFolio query builder",
      'Use the "Show Sample" button if you need example queries',
      "The query area has a default query to help you get started",
      'Click the "Execute" button to run the backtester',
    ],
    gifKey: "step1",
  },
  {
    label: "Review & Edit Results",
    description: [
      "After execution, results will be displayed",
      'Use the "Edit Query" button to modify your criteria',
      "Re-run the query to see updated results",
    ],
    gifKey: "step2",
  },
  {
    label: "Save Your Strategy",
    description: [
      'Click the "Save Strategy" button to store your query',
      "Name your strategy for future reference",
      'Check the "Make Public" box to share with others',
      "Get a shareable link to distribute your strategy",
    ],
    gifKey: "step3",
  },
  {
    label: "Download Results",
    description: [
      "Generate a PDF report of your backtesting results",
      'Click the "Download Results" button',
      "Download each chart individually as well",
    ],
    gifKey: "step4",
  },
];

/**
 * GIF Placeholder Component
 * Displays a placeholder when GIF is not available
 * 
 * @returns {React.ReactElement} Placeholder component
 */
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

/**
 * Backtesting Guide Component
 * Renders the complete backtesting tutorial interface
 * Displays step-by-step instructions with visual aids
 * 
 * @returns {React.ReactElement} Backtesting guide page
 */
const BackTestingGuide = () => {
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
              Back Testing Guide
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
              Follow these simple steps to perform backtesting using our
              advanced platform.
            </Typography>

            <br />
            <br />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {steps.map((step, index) => (
                <Fade in={true} key={index} timeout={800}>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        color: theme.palette.primary.main,
                        fontWeight: "600",
                      }}
                    >
                      Step {index + 1}: {step.label}
                    </Typography>

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
                          {step.description.map((item, idx) => (
                            <Grow in={true} key={idx} timeout={800 + idx * 100}>
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
                        {gifs[step.gifKey] ? (
                          <img
                            src={gifs[step.gifKey]}
                            alt={`Step ${index + 1} demonstration`}
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

export default BackTestingGuide;
