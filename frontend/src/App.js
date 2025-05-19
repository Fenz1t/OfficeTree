import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import AppDrawer from './components/AppDrawer';
import AppRouter from './components/AppRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { getDesignTokens } from './styles/theme';
import './styles/app.css';

const ThemedApp = () => {
  const { themeMode, fontFamily} = useTheme();
  const { muiTheme } = getDesignTokens(themeMode, fontFamily);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppDrawer />
      <div style={{ marginLeft: 240, padding: '20px' }}>
        <AppRouter />
      </div>
    </MuiThemeProvider>
  );
};

const App = () => (
  <Router>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </Router>
);

export default App;