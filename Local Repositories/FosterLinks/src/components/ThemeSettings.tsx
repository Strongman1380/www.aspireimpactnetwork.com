import React, { useState, useEffect } from 'react';
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
  Snackbar, 
  Alert,
  useTheme,
  useMediaQuery,
  Grid,
  Divider
} from '@mui/material';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';

interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
}

const ThemeSettingsComponent: React.FC = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    mode: 'light',
    primaryColor: '#1976d2', // Default MUI blue
    secondaryColor: '#dc004e' // Default MUI pink
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
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
  
  // Fetch user theme settings
  useEffect(() => {
    const fetchThemeSettings = async () => {
      if (!currentUser) return;
      
      try {
        const themeDoc = await getDoc(doc(db, 'themes', currentUser.uid));
        
        if (themeDoc.exists()) {
          setThemeSettings(themeDoc.data() as ThemeSettings);
        }
      } catch (error) {
        console.error('Error fetching theme settings:', error);
        showSnackbar('Failed to load theme settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchThemeSettings();
  }, [currentUser]);
  
  // Handle theme mode change
  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThemeSettings({
      ...themeSettings,
      mode: event.target.value as 'light' | 'dark' | 'system'
    });
  };
  
  // Handle primary color change
  const handlePrimaryColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThemeSettings({
      ...themeSettings,
      primaryColor: event.target.value
    });
  };
  
  // Handle secondary color change
  const handleSecondaryColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThemeSettings({
      ...themeSettings,
      secondaryColor: event.target.value
    });
  };
  
  // Save theme settings
  const handleSave = async () => {
    if (!currentUser) return;
    
    setSaving(true);
    
    try {
      await setDoc(doc(db, 'themes', currentUser.uid), themeSettings);
      showSnackbar('Theme settings saved successfully', 'success');
      
      // In a real app, you would update the theme context here
      // to apply the changes immediately
    } catch (error) {
      console.error('Error saving theme settings:', error);
      showSnackbar('Failed to save theme settings', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  // Reset to defaults
  const handleReset = () => {
    setThemeSettings({
      mode: 'light',
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e'
    });
  };
  
  // Show snackbar message
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  if (loading) {
    return <Typography>Loading theme settings...</Typography>;
  }
  
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
                value={themeSettings.mode}
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
                value={themeSettings.primaryColor}
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
                value={themeSettings.secondaryColor}
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
              backgroundColor: themeSettings.mode === 'dark' ? '#121212' : '#ffffff',
              color: themeSettings.mode === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: themeSettings.primaryColor,
                  '&:hover': {
                    backgroundColor: themeSettings.primaryColor,
                    opacity: 0.9
                  }
                }}
              >
                Primary Button
              </Button>
              
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: themeSettings.secondaryColor,
                  '&:hover': {
                    backgroundColor: themeSettings.secondaryColor,
                    opacity: 0.9
                  }
                }}
              >
                Secondary Button
              </Button>
              
              <Button variant="outlined" sx={{ color: themeSettings.primaryColor, borderColor: themeSettings.primaryColor }}>
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
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Paper>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ThemeSettingsComponent;