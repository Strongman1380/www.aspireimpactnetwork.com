import React, { useState, useRef, useEffect } from 'react';
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
  Grid,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Alert,
  LinearProgress
} from '@mui/material';
import { 
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useAppTheme, ThemeSettings as ThemeSettingsType } from '../contexts/ThemeContext';
import { useUI } from '../contexts/UIContext';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/firebase';
import NavigationBar from './NavigationBar';
import ThemePreview from './ThemePreview';

const ThemeSettingsComponent: React.FC = () => {
  const { currentUser } = useAuth();
  const { themeSettings, updateThemeSettings } = useAppTheme();
  const { showSnackbar, showLoading, hideLoading } = useUI();
  
  const [localThemeSettings, setLocalThemeSettings] = useState<ThemeSettingsType>(themeSettings);

  // Sync local settings with context when theme settings change
  useEffect(() => {
    setLocalThemeSettings(themeSettings);
  }, [themeSettings]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Handle logo file selection
  const handleLogoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleLogoUpload(file);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (file: File) => {
    if (!currentUser) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showSnackbar('Please select a valid image file (JPEG, PNG, GIF, or WebP)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showSnackbar('File size must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Delete existing logo if it exists
      if (localThemeSettings.logoUrl) {
        try {
          const oldLogoRef = ref(storage, `logos/${currentUser.uid}/logo`);
          await deleteObject(oldLogoRef);
        } catch (error) {
          console.log('No existing logo to delete or error deleting:', error);
        }
      }

      // Create a reference to the logo file
      const logoRef = ref(storage, `logos/${currentUser.uid}/logo`);
      
      // Upload the file
      const snapshot = await uploadBytes(logoRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update local settings
      setLocalThemeSettings({
        ...localThemeSettings,
        logoUrl: downloadURL,
        logoName: file.name
      });

      setUploadProgress(100);
      showSnackbar('Logo uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading logo:', error);
      showSnackbar('Failed to upload logo', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle logo removal
  const handleLogoRemove = async () => {
    if (!currentUser || !localThemeSettings.logoUrl) return;

    setUploading(true);

    try {
      // Delete the logo from storage
      const logoRef = ref(storage, `logos/${currentUser.uid}/logo`);
      await deleteObject(logoRef);

      // Update local settings
      setLocalThemeSettings({
        ...localThemeSettings,
        logoUrl: undefined,
        logoName: undefined
      });

      showSnackbar('Logo removed successfully', 'success');
    } catch (error) {
      console.error('Error removing logo:', error);
      showSnackbar('Failed to remove logo', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
      secondaryColor: '#dc004e',
      logoUrl: undefined,
      logoName: undefined
    };
    
    setLocalThemeSettings(defaultSettings);
  };
  
  // Determine if settings have changed
  const hasChanges = () => {
    return (
      localThemeSettings.mode !== themeSettings.mode ||
      localThemeSettings.primaryColor !== themeSettings.primaryColor ||
      localThemeSettings.secondaryColor !== themeSettings.secondaryColor ||
      localThemeSettings.logoUrl !== themeSettings.logoUrl ||
      localThemeSettings.logoName !== themeSettings.logoName
    );
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavigationBar />
      <Box sx={{ p: 3, flexGrow: 1 }}>
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
        
        <Divider sx={{ my: 3 }} />
        
        {/* Logo Upload Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Agency Logo</Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Upload your agency logo to personalize the application. Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  {localThemeSettings.logoUrl ? (
                    <Box>
                      <Avatar
                        src={localThemeSettings.logoUrl}
                        sx={{ 
                          width: 120, 
                          height: 120, 
                          mx: 'auto', 
                          mb: 2,
                          border: '2px solid',
                          borderColor: 'divider'
                        }}
                        variant="rounded"
                      >
                        <ImageIcon sx={{ fontSize: 60 }} />
                      </Avatar>
                      <Typography variant="body2" color="textSecondary">
                        {localThemeSettings.logoName}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Avatar
                        sx={{ 
                          width: 120, 
                          height: 120, 
                          mx: 'auto', 
                          mb: 2,
                          bgcolor: 'grey.100',
                          border: '2px dashed',
                          borderColor: 'grey.300'
                        }}
                        variant="rounded"
                      >
                        <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                      </Avatar>
                      <Typography variant="body2" color="textSecondary">
                        No logo uploaded
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={triggerFileInput}
                    disabled={uploading}
                    sx={{ mr: 1 }}
                  >
                    {localThemeSettings.logoUrl ? 'Replace Logo' : 'Upload Logo'}
                  </Button>
                  
                  {localThemeSettings.logoUrl && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleLogoRemove}
                      disabled={uploading}
                    >
                      Remove
                    </Button>
                  )}
                </CardActions>
                
                {uploading && (
                  <Box sx={{ px: 2, pb: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={uploadProgress} 
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="caption" color="textSecondary" align="center" display="block" sx={{ mt: 0.5 }}>
                      Uploading... {uploadProgress}%
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Logo Guidelines:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                  • Use a square or rectangular logo for best results<br/>
                  • Recommended size: 200x200 pixels or larger<br/>
                  • Transparent background (PNG) works best<br/>
                  • Logo will be displayed in the navigation bar
                </Typography>
              </Alert>
            </Grid>
          </Grid>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoFileSelect}
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            style={{ display: 'none' }}
          />
        </Box>
        
        {/* Preview */}
        <Box sx={{ mt: 4, mb: 3 }}>
          <ThemePreview themeSettings={localThemeSettings} />
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
    </Box>
  );
};

export default ThemeSettingsComponent;