import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDesignTokens, DEFAULT_FONT } from '../styles/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');
  const [fontFamily, setFontFamily] = useState(DEFAULT_FONT);
  const [agGridTheme, setAgGridTheme] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFont = localStorage.getItem('font') || DEFAULT_FONT;
    
    setThemeMode(savedTheme);
    setFontFamily(savedFont);
    updateAgGridTheme(savedTheme, savedFont);
  }, []);

  const updateAgGridTheme = (mode, font) => {
    const { agGridTheme } = getDesignTokens(mode, font);
    setAgGridTheme(agGridTheme);
    document.body.setAttribute('data-ag-theme-mode', mode);
  };

  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('theme', newTheme);
    updateAgGridTheme(newTheme, fontFamily);
  };

  const handleFontChange = (font) => {
    setFontFamily(font);
    localStorage.setItem('font', font);
    updateAgGridTheme(themeMode, font);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        themeMode, 
        toggleTheme, 
        fontFamily, 
        handleFontChange,
        agGridTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);