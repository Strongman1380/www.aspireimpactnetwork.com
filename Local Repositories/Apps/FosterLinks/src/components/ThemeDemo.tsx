import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Grid,
  Paper,
  IconButton,
  Fab,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  Alert
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAppTheme } from '../contexts/ThemeContext';

const ThemeDemo: React.FC = () => {
  const { themeSettings } = useAppTheme();
  const [progress, setProgress] = useState(75);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [sliderValue, setSliderValue] = useState(30);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Theme System Demo
      </Typography>
      
      <Grid container spacing={3}>
        {/* Cards Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: themeSettings.primaryColor, mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Sarah Johnson</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Foster Youth Profile
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Case Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: themeSettings.primaryColor,
                      borderRadius: 4,
                    }
                  }}
                />
                <Typography variant="caption" color="textSecondary">
                  {progress}% Complete
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label="Active" 
                  size="small" 
                  sx={{ 
                    bgcolor: themeSettings.primaryColor,
                    color: 'white'
                  }}
                />
                <Chip 
                  label="Priority" 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    borderColor: themeSettings.secondaryColor,
                    color: themeSettings.secondaryColor
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    size="small"
                    sx={{ color: themeSettings.primaryColor }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton 
                    size="small"
                    sx={{ color: themeSettings.secondaryColor }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>
                <Button 
                  variant="contained"
                  size="small"
                  sx={{ 
                    bgcolor: themeSettings.primaryColor,
                    '&:hover': {
                      bgcolor: themeSettings.primaryColor,
                      filter: 'brightness(0.9)'
                    }
                  }}
                >
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Interactive Controls */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Interactive Components
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={switchChecked}
                    onChange={(e) => setSwitchChecked(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: themeSettings.primaryColor,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: themeSettings.primaryColor,
                      },
                    }}
                  />
                }
                label="Enable Notifications"
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Priority Level</Typography>
              <Slider
                value={sliderValue}
                onChange={(_, value) => setSliderValue(value as number)}
                sx={{
                  color: themeSettings.secondaryColor,
                  '& .MuiSlider-thumb': {
                    backgroundColor: themeSettings.secondaryColor,
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: themeSettings.secondaryColor,
                  },
                }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Case Notes"
              variant="outlined"
              multiline
              rows={3}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: themeSettings.primaryColor,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: themeSettings.primaryColor,
                },
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: themeSettings.primaryColor,
                  '&:hover': {
                    bgcolor: themeSettings.primaryColor,
                    filter: 'brightness(0.9)'
                  }
                }}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: themeSettings.secondaryColor,
                  color: themeSettings.secondaryColor,
                  '&:hover': {
                    borderColor: themeSettings.secondaryColor,
                    backgroundColor: `${themeSettings.secondaryColor}10`
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              { title: 'Active Cases', value: '24', icon: PersonIcon, color: themeSettings.primaryColor },
              { title: 'Completed', value: '156', icon: StarIcon, color: themeSettings.secondaryColor },
              { title: 'Pending', value: '8', icon: NotificationsIcon, color: themeSettings.primaryColor },
            ].map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card 
                  elevation={2}
                  sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {stat.title}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: `${stat.color}20` }}>
                        <stat.icon sx={{ color: stat.color }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Alert Examples */}
        <Grid item xs={12}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2,
              '& .MuiAlert-icon': {
                color: themeSettings.primaryColor
              }
            }}
          >
            This demo showcases how your theme colors are applied throughout the application.
          </Alert>
          
          <Alert 
            severity="success"
            sx={{
              '& .MuiAlert-icon': {
                color: themeSettings.secondaryColor
              }
            }}
          >
            All components automatically adapt to your chosen brand colors!
          </Alert>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: themeSettings.primaryColor,
          '&:hover': {
            bgcolor: themeSettings.primaryColor,
            filter: 'brightness(0.9)'
          }
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ThemeDemo;