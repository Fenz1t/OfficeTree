import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FONT_OPTIONS } from '../styles/theme';
import { Box, Typography, Switch, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Settings = () => {
  const { themeMode, toggleTheme, fontFamily, handleFontChange } = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Настройки</Typography>
      
      <FormControlLabel
        control={<Switch checked={themeMode === 'dark'} onChange={toggleTheme} />}
        label="Темная тема"
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth>
        <InputLabel>Шрифт</InputLabel>
        <Select
          value={fontFamily}
          label="Шрифт"
          onChange={(e) => handleFontChange(e.target.value)}
          sx={{ fontFamily: fontFamily }}
        >
          {FONT_OPTIONS.map((font) => (
            <MenuItem 
              key={font} 
              value={font}
              style={{ fontFamily: font }}
            >
              {font}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Settings;