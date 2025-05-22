import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Divider, 
  Snackbar, 
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';

interface AgencySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  agencyId: string;
}

const AgencySettingsComponent: React.FC = () => {
  const { currentUser, userRole } = useAuth();
  
  const [settings, setSettings] = useState<AgencySettings>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logoUrl: '',
    agencyId: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Check if user is admin
  const isAdmin = userRole === 'admin';
  
  // Fetch agency settings
  useEffect(() => {
    const fetchAgencySettings = async () => {
      try {
        // In a real app, you would fetch the agency ID from the user's profile
        // For now, we'll use a default agency ID
        const agencyId = 'default_agency';
        
        const agencyDoc = await getDoc(doc(db, 'agency_settings', agencyId));
        
        if (agencyDoc.exists()) {
          const agencyData = agencyDoc.data() as AgencySettings;
          setSettings(agencyData);
          setPreviewUrl(agencyData.logoUrl);
        } else {
          // Create default settings if none exist
          const defaultSettings: AgencySettings = {
            name: 'Foster Links Agency',
            address: '123 Main St, Anytown, USA',
            phone: '(555) 123-4567',
            email: 'info@fosterlinks.example',
            website: 'www.fosterlinks.example',
            logoUrl: '',
            agencyId
          };
          
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching agency settings:', error);
        showSnackbar('Failed to load agency settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgencySettings();
  }, []);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar('Logo file size must be less than 2MB', 'error');
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        showSnackbar('Please select an image file', 'error');
        return;
      }
      
      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Upload logo to Firebase Storage
  const uploadLogo = async (): Promise<string> => {
    if (!logoFile || !settings.agencyId) {
      return settings.logoUrl;
    }
    
    setUploadingLogo(true);
    
    try {
      // Create a reference to the logo file in Firebase Storage
      const logoRef = ref(storage, `agency_logos/${settings.agencyId}`);
      
      // If there's an existing logo, delete it first
      if (settings.logoUrl) {
        try {
          const oldLogoRef = ref(storage, settings.logoUrl);
          await deleteObject(oldLogoRef);
        } catch (error) {
          console.error('Error deleting old logo:', error);
          // Continue with upload even if delete fails
        }
      }
      
      // Upload the new logo
      await uploadBytes(logoRef, logoFile);
      
      // Get the download URL
      const downloadUrl = await getDownloadURL(logoRef);
      
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      showSnackbar('Failed to upload logo', 'error');
      throw error;
    } finally {
      setUploadingLogo(false);
    }
  };
  
  // Save agency settings
  const handleSave = async () => {
    if (!isAdmin) {
      showSnackbar('Only administrators can update agency settings', 'error');
      return;
    }
    
    setSaving(true);
    
    try {
      let updatedSettings = { ...settings };
      
      // Upload logo if a new one was selected
      if (logoFile) {
        const logoUrl = await uploadLogo();
        updatedSettings.logoUrl = logoUrl;
      }
      
      // Save settings to Firestore
      await setDoc(doc(db, 'agency_settings', settings.agencyId), updatedSettings);
      
      setSettings(updatedSettings);
      setLogoFile(null);
      
      showSnackbar('Agency settings saved successfully', 'success');
    } catch (error) {
      console.error('Error saving agency settings:', error);
      showSnackbar('Failed to save agency settings', 'error');
    } finally {
      setSaving(false);
    }
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
    return <Typography>Loading agency settings...</Typography>;
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Agency Settings</Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Manage your agency information and branding.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3}>
          {/* Agency Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Agency Information</Typography>
            
            <TextField
              fullWidth
              margin="normal"
              label="Agency Name"
              name="name"
              value={settings.name}
              onChange={handleInputChange}
              disabled={!isAdmin || saving}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              value={settings.address}
              onChange={handleInputChange}
              disabled={!isAdmin || saving}
              multiline
              rows={2}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              name="phone"
              value={settings.phone}
              onChange={handleInputChange}
              disabled={!isAdmin || saving}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={settings.email}
              onChange={handleInputChange}
              disabled={!isAdmin || saving}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Website"
              name="website"
              value={settings.website}
              onChange={handleInputChange}
              disabled={!isAdmin || saving}
            />
          </Grid>
          
          {/* Agency Logo */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Agency Logo</Typography>
            
            <Box 
              sx={{ 
                border: '1px dashed #ccc', 
                borderRadius: 1, 
                p: 2, 
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200
              }}
            >
              {previewUrl ? (
                <Box 
                  component="img"
                  src={previewUrl}
                  alt="Agency Logo"
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: 150,
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <Typography color="textSecondary">
                  No logo uploaded
                </Typography>
              )}
            </Box>
            
            {isAdmin && (
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="logo-upload"
                  type="file"
                  onChange={handleLogoChange}
                  disabled={saving || uploadingLogo}
                />
                <label htmlFor="logo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={saving || uploadingLogo}
                    fullWidth
                  >
                    {uploadingLogo ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Uploading...
                      </>
                    ) : (
                      'Upload New Logo'
                    )}
                  </Button>
                </label>
                
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Recommended size: 400x100 pixels. Max file size: 2MB.
                </Typography>
              </Box>
            )}
            
            <Typography variant="body2" paragraph>
              Your agency logo will appear in the application header, reports, and other branded materials.
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          {isAdmin && (
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={saving || uploadingLogo}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          )}
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

export default AgencySettingsComponent;