import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import { forwardRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Card,
  Typography,
  Grid,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CardContent,
  Button,
} from "@mui/material";
import * as d3 from "d3";
import portfolioData from "../assets/data.json";
import HighlightIcon from "@mui/icons-material/Highlight";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import companyLogo from "../assets/logo.png";
import autoTable from "jspdf-autotable";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import SaveIcon from "@mui/icons-material/Save";
import Preloader from "./Preloader";
import startImage from "../assets/start.png";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tooltip from "@mui/material/Tooltip";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  SnackbarContent,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useExecuteQuery from "../hooks/useExecuteQuery";
import { OutputOutlined } from "@mui/icons-material";

const SearchOutput = forwardRef((props, ref) => {
  const { responseData } = useExecuteQuery();
  const [portfolioData, setPortfolioData] = useState({
    ippf: {},
    pfst: [],
    calyears: [],
  });

  useEffect(() => {
    console.log("SearchOutput - responseData:", responseData);
    if (responseData && responseData.output) {
      console.log(
        "SearchOutput - setting portfolio data:",
        responseData.output
      );
      setPortfolioData(responseData.output);
    }
  }, [responseData]);

  const { strategyId, sessionId } = props;
  const years = Object.keys(portfolioData.ippf)
    .filter((year) => !isNaN(year)) // Filter out non-numeric values
    .sort((a, b) => b - a); // Sort in descending order

  const [selectedYearPortfolio, setSelectedYearPortfolio] = useState(years[0]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [highlightedChart, setHighlightedChart] = useState(null);
  const [maxReturnYear, setMaxReturnYear] = useState(1);
  const [returnValue, setReturnValue] = useState(0);
  const [riskValue, setRiskValue] = useState(0);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // Add state for focused chart dimensions
  const [focusedDimensions, setFocusedDimensions] = useState({
    width:
      window.innerWidth < 600
        ? window.innerWidth - 40
        : window.innerWidth * 0.8,
    height: window.innerWidth < 600 ? 300 : 270, // Increased height for mobile
  });

  const columns = [
    { field: "year", headerName: "YEAR", width: 150 },
    { field: "yourStrategy", headerName: "YOUR STRATEGY", width: 200 },
    { field: "nifty50", headerName: "NIFTY50", type: "number", width: 200 },
  ];
  const safeParseFloat = (value) => {
    if (typeof value === "string") {
      return parseFloat(value);
    }
    return value;
  };

  const rows =
    portfolioData.calyears?.map((year) => ({
      id: year.id,
      year: parseInt(year.year),
      yourStrategy: parseFloat((year.portfolio_cagr * 100).toFixed(2)),
      nifty50: parseFloat((year.index_cagr * 100).toFixed(2)),
    })) || [];

  const rowsP = portfolioData.ippf?.[selectedYearPortfolio]
    ? portfolioData.ippf[selectedYearPortfolio]
        .replace(/[\[\]"]/g, "")
        .split(", ")
        .map((name, index) => ({ id: index + 1, name: name.trim() }))
    : [];
  // Modify the timePeriodsToShow array to include all 10 years
  const timePeriodsToShow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Update the labelsSp array to include all 10 years
  const labelsSp = timePeriodsToShow.map((year) => `${year}Y`);

  const graphData = {
    yourStrategy: timePeriodsToShow.map((period) => {
      const dataPoint = portfolioData.pfst?.find((p) => p.nyears === period);
      return parseFloat(
        (safeParseFloat(dataPoint?.cagr_mean || 0) * 100).toFixed(2)
      );
    }),
    nifty50: timePeriodsToShow.map((period) => {
      const dataPoint = portfolioData.pfst?.find((p) => p.nyears === period);
      return parseFloat(
        (safeParseFloat(dataPoint?.index_mean || 0) * 100).toFixed(2)
      );
    }),
  };

  const riskData = {
    yourStrategy: timePeriodsToShow.map((period) => {
      const dataPoint = portfolioData.pfst?.find((p) => p.nyears === period);
      return parseFloat(
        (safeParseFloat(dataPoint?.cagr_dwn_std || 0) * 100).toFixed(2)
      );
    }),
    nifty50: timePeriodsToShow.map((period) => {
      const dataPoint = portfolioData.pfst?.find((p) => p.nyears === period);
      return parseFloat(
        (safeParseFloat(dataPoint?.index_dwn_std || 0) * 100).toFixed(2)
      );
    }),
  };

  const sharpeData = {
    yourStrategy: timePeriodsToShow.map((period) => {
      const dataPoint = portfolioData.pfst.find((p) => p.nyears === period);
      return parseFloat(
        (safeParseFloat(dataPoint?.sharpe_ratio || 0) * 100).toFixed(2)
      );
    }),
    nifty50: timePeriodsToShow.map((period) => {
      const dataPoint = portfolioData.pfst.find((p) => p.nyears === period);
      return parseFloat(
        (safeParseFloat(dataPoint?.index_SR || 0) * 100).toFixed(2)
      );
    }),
  };

  const highLowData = portfolioData.pfst.map((p) => ({
    highestPCAGR: parseFloat(
      (safeParseFloat(p.highest_pcagr) * 100).toFixed(2)
    ),
    lowestPCAGR: parseFloat((safeParseFloat(p.lowest_pcagr) * 100).toFixed(2)),
    highestIndex: parseFloat(
      (safeParseFloat(p.highest_index) * 100).toFixed(2)
    ),
    lowestIndex: parseFloat((safeParseFloat(p.lowest_index) * 100).toFixed(2)),
  }));

  const bubbleData = {
    yourStrategy: portfolioData.pfst.map((p) => ({
      x: parseFloat((p.cagr_mean * 100).toFixed(2)),
      y: parseFloat((p.cagr_dwn_std * 100).toFixed(2)),
      size: Math.sqrt(p.nyears) * 5, // Using square root for better visual scaling
      label: `${p.nyears}Y`,
    })),
    nifty50: portfolioData.pfst.map((p) => ({
      x: parseFloat((p.index_mean * 100).toFixed(2)),
      y: parseFloat((p.index_dwn_std * 100).toFixed(2)),
      size: Math.sqrt(p.nyears) * 5, // Using square root for better visual scaling
      label: `${p.nyears}Y`,
    })),
  };

  // Modify handleHighlight to include focus mode logic
  const handleHighlight = (chartId) => {
    if (highlightedChart === chartId) {
      setHighlightedChart(null);
    } else {
      setHighlightedChart(chartId);
      // Adjust dimensions to better fit the content
      setFocusedDimensions({
        width:
          window.innerWidth < 600
            ? window.innerWidth - 40
            : window.innerWidth * 0.8,
        height: window.innerWidth < 600 ? 300 : 270, // Increased height for mobile
      });
    }
  };

  // Add handler to exit focus mode
  const handleExitFocus = () => {
    setHighlightedChart(null);
  };

  useEffect(() => {
    if (!portfolioData.pfst) return;

    // Find data for selected year
    const yearData = portfolioData.pfst.find((d) => d.nyears === selectedYear);
    if (yearData) {
      setReturnValue(yearData.cagr_mean * 100);
      setRiskValue(yearData.cagr_dwn_std * 100);
    }

    // Find year with maximum return using reduce
    const maxReturnData = portfolioData.pfst.reduce((max, current) => {
      if (!max || current.cagr_mean > max.cagr_mean) {
        return current;
      }
      return max;
    }, null);

    if (maxReturnData) {
      setMaxReturnYear(maxReturnData.nyears);
    }
  }, [selectedYear, portfolioData.pfst]);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    if (!portfolioData.pfst) return;

    const yearData = portfolioData.pfst.find((d) => Number(d.nyears) === year);
    if (yearData) {
      setReturnValue(Number(yearData.cagr_mean) * 100);
      setRiskValue(Number(yearData.cagr_dwn_std || yearData.cagr_std) * 100);
    }
  };

  const handleYearSelectPortfolio = (year) => {
    setSelectedYearPortfolio(year);
  };

  // Modify the export function to include all years
  const handleExport = () => {
    const allData = Object.entries(portfolioData.ippf || {}).flatMap(
      ([year, stocks]) => {
        if (!stocks) return [];
        const companies = stocks
          .replace(/[\[\]"]/g, "")
          .split(", ")
          .map((name) => name.trim());

        return companies.map((company, index) => ({
          "Sl. No.": index + 1,
          Year: year,
          "Company Name": company,
        }));
      }
    );

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(allData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Portfolio");

    // Auto-size columns
    const colWidths = [
      { wch: 10 }, // Year
      { wch: 8 }, // Sl. No.
      { wch: 40 }, // Company Name
    ];
    ws["!cols"] = colWidths;

    XLSX.writeFile(wb, "portfolio_all_years.xlsx");
  };

  // Fix the average calculation
  const calculateAverages = () => {
    if (!portfolioData.pfst) return { returnDiff: 0, riskDiff: 0 };

    // Calculate weighted averages based on the number of years
    let totalWeight = 0;
    let weightedStrategyReturn = 0;
    let weightedNiftyReturn = 0;
    let weightedStrategyRisk = 0;
    let weightedNiftyRisk = 0;

    portfolioData.pfst.forEach((data) => {
      const weight = data.nyears; // Use number of years as weight
      totalWeight += weight;

      weightedStrategyReturn += (data.cagr_mean || 0) * weight;
      weightedNiftyReturn += (data.index_mean || 0) * weight;
      weightedStrategyRisk += (data.cagr_dwn_std || 0) * weight;
      weightedNiftyRisk += (data.index_dwn_std || 0) * weight;
    });

    // Calculate weighted averages
    const avgStrategyReturn = weightedStrategyReturn / totalWeight;
    const avgNiftyReturn = weightedNiftyReturn / totalWeight;
    const avgStrategyRisk = weightedStrategyRisk / totalWeight;
    const avgNiftyRisk = weightedNiftyRisk / totalWeight;

    return {
      returnDiff: ((avgStrategyReturn - avgNiftyReturn) * 100).toFixed(1),
      riskDiff: ((avgStrategyRisk - avgNiftyRisk) * 100).toFixed(1),
    };
  };

  const signMap = {
    gt: ">",
    gte: ">=",
    lt: "<",
    lte: "<=",
    eq: "=",
  };

  const formatQuery = (query) => {
    try {
      // First, convert the JS object string to valid JSON
      const jsonString = query
        // Add quotes around property names
        .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
        // Add quotes around string values (that aren't already quoted)
        .replace(/:([ ]*)([a-zA-Z][a-zA-Z0-9_ ]+)([ ]*)([,}])/g, ':$1"$2"$3$4');

      // Now parse as JSON
      const parsedQuery = JSON.parse(jsonString);

      if (!parsedQuery.filters || !Array.isArray(parsedQuery.filters)) {
        return "Invalid query format";
      }

      const filters = parsedQuery.filters.map((filter) => {
        const { Data, Operator } = filter;
        if (
          !Data ||
          !Data.param ||
          !Data.sign ||
          Data.threshold === undefined
        ) {
          return "";
        }

        const { param, sign, threshold } = Data;
        const mappedSign = signMap[sign] || sign;
        const operator = Operator ? ` ${Operator}` : "";
        return `${param.name} ${mappedSign} ${threshold}${operator}`;
      });

      return filters
        .join(" ")
        .replace(/\s+(AND|OR)$/, "")
        .trim();
    } catch (error) {
      console.error("Error parsing query:", error);
      return "Invalid query";
    }
  };

  const avgReturnRef = useRef(null);
  const riskRef = useRef(null);
  const sharpeRef = useRef(null);
  const highLowRef = useRef(null);
  const riskReturnRef = useRef(null);

  const handleDownloadPDF = async () => {
    try {
      setIsPdfLoading(true);

      const pdf = new jsPDF("p", "mm", [210, 250]);
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Helper function for safe text rendering
      const safeText = (text, defaultValue = "") => {
        if (text === null || text === undefined) return defaultValue;
        return text.toString();
      };

      // Helper function for consistent styling
      const addStyledHeading = (text, y, size = 18) => {
        pdf.setFontSize(size);
        pdf.setTextColor(34, 139, 34); // Green color
        pdf.text(safeText(text), pageWidth / 2, y, { align: "center" });
        pdf.setTextColor(0, 0, 0); // Reset to black
      };

      const addLogo = (pdf) => {
        const logoWidth = 50;
        const logoHeight = 20;
        pdf.addImage(
          companyLogo,
          "PNG",
          pageWidth - 60,
          10,
          logoWidth,
          logoHeight
        );
      };

      // Front cover page - updated layout
      pdf.addImage(companyLogo, "PNG", pageWidth / 2 - 35, 10, 70, 30);

      pdf.setFontSize(24);
      pdf.setTextColor(34, 139, 34);
      pdf.text("Fidelfolio Backtester Platform", pageWidth / 2, 50, {
        align: "center",
      });

      // Add subtitle with styling
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        "Expert-Led, Data-Driven: Backtest Your Portfolio for Proven Success",
        pageWidth / 2,
        65,
        { align: "center", maxWidth: 180 }
      );

      // Add description with styling
      pdf.setFontSize(14);
      pdf.text(
        "Leverage expert insights and AI-driven backtesting to refine your portfolio with data-driven, long-term strategies",
        pageWidth / 2,
        85,
        { align: "center", maxWidth: 180 }
      );

      // Add start image
      const startImageWidth = 150;
      const startImageHeight = 120;
      pdf.addImage(
        startImage,
        "PNG",
        pageWidth / 2 - startImageWidth / 2,
        100,
        startImageWidth,
        startImageHeight
      );

      // Expected Return and Risk Section
      const firstFiveYearsData = portfolioData.pfst;

      if (firstFiveYearsData.length > 0) {
        pdf.addPage();
        addLogo(pdf);

        // Add query section with better formatting
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.text("Query Being Processed:", 10, 35);

        // Format and wrap the query text
        const strategyName =
          formatQuery(portfolioData.pfst[0]?.strat_name) ||
          "Portfolio Backtest Analysis";
        const maxWidth = pageWidth - 30; // 15mm margin on each side

        // Set smaller font size for query text
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        const queryLines = pdf.splitTextToSize(
          safeText(strategyName),
          maxWidth
        );

        // Calculate dynamic box height
        const lineHeight = 5; // Height of each text line
        const padding = 8; // Padding inside the box
        const queryBoxHeight = Math.max(
          queryLines.length * lineHeight + padding * 2,
          20 // Minimum box height
        );

        // Draw box with rounded corners
        pdf.setDrawColor(34, 139, 34); // Green border
        pdf.setFillColor(240, 247, 240); // Light green background
        pdf.roundedRect(15, 40, pageWidth - 30, queryBoxHeight, 3, 3, "FD");

        // Calculate vertical centering
        const boxTop = 40;
        const textHeight = queryLines.length * lineHeight;
        const verticalOffset = (queryBoxHeight - textHeight) / 2;

        // Add centered text (left-aligned within centered block)
        queryLines.forEach((line, index) => {
          pdf.text(
            line,
            20, // Left-align text with 20mm left margin (15mm box + 5mm padding)
            boxTop + verticalOffset + index * lineHeight
          );
        });

        // Adjust subsequent content position based on query box height
        const nextSectionY = 45 + queryBoxHeight + 15;

        // Add the heading for next section
        addStyledHeading(
          "Expected Return and Risk (For 10 Years)",
          nextSectionY
        );

        // Table styling
        const tableStyles = {
          headStyles: {
            fillColor: [34, 139, 34],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold",
          },
          bodyStyles: {
            fontSize: 9,
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
        };

        // Table data
        const tableData = [
          [
            "Year",
            "Your Strategy Return (%)",
            "Nifty50 Return (%)",
            "Your Strategy Risk (%)",
            "Nifty50 Risk (%)",
          ],
          ...firstFiveYearsData.map((yearData) => [
            yearData.nyears,
            (yearData.cagr_mean * 100).toFixed(1),
            (yearData.index_mean * 100).toFixed(1),
            (yearData.cagr_dwn_std * 100).toFixed(1),
            (yearData.index_dwn_std * 100).toFixed(1),
          ]),
        ];

        // Add the table
        autoTable(pdf, {
          startY: nextSectionY + 10,
          head: [tableData[0]],
          body: tableData.slice(1),
          ...tableStyles,
          margin: { top: 10, left: 15, right: 15 }, // Add margins to table
        });

        // Add highlights with styled text
        const highlightsStartY = pdf.lastAutoTable.finalY + 20;

        // Add highlights heading
        pdf.setFontSize(14);
        pdf.setTextColor(34, 139, 34);
        pdf.text("Key Highlights", pageWidth / 2, highlightsStartY, {
          align: "center",
        });

        // Add highlight points with colored text
        pdf.setFontSize(11);
        const { returnDiff, riskDiff } = calculateAverages();

        // Centered highlight box with left-aligned content
        const boxMargin = 15; // Left margin for text inside box
        const lineHeightNew = 10; // Vertical spacing between lines

        pdf.setDrawColor(34, 139, 34); // Green border
        pdf.setFillColor(240, 247, 240); // Light green background
        pdf.roundedRect(
          10,
          highlightsStartY + 10,
          pageWidth - 20,
          45,
          3,
          3,
          "FD"
        );
        pdf.setTextColor(0, 0, 0); // Black text

        // Calculate starting Y position inside box
        const boxContentStartY = highlightsStartY + 20;

        // Set consistent text parameters
        pdf.setFontSize(11);
        // Maximum return year highlight (left-aligned)
        pdf.text(
          `• Investing ${maxReturnYear} ${
            maxReturnYear === 1 ? "year" : "years"
          } gives maximum expected return`,
          boxMargin,
          boxContentStartY
        );

        // Calculate positions for colored segments
        const returnPrefix = "• Average Return is ";
        const returnHighlight = `${returnDiff}% points higher`;
        const returnSuffix = " than Nifty50";
        const riskPrefix = "• Your Strategy is ";
        const riskHighlight = `${riskDiff}% points more risky`;
        const riskSuffix = " than Nifty50";

        // Return difference highlight (perfectly aligned)
        pdf.text(returnPrefix, boxMargin, boxContentStartY + lineHeightNew);
        pdf.setTextColor(34, 139, 34); // Green for highlight
        pdf.text(
          returnHighlight,
          boxMargin +
            10 +
            pdf.getStringUnitWidth(returnPrefix) * pdf.internal.scaleFactor,
          boxContentStartY + lineHeightNew
        );
        pdf.setTextColor(0, 0, 0); // Back to black
        pdf.text(
          returnSuffix,
          boxMargin +
            20 +
            pdf.getStringUnitWidth(returnPrefix + returnHighlight) *
              pdf.internal.scaleFactor,
          boxContentStartY + lineHeightNew
        );

        // Risk difference highlight (perfectly aligned)
        pdf.text(riskPrefix, boxMargin, boxContentStartY + lineHeightNew * 2);
        pdf.setTextColor(255, 140, 0); // Orange for highlight
        pdf.text(
          riskHighlight,
          boxMargin +
            10 +
            pdf.getStringUnitWidth(riskPrefix) * pdf.internal.scaleFactor,
          boxContentStartY + lineHeightNew * 2
        );
        pdf.setTextColor(0, 0, 0); // Back to black
        pdf.text(
          riskSuffix,
          boxMargin +
            20 +
            pdf.getStringUnitWidth(riskPrefix + riskHighlight) *
              pdf.internal.scaleFactor,
          boxContentStartY + lineHeightNew * 2
        );
      }

      // Calendar Year Returns Section
      pdf.addPage();
      addLogo(pdf);
      addStyledHeading("Calendar Year Returns", 30);

      // Table data for Calendar Year Returns
      const calendarTableData = [
        ["Year", "Your Strategy (%)", "Nifty50 (%)"],
        ...rows.map((row) => [row.year, row.yourStrategy, row.nifty50]),
      ];

      // Table styling
      const tableStyles = {
        headStyles: {
          fillColor: [34, 139, 34],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      };

      // Add the Calendar Year Returns table
      autoTable(pdf, {
        startY: 50,
        head: [calendarTableData[0]],
        body: calendarTableData.slice(1),
        ...tableStyles,
        margin: { top: 50 },
      });

      // Charts Section - One chart per page, centered
      const charts = [
        {
          ref: avgReturnRef,
          title: "Average Return",
          type: "return",
          data: graphData,
        },
        { ref: riskRef, title: "Risk Analysis", type: "risk", data: riskData },
        {
          ref: sharpeRef,
          title: "Sharpe Ratio",
          type: "sharpe",
          data: sharpeData,
        },
        {
          ref: highLowRef,
          title: "High-Low Returns",
          type: "highLow",
          data: highLowData,
        },
        {
          ref: riskReturnRef,
          title: "Risk vs Return",
          type: "riskReturn",
          data: bubbleData,
        },
      ];

      // Process each chart on its own page
      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i];
        pdf.addPage();
        addLogo(pdf);

        // Add page heading in green
        addStyledHeading("Rolling Returns Analysis", 30);

        const chartElement = chart.ref.current?.getChartElement();
        if (chartElement) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const canvas = await html2canvas(chartElement, {
            useCORS: true,
            scale: 2,
          });
          const imgData = canvas.toDataURL("image/png");

          // Calculate centered position
          const chartWidth = pageWidth - 80; // 40mm margin on each side
          const chartHeight = 60; // Fixed height for all charts

          // Chart title (centered) in black
          pdf.setFontSize(14);
          pdf.setTextColor(0, 0, 0); // Set color to black for chart title
          pdf.text(chart.title, pageWidth / 2, 45, { align: "center" });

          // Centered chart image
          const chartX = (pageWidth - chartWidth) / 2;
          const chartY = 60; // Position below title
          pdf.addImage(imgData, "PNG", chartX, chartY, chartWidth, chartHeight);

          // Description box (centered below chart)
          const descY = chartY + chartHeight + 15;
          const descHeight = 30;
          const descWidth = pageWidth - 40;

          pdf.setDrawColor(34, 139, 34);
          pdf.setFillColor(240, 247, 240);
          pdf.roundedRect(
            (pageWidth - descWidth) / 2, // Center horizontally
            descY,
            descWidth,
            descHeight,
            3,
            3,
            "FD"
          );

          pdf.setTextColor(0, 0, 0);
          const description = getChartDescription(
            chart.type,
            chart.data,
            labelsSp
          );
          pdf.setFontSize(9);
          pdf.text(
            safeText(description),
            (pageWidth - descWidth) / 2 + 10, // Left padding
            descY + 15, // Vertical center of box
            {
              maxWidth: descWidth - 20, // Account for padding
              align: "left",
            }
          );
        }
      }

      pdf.save("portfolio_analysis.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleSaveStrategyClick = () => {
    if (ref.current) {
      ref.current.handleSaveStrategy();
    } else {
      console.error("Search input reference not found");
    }
  };

  const handleDownloadChart = async (chartId) => {
    let chartElement;

    switch (chartId) {
      case "avgReturn":
        chartElement = avgReturnRef.current?.getChartElement();
        break;
      case "risk":
        chartElement = riskRef.current?.getChartElement();
        break;
      case "sharpe":
        chartElement = sharpeRef.current?.getChartElement();
        break;
      case "highLow":
        chartElement = highLowRef.current?.getChartElement();
        break;
      case "riskReturn":
        chartElement = riskReturnRef.current?.getChartElement();
        break;
      default:
        console.error("Invalid chart ID");
        return;
    }

    if (!chartElement) {
      console.error("Chart element not found");
      return;
    }

    // Wait for the chart to render
    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(chartElement, {
      logging: true,
      useCORS: true,
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `${chartId}_chart.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleResize = () => {
      setFocusedDimensions({
        width:
          window.innerWidth < 600
            ? window.innerWidth - 40
            : window.innerWidth * 0.8,
        height: window.innerWidth < 600 ? 300 : 270, // Increased height for mobile
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once on mount to set initial dimensions

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const baseUrl = process.env.REACT_SHARE_URL || "http://localhost:3000";

  const shareLink = sessionId
    ? `${baseUrl}/strategy/shared/${sessionId}`
    : strategyId
    ? `${baseUrl}/strategy/shared/${strategyId}`
    : `${baseUrl}/unauthorized`;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setSnackbarMessage("Link copied to clipboard!");
    setSnackbarOpen(true); // Open Snackbar
    setOpen(false);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <ThemeProvider theme={theme}>
      {isPdfLoading && <Preloader />}
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: "white",
          width: { xs: "90%", sm: "100%" }, // Set width to 90% on mobile and 100% on larger screens
          maxWidth: { xs: "100%", sm: "90%" }, // Existing code
          margin: "0 auto", // Center the box
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0, 128, 0, 0.3)",
          "& .MuiCard-root": {
            overflow: "hidden",
          },
        }}
      >
        {/* Add a button to download PDF */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // Stack buttons on mobile
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            mb: 2,
            gap: { xs: 2, sm: 0 }, // Add gap between stacked buttons
          }}
        >
          {/* Left-aligned button */}
          <Tooltip title="Download results as a PDF">
            <IconButton
              variant="outlined"
              onClick={handleDownloadPDF}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1.5,
                boxShadow: "0 4px 10px rgba(0, 128, 0, 0.3)",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 14px rgba(0, 128, 0, 0.4)",
                },
              }}
            >
              <PictureAsPdfIcon sx={{ color: "green", fontSize: 30 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton
              variant="outlined"
              onClick={handleOpen}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1.5,
                boxShadow: "0 4px 10px rgba(0, 128, 0, 0.3)",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 14px rgba(0, 128, 0, 0.4)",
                },
              }}
            >
              <ShareIcon sx={{ color: "green", fontSize: 30 }} />
            </IconButton>
          </Tooltip>

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Share Link</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                value={shareLink}
                InputProps={{
                  readOnly: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCopy}
                startIcon={<ContentCopyIcon />}
                variant="contained"
                sx={{ borderRadius: 1 }}
              >
                Copy
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{ borderRadius: 1 }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for Copy Confirmation */}
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <SnackbarContent message={snackbarMessage} />
          </Snackbar>

          {/* Right-aligned button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveStrategyClick}
            startIcon={<SaveIcon />}
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
        <br />
        {/* Add IDs to tables and charts for PDF generation */}
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          gutterBottom
          color="primary.main"
        >
          A Quick Summary
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <FormControl sx={{ width: "80%" }}>
                  <InputLabel>Portfolio of selected stocks in</InputLabel>
                  <Select
                    value={selectedYearPortfolio}
                    label="Portfolio of selected stocks in"
                    onChange={(e) => handleYearSelectPortfolio(e.target.value)}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExport}
                  sx={{ height: 40, borderRadius: 1.5 }}
                >
                  Export
                </Button>
              </Box>
              <Box sx={{ mt: 2, maxHeight: 300, overflow: "auto" }}>
                <DataGrid
                  rows={rowsP}
                  columns={[
                    { field: "id", headerName: "Sl. No.", width: 70 },
                    { field: "name", headerName: "Company Name", flex: 1 },
                  ]}
                  sx={{
                    "& .MuiDataGrid-cell": {
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    },
                    width: "100%",
                    border: "none",
                  }}
                  hideFooter={true}
                  autoHeight
                  disableColumnMenu
                  disableColumnFilter
                  disableColumnSelector
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: "100%" }}>
              <Typography
                variant="h6"
                gutterBottom
                align="center"
                fontWeight="bold"
              >
                Expected Return and Risk
              </Typography>
              <CardContent sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 4,
                    mb: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        color: "success.main",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "center",
                      }}
                    >
                      {returnValue ? returnValue.toFixed(1) : "0.0"}
                      <Typography
                        component="span"
                        sx={{
                          ml: 1,
                          color: "text.secondary",
                          fontSize: "1rem",
                        }}
                      >
                        % return
                      </Typography>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        color: "warning.main",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "center",
                      }}
                    >
                      {riskValue ? riskValue.toFixed(1) : "0.0"}
                      <Typography
                        component="span"
                        sx={{
                          ml: 1,
                          color: "text.secondary",
                          fontSize: "1rem",
                        }}
                      >
                        % risk
                      </Typography>
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2, textAlign: "center" }}>
                  {[1, 2, 3, 4, 5].map((year) => (
                    <Button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      sx={{
                        mr: 1,
                        mb: 1,
                        color: selectedYear === year ? "primary.main" : "black",
                        borderBottom:
                          selectedYear === year
                            ? "2px solid primary.main"
                            : "none",
                        border: "1px solid #b0b0b0", // Added border for year options
                        borderRadius: "4px 4px 0 0",
                        borderColor:
                          selectedYear === year ? "primary.main" : "none",
                        padding: "4px 12px", // Added padding for better appearance
                        "&:hover": {
                          borderColor: "primary.main", // Change border color on hover
                        },
                      }}
                    >
                      {year} {year === 1 ? "year" : "years"}
                    </Button>
                  ))}
                </Box>

                <Typography
                  sx={{
                    mt: 2,
                    color: "text.primary",
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  Investing {maxReturnYear}{" "}
                  {maxReturnYear === 1 ? "year" : "years"} gives maximum
                  expected return.
                </Typography>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  {(() => {
                    const { returnDiff, riskDiff } = calculateAverages();
                    return (
                      <>
                        <Typography
                          sx={{
                            color: "text.primary",
                            fontSize: "1.575rem",
                            mb: 1,
                          }}
                        >
                          Highlights
                        </Typography>
                        <Typography
                          sx={{
                            color: "text.primary",
                            fontSize: "1rem",
                            mb: 1,
                          }}
                        >
                          Average Return is{" "}
                          <span
                            style={{ color: "#2e7d32", fontWeight: "bold" }}
                          >
                            {returnDiff}% points higher
                          </span>{" "}
                          than Nifty50.
                        </Typography>
                        <Typography
                          sx={{ color: "text.primary", fontSize: "1rem" }}
                        >
                          Your Strategy is{" "}
                          <span
                            style={{ color: "#ed6c02", fontWeight: "bold" }}
                          >
                            {riskDiff}% points more risky
                          </span>{" "}
                          than Nifty50
                        </Typography>
                      </>
                    );
                  })()}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <br />
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          gutterBottom
          color="primary.main"
          sx={{ mt: 4 }}
        >
          Calendar Year Returns
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: 400 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                autoHeight={false}
                slots={{
                  toolbar: GridToolbar,
                }}
                sx={{
                  height: 400,
                  overflow: "auto",
                }}
                hideFooterPagination
              />
            </Card>
          </Grid>
        </Grid>

        <br />
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          gutterBottom
          color="primary.main"
          sx={{ mt: 4 }}
        >
          Rolling Returns
        </Typography>

        {highlightedChart ? (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", sm: "80%" }, // Responsive width
              maxWidth: "1200px",
              maxHeight: { xs: "90vh", sm: "80vh" }, // Responsive height
              bgcolor: "background.paper",
              zIndex: 1300,
              borderRadius: 2,
              boxShadow: 24,
              p: { xs: 2, sm: 4 }, // Responsive padding
              overflow: "auto",
            }}
          >
            <IconButton
              onClick={handleExitFocus}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 1400,
              }}
            >
              <CloseIcon />
            </IconButton>

            {highlightedChart === "avgReturn" && (
              <>
                <Typography variant="h5" color="primary" gutterBottom>
                  Average Return
                </Typography>
                <LineChartD3
                  data={graphData}
                  labels={labelsSp}
                  dimensions={{
                    width:
                      window.innerWidth < 600
                        ? window.innerWidth - 40
                        : focusedDimensions.width * 0.9,
                    height: window.innerWidth < 600 ? 300 : 270, // Increased height for mobile
                  }}
                  type="return"
                  id="avgReturn"
                />
              </>
            )}
            {highlightedChart === "risk" && (
              <>
                <Typography variant="h5" color="primary" gutterBottom>
                  Risk Analysis
                </Typography>
                <LineChartD3
                  data={riskData}
                  labels={labelsSp}
                  dimensions={{
                    width:
                      window.innerWidth < 600
                        ? window.innerWidth - 40
                        : focusedDimensions.width * 0.9,
                    height: window.innerWidth < 600 ? 300 : 270, // Increased height for mobile
                  }}
                  type="risk"
                  id="risk"
                />
              </>
            )}
            {highlightedChart === "sharpe" && (
              <>
                <Typography variant="h5" color="primary" gutterBottom>
                  Sharpe Ratio
                </Typography>
                <LineChartD3
                  data={sharpeData}
                  labels={labelsSp}
                  dimensions={{
                    width:
                      window.innerWidth < 600
                        ? window.innerWidth - 40
                        : focusedDimensions.width * 0.9,
                    height: window.innerWidth < 600 ? 300 : 270, // Increased height for mobile
                  }}
                  type="sharpe"
                  id="sharpe"
                />
              </>
            )}
            {highlightedChart === "highLow" && (
              <>
                <Typography variant="h5" color="primary" gutterBottom>
                  High-Low Returns
                </Typography>
                <BarChartD3
                  data={highLowData}
                  labels={labelsSp}
                  dimensions={{
                    width:
                      window.innerWidth < 600
                        ? window.innerWidth - 40
                        : focusedDimensions.width * 0.9,
                    height: window.innerWidth < 600 ? 300 : 270, // Increased height for mobile
                  }}
                  id="highLow"
                />
              </>
            )}
            {highlightedChart === "riskReturn" && (
              <>
                <Typography variant="h5" color="primary" gutterBottom>
                  Risk vs Return
                </Typography>
                <ScatterChartD3
                  data={bubbleData}
                  dimensions={{
                    width:
                      window.innerWidth < 600
                        ? window.innerWidth - 40
                        : focusedDimensions.width * 0.9,
                    height: window.innerWidth < 600 ? 300 : 250, // Increased height for mobile
                  }}
                  id="riskReturn"
                />
              </>
            )}
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {/* Average Return Chart */}
            <Grid item xs={12}>
              <Card
                sx={{
                  p: { xs: 2, sm: 2 },
                  borderRadius: 2,
                  boxShadow: 3,
                  height: { xs: "auto", sm: "auto" },
                  cursor: "pointer",
                  width: "97%",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
                onClick={() => handleHighlight("avgReturn")}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      Average Return
                    </Typography>
                    <Box>
                      <IconButton
                        size={window.innerWidth < 600 ? "medium" : "small"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHighlight("avgReturn");
                        }}
                      >
                        <HighlightIcon />
                      </IconButton>
                      <IconButton
                        size={window.innerWidth < 600 ? "medium" : "small"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadChart("avgReturn");
                        }}
                      >
                        <SaveAltIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <LineChartD3
                    ref={avgReturnRef}
                    data={graphData}
                    labels={labelsSp}
                    dimensions={{
                      width:
                        window.innerWidth < 600
                          ? window.innerWidth - 70
                          : focusedDimensions.width * 0.85,
                      height: window.innerWidth < 600 ? 300 : 300, // Increased height for mobile
                    }}
                    type="return"
                    id="avgReturn"
                  />
                </Box>
              </Card>
            </Grid>

            {/* Risk Analysis Chart */}
            <Grid item xs={12}>
              <Card
                sx={{
                  p: { xs: 2, sm: 2 },
                  borderRadius: 2,
                  boxShadow: 3,
                  height: { xs: "auto", sm: "auto" },
                  cursor: "pointer",
                  width: "97%",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
                onClick={() => handleHighlight("risk")}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      Risk Analysis
                    </Typography>
                    <Box>
                      <IconButton
                        size={window.innerWidth < 600 ? "medium" : "small"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHighlight("risk");
                        }}
                      >
                        <HighlightIcon />
                      </IconButton>
                      <IconButton
                        size={window.innerWidth < 600 ? "medium" : "small"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadChart("risk");
                        }}
                      >
                        <SaveAltIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <LineChartD3
                    ref={riskRef}
                    data={riskData}
                    labels={labelsSp}
                    dimensions={{
                      width:
                        window.innerWidth < 600
                          ? window.innerWidth - 70
                          : focusedDimensions.width * 0.85,
                      height: window.innerWidth < 600 ? 300 : 300, // Increased height for mobile
                    }}
                    type="risk"
                    id="risk"
                  />
                </Box>
              </Card>
            </Grid>

            {/* Sharpe Ratio Chart */}
            <Grid item xs={12}>
              <Card
                sx={{
                  p: { xs: 2, sm: 2 },
                  borderRadius: 2,
                  boxShadow: 3,
                  height: { xs: "auto", sm: "auto" },
                  cursor: "pointer",
                  width: "97%",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
                onClick={() => handleHighlight("sharpe")}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      Sharpe Ratio
                    </Typography>
                    <Box>
                      <IconButton
                        size={window.innerWidth < 600 ? "medium" : "small"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHighlight("sharpe");
                        }}
                      >
                        <HighlightIcon />
                      </IconButton>
                      <IconButton
                        size={window.innerWidth < 600 ? "medium" : "small"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadChart("sharpe");
                        }}
                      >
                        <SaveAltIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <LineChartD3
                    ref={sharpeRef}
                    data={sharpeData}
                    labels={labelsSp}
                    dimensions={{
                      width:
                        window.innerWidth < 600
                          ? window.innerWidth - 70
                          : focusedDimensions.width * 0.85,
                      height: window.innerWidth < 600 ? 300 : 300, // Increased height for mobile
                    }}
                    type="sharpe"
                    id="sharpe"
                  />
                </Box>
              </Card>
            </Grid>

            {/* High-Low Returns Chart */}
            <Grid item xs={12}>
              <Card
                sx={{
                  p: { xs: 2, sm: 2 },
                  borderRadius: 2,
                  boxShadow: 3,
                  height: { xs: "auto", sm: "auto" },
                  cursor: "pointer",
                  width: "97%",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
                onClick={() => handleHighlight("highLow")}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      High-Low Returns
                    </Typography>
                    <Box>
                      <IconButton
                        size={window.innerWidth < 600 ? "medium" : "small"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHighlight("highLow");
                        }}
                      >
                        <HighlightIcon />
                      </IconButton>
                      <IconButton
                        size={window.innerWidth < 600 ? "medium" : "small"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadChart("highLow");
                        }}
                      >
                        <SaveAltIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <BarChartD3
                    ref={highLowRef}
                    data={highLowData}
                    labels={labelsSp}
                    dimensions={{
                      width:
                        window.innerWidth < 600
                          ? window.innerWidth - 70
                          : focusedDimensions.width * 0.85,
                      height: window.innerWidth < 600 ? 300 : 300, // Increased height for mobile
                    }}
                    id="highLow"
                  />
                </Box>
              </Card>
            </Grid>

            {/* Risk vs Return Chart */}
            <Grid item xs={12}>
              <Card
                sx={{
                  p: { xs: 2, sm: 2 },
                  borderRadius: 2,
                  boxShadow: 3,
                  height: { xs: "auto", sm: "auto" },
                  cursor: "pointer",
                  width: "97%",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
                onClick={() => handleHighlight("riskReturn")}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      Risk vs Return
                    </Typography>
                    <Box>
                      <IconButton
                        size={window.innerWidth < 600 ? "medium" : "small"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHighlight("riskReturn");
                        }}
                      >
                        <HighlightIcon />
                      </IconButton>
                      <IconButton
                        size={window.innerWidth < 600 ? "medium" : "small"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadChart("riskReturn");
                        }}
                      >
                        <SaveAltIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <ScatterChartD3
                    ref={riskReturnRef}
                    data={bubbleData}
                    dimensions={{
                      width:
                        window.innerWidth < 600
                          ? window.innerWidth - 70
                          : focusedDimensions.width * 0.85,
                      height: window.innerWidth < 600 ? 300 : 300, // Increased height for mobile
                    }}
                    id="riskReturn"
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
        {highlightedChart && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleExitFocus}
          />
        )}
      </Box>
    </ThemeProvider>
  );
});

export default SearchOutput;
// Helper function to generate chart descriptions
const getChartDescription = (type, data, labels) => {
  switch (type) {
    case "return":
      const oneYearStrategy = data.yourStrategy[0];
      const oneYearNifty = data.nifty50[0];
      return `Avg. Return for various investment periods. E.g. Avg. Return over 1-Year Period for Your Strategy is ${oneYearStrategy.toFixed(
        1
      )}% (vs ${oneYearNifty.toFixed(1)}% for Nifty50).`;

    case "risk":
      const minRisk = Math.min(...data.yourStrategy);
      const maxRisk = Math.max(...data.yourStrategy);
      return `Risk analysis showing downside deviation. Lower values indicate less risk. Your strategy's risk ranges from ${minRisk.toFixed(
        1
      )}% to ${maxRisk.toFixed(1)}%.`;

    case "sharpe":
      const maxSharpe = Math.max(...data.yourStrategy);
      const maxSharpeIndex = data.yourStrategy.indexOf(maxSharpe);
      const period = labels[maxSharpeIndex];
      return `Sharpe ratio indicates risk-adjusted returns. Higher values suggest better risk-adjusted performance. Best ratio of ${maxSharpe} achieved over ${period} period.`;

    case "highLow":
      const maxReturn = Math.max(...data.map((d) => d.highestPCAGR));
      const minReturn = Math.min(...data.map((d) => d.lowestPCAGR));
      return `Shows highest and lowest returns achieved for each investment period. Your strategy's returns ranged from ${minReturn.toFixed(
        1
      )}% to ${maxReturn.toFixed(1)}%.`;

    case "riskReturn":
      const yourStrategyData = data.yourStrategy || []; // Ensure it's an array
      if (!Array.isArray(yourStrategyData) || yourStrategyData.length === 0) {
        return "No data available for your strategy.";
      }

      const returnAvg = Math.max(...yourStrategyData.map((d) => d.x));
      const riskAvg = Math.min(...yourStrategyData.map((d) => d.y));

      return `Avg. Return and Risk for various investment periods. Size of the bubble represents investment period. E.g. Avg. Return of ${returnAvg.toFixed(
        2
      )} and Avg. Risk of ${riskAvg.toFixed(
        2
      )} of Your Strategy over 1-year is denoted by the smallest blue bubble.`;

    default:
      return "";
  }
};

const LineChartD3 = forwardRef(({ data, labels, dimensions, type }, ref) => {
  const chartRef = useRef(null);

  // Forward the ref to the chart container
  useImperativeHandle(ref, () => ({
    getChartElement: () => chartRef.current,
  }));
  const margin = {
    top: 30,
    right: window.innerWidth < 600 ? 20 : 60,
    bottom: window.innerWidth < 600 ? 120 : 50, // Increased bottom margin for legend
    left: window.innerWidth < 600 ? 70 : 80, // Increased left margin for y-axis labels
  };

  useEffect(() => {
    if (!chartRef.current || !data || !labels) return;

    const width = (dimensions?.width || 600) - margin.left - margin.right;
    const height = (dimensions?.height || 300) - margin.top - margin.bottom;

    d3.select(chartRef.current).selectAll("*").remove();

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#ffffff")
      .style("color", "#333")
      .style("padding", "8px 12px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
      .style("border", "2px solid")
      .style("visibility", "hidden");

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxValue = Math.max(
      d3.max(data.yourStrategy || []) || 0,
      d3.max(data.nifty50 || []) || 0
    );

    const x = d3.scaleBand().domain(labels).range([0, width]).padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, maxValue * 1.1])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("class", "grid")
      .style("stroke", "#e0e0e0")
      .style("stroke-opacity", 0.3)
      .selectAll("line")
      .data(y.ticks(5))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr(
        "transform",
        window.innerWidth < 600 ? "rotate(-45) translate(-5,0)" : "rotate(-45)"
      );

    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${d}%`)
      )
      .selectAll("text")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10) // Move label away from axis
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .text(
        type === "return"
          ? "Return (%)"
          : type === "risk"
          ? "Risk (%)"
          : "Ratio"
      );

    svg
      .append("text")
      .attr(
        "transform",
        window.innerWidth < 600
          ? `translate(${width / 2}, ${height + margin.bottom - 60})`
          : `translate(${width / 2}, ${height + margin.bottom - 10})`
      )
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .text("Investment Period");

    const lineGenerator = d3
      .line()
      .x((d, i) => x(labels[i]) + x.bandwidth() / 2)
      .y((d) => y(d));

    // Append lines and store references
    const yourStrategyLine = svg
      .append("path")
      .datum(data.yourStrategy)
      .attr("fill", "none")
      .attr("stroke", "#0174BE")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator)
      .on("mouseover", function () {
        d3.select(this).attr("stroke-width", 3); // Increase thickness on hover
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 2); // Reset thickness on mouse out
      });

    const nifty50Line = svg
      .append("path")
      .datum(data.nifty50)
      .attr("fill", "none")
      .attr("stroke", "#FFC436")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator)
      .on("mouseover", function () {
        d3.select(this).attr("stroke-width", 3); // Increase thickness on hover
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 2); // Reset thickness on mouse out
      });

    const addDots = (dataset, color, className, name, lineRef) => {
      svg
        .selectAll(`.${className}`)
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", className)
        .attr("cx", (d, i) => x(labels[i]) + x.bandwidth() / 2)
        .attr("cy", (d) => y(d))
        .attr("r", 4)
        .attr("fill", color)
        .on("mouseover", (event, d) => {
          tooltip
            .style("visibility", "visible")
            .style("border-color", color)
            .text(`${name} - ${d.toFixed(1)}%`);
          d3.select(lineRef).attr("stroke-width", 3); // Thicken the line

          // Add highlight circle
          svg
            .append("circle")
            .attr("class", "highlight-circle")
            .attr("cx", x(labels[dataset.indexOf(d)]) + x.bandwidth() / 2)
            .attr("cy", y(d))
            .attr("r", 8) // Outer circle radius
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", `${event.pageY - 10}px`)
            .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
          d3.select(lineRef).attr("stroke-width", 2); // Reset line thickness

          // Remove highlight circle
          svg.selectAll(".highlight-circle").remove();
        });
    };

    // Add dots and link them to their respective lines
    addDots(
      data.yourStrategy,
      "#0174BE",
      "dot-your-strategy",
      "Your Strategy",
      yourStrategyLine.node()
    );
    addDots(
      data.nifty50,
      "#FFC436",
      "dot-nifty50",
      "Nifty50",
      nifty50Line.node()
    );

    const legendData = [
      { name: "Your Strategy", color: "#0174BE" },
      { name: "Nifty50", color: "#FFC436" },
    ];

    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", window.innerWidth < 600 ? "12px" : "10px")
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(legendData)
      .enter()
      .append("g")
      .attr("transform", (d, i) => {
        if (window.innerWidth < 600) {
          // Position legend at the bottom with more space
          const legendWidth = 140; // Increased width for each legend item
          const totalWidth = legendWidth * legendData.length;
          const startX = (width - totalWidth) / 2;
          return `translate(${startX + i * legendWidth}, ${
            height + margin.bottom - 25
          })`; // Moved up
        } else {
          return `translate(${width - 40},${i * 25})`; // Increased vertical spacing
        }
      });

    // Make legend items larger and more visible
    legend
      .append("rect")
      .attr("width", window.innerWidth < 600 ? 24 : 19)
      .attr("height", window.innerWidth < 600 ? 24 : 19)
      .attr("fill", (d) => d.color);

    legend
      .append("text")
      .attr("x", window.innerWidth < 600 ? 30 : 24)
      .attr("y", window.innerWidth < 600 ? 16 : 9.5)
      .attr("dy", "0.32em")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .style("font-weight", "500")
      .text((d) => d.name);

    // Update axis text styling
    svg
      .selectAll(".axis text")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .style("font-weight", "500");

    return () => tooltip.remove();
  }, [data, labels, dimensions, type]);

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        paddingBottom: window.innerWidth < 600 ? "40px" : "0", // Increased padding
        minHeight: window.innerWidth < 600 ? "400px" : "380px", // Ensure enough height
      }}
    >
      <div ref={chartRef}></div>
      <Typography
        variant="body2"
        sx={{
          mt: 4, // Increased top margin
          color: "text.secondary",
          fontWeight: "bold",
          padding: "8px",
          backgroundColor: "#f4f6f8",
          borderRadius: "4px",
          textAlign: "center",
          fontSize: window.innerWidth < 600 ? "12px" : "14px",
        }}
      >
        {getChartDescription(type, data, labels)}
      </Typography>
    </div>
  );
});

const BarChartD3 = forwardRef(({ data, labels, dimensions }, ref) => {
  const chartRef = useRef(null);

  // Forward the ref to the chart container
  useImperativeHandle(ref, () => ({
    getChartElement: () => chartRef.current,
  }));

  const margin = {
    top: 30,
    right: window.innerWidth < 600 ? 20 : 60,
    bottom: window.innerWidth < 600 ? 120 : 50, // Increased bottom margin
    left: window.innerWidth < 600 ? 70 : 80, // Increased left margin
  };

  useEffect(() => {
    if (!chartRef.current || !data || !labels) return;

    const width = (dimensions?.width || 600) - margin.left - margin.right;
    const height = (dimensions?.height || 300) - margin.top - margin.bottom;

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Tooltip setup
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#ffffff") // White background
      .style("color", "#333") // Dark text
      .style("padding", "8px 12px") // Padding
      .style("border-radius", "4px") // Rounded corners
      .style("font-size", "12px") // Font size
      .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)") // Shadow
      .style("border", "2px solid") // Border
      .style("visibility", "hidden"); // Initially hidden

    const maxValue = Math.max(
      d3.max(data, (d) => d.highestPCAGR),
      d3.max(data, (d) => d.highestIndex)
    );
    const minValue = Math.min(
      d3.min(data, (d) => d.lowestPCAGR),
      d3.min(data, (d) => d.lowestIndex)
    );

    const x = d3.scaleBand().domain(labels).range([0, width]).padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([minValue * 1.1, maxValue * 1.1])
      .nice()
      .range([height, 0]);

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr(
        "transform",
        window.innerWidth < 600 ? "rotate(-45) translate(-5,0)" : "rotate(-45)"
      );

    // Add y-axis
    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${d}%`)
      )
      .selectAll("text")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px");

    // Add x-axis label
    svg
      .append("text")
      .attr(
        "transform",
        window.innerWidth < 600
          ? `translate(${width / 2}, ${height + margin.bottom - 60})`
          : `translate(${width / 2}, ${height + margin.bottom - 10})`
      )
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .text("Investment Period");

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .text("Return (%)");

    const barGroupWidth = x.bandwidth();
    const barWidth = barGroupWidth * 0.3;
    const offset = barGroupWidth * 0.15;

    const bars = [
      {
        key: "highestPCAGR",
        color: "#0174BE",
        xOffset: -offset,
        label: "Your Strategy - Highest",
      },
      {
        key: "lowestPCAGR",
        color: "#0174BE",
        xOffset: -offset + barWidth * 0.5,
        label: "Your Strategy - Lowest",
      },
      {
        key: "highestIndex",
        color: "#FFC436",
        xOffset: offset,
        label: "Nifty50 - Highest",
      },
      {
        key: "lowestIndex",
        color: "#FFC436",
        xOffset: offset + barWidth * 0.5,
        label: "Nifty50 - Lowest",
      },
    ];

    bars.forEach(({ key, color, xOffset, label }) => {
      svg
        .selectAll(`.bar-${key}`)
        .data(data)
        .enter()
        .append("rect")
        .attr("class", `bar-${key}`)
        .attr("x", (d, i) => x(labels[i]) + xOffset)
        .attr("width", barWidth)
        .attr("y", (d) => y(Math.max(0, d[key])))
        .attr("height", (d) => Math.abs(y(d[key]) - y(0)))
        .attr("fill", color)
        .on("mouseover", function (event, d) {
          // Highlight the bar
          d3.select(this)
            .attr("stroke", color) // Add a stroke
            .attr("stroke-width", 2);

          // Show tooltip
          tooltip
            .style("visibility", "visible")
            .style("border-color", color) // Border color matches the bar color
            .text(`${label}: ${d[key].toFixed(1)}%`);
        })
        .on("mousemove", function (event) {
          // Move tooltip with mouse
          tooltip
            .style("top", `${event.pageY - 10}px`)
            .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", function () {
          // Remove highlight and hide tooltip
          d3.select(this)
            .attr("stroke", "none") // Remove stroke
            .attr("stroke-width", 0);

          tooltip.style("visibility", "hidden");
        });
    });

    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .style("stroke", "#000")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3");

    const legendData = [
      { name: "Your Strategy", color: "#0174BE" },
      { name: "Nifty50", color: "#FFC436" },
    ];

    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", window.innerWidth < 600 ? "12px" : "10px")
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(legendData)
      .enter()
      .append("g")
      .attr("transform", (d, i) => {
        if (window.innerWidth < 600) {
          // Position legend at the bottom with more space
          const legendWidth = 140; // Increased width for each legend item
          const totalWidth = legendWidth * legendData.length;
          const startX = (width - totalWidth) / 2;
          return `translate(${startX + i * legendWidth}, ${
            height + margin.bottom - 25
          })`; // Moved up
        } else {
          return `translate(${width - 40},${i * 25})`; // Increased vertical spacing
        }
      });

    // Make legend items larger and more visible
    legend
      .append("rect")
      .attr("width", window.innerWidth < 600 ? 24 : 19)
      .attr("height", window.innerWidth < 600 ? 24 : 19)
      .attr("fill", (d) => d.color);

    legend
      .append("text")
      .attr("x", window.innerWidth < 600 ? 30 : 24)
      .attr("y", window.innerWidth < 600 ? 16 : 9.5)
      .attr("dy", "0.32em")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .style("font-weight", "500")
      .text((d) => d.name);

    return () => tooltip.remove(); // Cleanup tooltip on component unmount
  }, [data, labels, dimensions]);

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        paddingBottom: window.innerWidth < 600 ? "40px" : "0", // Increased padding
        minHeight: window.innerWidth < 600 ? "400px" : "380px", // Ensure enough height
      }}
    >
      <div ref={chartRef}></div>
      <Typography
        variant="body2"
        sx={{
          mt: 4, // Increased top margin
          color: "text.secondary",
          fontWeight: "bold",
          padding: "8px",
          backgroundColor: "#f4f6f8",
          borderRadius: "4px",
          textAlign: "center",
          fontSize: window.innerWidth < 600 ? "12px" : "14px",
        }}
      >
        {getChartDescription("highLow", data, labels)}
      </Typography>
    </div>
  );
});

const ScatterChartD3 = forwardRef(({ data, dimensions }, ref) => {
  const chartRef = useRef(null);

  // Forward the ref to the chart container
  useImperativeHandle(ref, () => ({
    getChartElement: () => chartRef.current,
  }));

  const margin = {
    top: 30,
    right: window.innerWidth < 600 ? 20 : 60,
    bottom: window.innerWidth < 600 ? 120 : 50, // Increased bottom margin
    left: window.innerWidth < 600 ? 70 : 80, // Increased left margin
  };
  useEffect(() => {
    if (!chartRef.current || !data) return;

    const width = (dimensions?.width || 600) - margin.left - margin.right;
    const height = (dimensions?.height || 300) - margin.top - margin.bottom;

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Tooltip setup
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#ffffff") // White background
      .style("color", "#333") // Dark text
      .style("padding", "8px 12px") // Padding
      .style("border-radius", "4px") // Rounded corners
      .style("font-size", "12px") // Font size
      .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)") // Shadow
      .style("border", "2px solid") // Border
      .style("visibility", "hidden"); // Initially hidden

    const x = d3.scaleLinear().domain([12, 22]).range([0, width]);

    const y = d3.scaleLinear().domain([0, 40]).range([height, 0]);

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(window.innerWidth < 600 ? 5 : 10)
          .tickFormat((d) => `${d}%`)
      );

    // Add y-axis
    svg.append("g").call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d}%`)
    );

    // Add x-axis label
    svg
      .append("text")
      .attr(
        "transform",
        window.innerWidth < 600
          ? `translate(${width / 2}, ${height + margin.bottom - 60})`
          : `translate(${width / 2}, ${height + margin.bottom - 10})`
      )
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .text("Return (%)");

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .text("Risk (%)");

    const addBubbles = (data, color, className) => {
      svg
        .selectAll(`.${className}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", className)
        .attr("cx", (d) => x(d.x))
        .attr("cy", (d) => y(d.y))
        .attr("r", (d) => d.size) // Initial radius
        .attr("fill", color)
        .attr("opacity", 0.7)
        .on("mouseover", function (event, d) {
          // Increase radius and add stroke on hover
          d3.select(this)
            .attr("r", d.size * 1.07) // Increase radius by 50%
            .attr("opacity", 0.9);

          // Show tooltip
          tooltip
            .style("visibility", "visible")
            .style("border-color", color) // Border color matches the bubble color
            .html(
              `Return: ${d.x.toFixed(2)}%<br>Risk: ${d.y.toFixed(
                2
              )}%<br>Period: ${((d.size / 5) ** 2).toFixed(0)} years`
            );
        })
        .on("mousemove", function (event) {
          // Move tooltip with mouse
          tooltip
            .style("top", `${event.pageY - 10}px`)
            .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", function () {
          // Reset radius and remove stroke
          d3.select(this)
            .attr("r", (d) => d.size) // Reset radius
            .attr("opacity", 0.7);

          // Hide tooltip
          tooltip.style("visibility", "hidden");
        });
    };

    addBubbles(data.nifty50, "#FFC436", "bubble-nifty");
    addBubbles(data.yourStrategy, "#0174BE", "bubble-strategy");

    const legendData = [
      { name: "Your Strategy", color: "#0174BE" },
      { name: "Nifty50", color: "#FFC436" },
    ];

    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", window.innerWidth < 600 ? "12px" : "10px")
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(legendData)
      .enter()
      .append("g")
      .attr("transform", (d, i) => {
        if (window.innerWidth < 600) {
          // Position legend at the bottom with more space
          const legendWidth = 140; // Increased width for each legend item
          const totalWidth = legendWidth * legendData.length;
          const startX = (width - totalWidth) / 2;
          return `translate(${startX + i * legendWidth}, ${
            height + margin.bottom - 25
          })`; // Moved up
        } else {
          return `translate(${width - 40},${i * 25})`; // Increased vertical spacing
        }
      });

    // Make legend items larger and more visible
    legend
      .append("rect")
      .attr("width", window.innerWidth < 600 ? 24 : 19)
      .attr("height", window.innerWidth < 600 ? 24 : 19)
      .attr("fill", (d) => d.color);

    legend
      .append("text")
      .attr("x", window.innerWidth < 600 ? 30 : 24)
      .attr("y", window.innerWidth < 600 ? 16 : 9.5)
      .attr("dy", "0.32em")
      .style("font-size", window.innerWidth < 600 ? "12px" : "12px")
      .style("font-weight", "500")
      .text((d) => d.name);

    return () => tooltip.remove();
  }, [data, dimensions]);

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        paddingBottom: window.innerWidth < 600 ? "40px" : "0", // Increased padding
        minHeight: window.innerWidth < 600 ? "400px" : "380px", // Ensure enough height
      }}
    >
      <div ref={chartRef}></div>
      <Typography
        variant="body2"
        sx={{
          mt: 4, // Increased top margin
          color: "text.secondary",
          fontWeight: "bold",
          padding: "8px",
          backgroundColor: "#f4f6f8",
          borderRadius: "4px",
          textAlign: "center",
          fontSize: window.innerWidth < 600 ? "12px" : "14px",
        }}
      >
        {getChartDescription("riskReturn", data, "")}
      </Typography>
    </div>
  );
});
