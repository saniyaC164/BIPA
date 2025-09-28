import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
//import './styles/globals.css';

// Pages
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import MBA from './pages/MBA';
import Sentiment from './pages/Sentiment';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2bb673',
      light: '#5dd88f',
      dark: '#1b8a51',
    },
    secondary: {
      main: '#6fb5ff',
      light: '#aed9ff',
      dark: '#3b82f6',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#d32f2f',
    },
    info: {
      main: '#42a5f5',
      light: '#90caf9',
      dark: '#1976d2',
    },
    background: {
      default: '#f7faf7',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.6)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/home" element={<Homepage />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/mba" element={<MBA />} />
          <Route path="/sentiment" element={<Sentiment />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;