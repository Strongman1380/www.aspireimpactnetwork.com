import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, TextField, Button, CircularProgress } from '@mui/material';
import { useAppTheme } from '../contexts/ThemeContext';

const SimpleThemeSettings: React.FC = () => {
  const { themeSettings, updateThemeSettings } = useAppTheme();
  const [localSettings, setLocalSettings] = useState(themeSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Sync local settings with context when theme settings change
  useEffect(() => {
    setLocalSettings(themeSettings);
  }, [themeSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateThemeSettings(localSettings);
    } catch (error) {
      console.error('Error saving theme settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Theme Settings
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Primary Color"
          type="color"
          value={localSettings.primaryColor}
          onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Secondary Color"
          type="color"
          value={localSettings.secondaryColor}
          onChange={(e) => setLocalSettings({ ...localSettings, secondaryColor: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSaving ? 'Saving...' : 'Save Theme'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default SimpleThemeSettings;