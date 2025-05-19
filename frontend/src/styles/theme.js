import { createTheme } from '@mui/material/styles';
import { themeQuartz } from 'ag-grid-community'

export const getDesignTokens = (mode, fontFamily) => ({
  muiTheme: createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: fontFamily,
      fontSize: 14,
      h4: {
        fontSize: '1.5rem',
      },
    },
  }),
  
  agGridTheme: themeQuartz.withParams(
    {
      fontFamily: fontFamily,
      fontSize: 3,
      borderRadius: 8,
      rowHeight: 50,
      headerHeight: 48,
      
      ...(mode === 'light' && {
        backgroundColor: '#ffffff',
        foregroundColor: '#212121',
        borderColor: '#e0e0e0',
        accentColor: '#1976d2',
      }),
      
      ...(mode === 'dark' && {
        backgroundColor: '#1e1e1e',
        foregroundColor: '#ffffff',
        borderColor: '#424242',
        accentColor: '#90caf9',
      }),
    },
    mode
  ),
});

export const FONT_OPTIONS = ['Arial', 'Roboto', 'Open Sans', 'Times New Roman'];
export const DEFAULT_FONT = 'Roboto';