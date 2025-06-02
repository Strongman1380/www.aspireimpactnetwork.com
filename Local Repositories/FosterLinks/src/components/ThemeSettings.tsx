import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Button, 
  useTheme as useMuiTheme,
  useMediaQuery,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useAppTheme, ThemeSettings as ThemeSettingsType } from '../contexts/ThemeContext';
import { useUI } from '../contexts/UIContext';

const ThemeSettingsComponent: React.FC = () => {
  const { currentUser } = useAuth();
  const { themeSettings, updateThemeSettings } = useAppTheme();
  const { showSnackbar, showLoading, hideLoading } = useUI();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const [localThemeSettings, setLocalThemeSettings] = useState<ThemeSettingsType>(themeSettings);
  const [saving, setSaving] = useState(false);
  
  // Color options
  const primaryColorOptions = [
    { name: 'Blue', value: '#1976d2' },
    { name: 'Purple', value: '#9c27b0' },
    { name: 'Green', value: '#2e7d32' },
    { name: 'Orange', value: '#ed6c02' },
    { name: 'Red', value: '#d32f2f' }
  ];
  
  const secondaryColorOptions = [
    { name: 'Pink', value: '#dc004e' },
    { name: 'Teal', value: '#00796b' },
    { name: 'Amber', value: '#ff8f00' },
    { name: 'Indigo', value: '#3949ab' },
    { name: 'Lime', value: '#9e9d24' }
  ];
  
  // Handle theme mode change
  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalThemeSettings({
      ...localThemeSettings,
      mode: event.target.value as 'light' | 'dark' | 'system'
    });
  };
  
  // Handle primary color change
  const handlePrimaryColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalThemeSettings({
      ...localThemeSettings,
      primaryColor: event.target.value
    });
  };
  
  // Handle secondary color change
  const handleSecondaryColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalThemeSettings({
      ...localThemeSettings,
      secondaryColor: event.target.value
    });
  };
  
  // Save theme settings
  const handleSave = async () => {
    if (!currentUser) return;
    
    setSaving(true);
    showLoading('Saving theme settings...');
    
    try {
      await updateThemeSettings(localThemeSettings);
      showSnackbar('Theme settings saved successfully', 'success');
    } catch (error) {
      console.error('Error saving theme settings:', error);
      showSnackbar('Failed to save theme settings', 'error');
    } finally {
      setSaving(false);
      hideLoading();
    }
  };
  
  // Reset to defaults
  const handleReset = () => {
    const defaultSettings: ThemeSettingsType = {
      mode: 'light',
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e'
    };
    
    setLocalThemeSettings(defaultSettings);
  };
  
  // Determine if settings have changed
  const hasChanges = () => {
    return (
      localThemeSettings.mode !== themeSettings.mode ||
      localThemeSettings.primaryColor !== themeSettings.primaryColor ||
      localThemeSettings.secondaryColor !== themeSettings.secondaryColor
    );
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Theme Settings</Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Customize the appearance of your Foster Links application.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={4}>
          {/* Theme Mode */}
          <Grid item xs={12} md={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Theme Mode</FormLabel>
              <RadioGroup
                name="theme-mode"
                value={localThemeSettings.mode}
                onChange={handleModeChange}
              >
                <FormControlLabel value="light" control={<Radio />} label="Light" />
                <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                <FormControlLabel value="system" control={<Radio />} label="Use System Preference" />
              </RadioGroup>
            </FormControl>
          </Grid>
          
          {/* Primary Color */}
          <Grid item xs={12} md={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Primary Color</FormLabel>
              <RadioGroup
                name="primary-color"
                value={localThemeSettings.primaryColor}
                onChange={handlePrimaryColorChange}
              >
                {primaryColorOptions.map((color) => (
                  <FormControlLabel
                    key={color.value}
                    value={color.value}
                    control={
                      <Radio 
                        sx={{
                          color: color.value,
                          '&.Mui-checked': {
                            color: color.value,
                          }
                        }}
                      />
                    }
                    label={color.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          
          {/* Secondary Color */}
          <Grid item xs={12} md={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Secondary Color</FormLabel>
              <RadioGroup
                name="secondary-color"
                value={localThemeSettings.secondaryColor}
                onChange={handleSecondaryColorChange}
              >
                {secondaryColorOptions.map((color) => (
                  <FormControlLabel
                    key={color.value}
                    value={color.value}
                    control={
                      <Radio 
                        sx={{
                          color: color.value,
                          '&.Mui-checked': {
                            color: color.value,
                          }
                        }}
                      />
                    }
                    label={color.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        
        {/* Preview */}
        <Box sx={{ mt: 4, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Preview</Typography>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              backgroundColor: localThemeSettings.mode === 'dark' ? '#121212' : '#ffffff',
              color: localThemeSettings.mode === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: localThemeSettings.primaryColor,
                  '&:hover': {
                    backgroundColor: localThemeSettings.primaryColor,
                    opacity: 0.9
                  }
                }}
              >
                Primary Button
              </Button>
              
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: localThemeSettings.secondaryColor,
                  '&:hover': {
                    backgroundColor: localThemeSettings.secondaryColor,
                    opacity: 0.9
                  }
                }}
              >
                Secondary Button
              </Button>
              
              <Button 
                variant="outlined" 
                sx={{ 
                  color: localThemeSettings.primaryColor, 
                  borderColor: localThemeSettings.primaryColor 
                }}
              >
                Outlined Button
              </Button>
            </Box>
          </Paper>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleReset}
            disabled={saving}
          >
            Reset to Defaults
          </Button>
          
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={saving || !hasChanges()}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ThemeSettingsComponent;