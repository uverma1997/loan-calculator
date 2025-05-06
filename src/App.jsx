import React, { useState } from "react";
import ExchangeRates from "./ExchangeRates";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Switch,
  Box,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./Header";
import Home from "./Home";
import About from "./About";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({ palette: { mode: darkMode ? "dark" : "light" } });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />
        {/* <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rates" element={<ExchangeRates />} />
          <Route
            path="*"
            element={
              <Box p={3}>
                <Typography variant="h3" color="error">
                  404 - Page Not Found
                </Typography>
                <Typography variant="body1">
                  The page you are looking for doesn’t exist.
                </Typography>
              </Box>
            }
          />
        </Routes> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rates" element={<ExchangeRates />} />
          <Route path="/about" element={<About />} /> {/* New route */}
          <Route
            path="*"
            element={
              <Box p={3}>
                <Typography variant="h3" color="error">
                  404 - Page Not Found
                </Typography>
                <Typography variant="body1">
                  The page you are looking for doesn’t exist.
                </Typography>
              </Box>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
