import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { ThemeSettings } from '../contexts/ThemeContext';

interface ThemePreviewProps {
  themeSettings: ThemeSettings;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ themeSettings }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        background: themeSettings.mode === 'dark' 
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        transition: 'all 0.3s ease-in-out',
        transform: 'scale(0.9)',
        transformOrigin: 'top left'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Theme Preview
      </Typography>
      
      {/* Mock Navigation Bar */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: themeSettings.primaryColor,
          color: 'white',
          borderRadius: 1,
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {themeSettings.logoUrl ? (
            <Avatar 
              src={themeSettings.logoUrl} 
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
              FL
            </Avatar>
          )}
          <Typography variant="h6">FosterLinks</Typography>
        </Box>
        <NotificationsIcon />
      </Box>

      {/* Mock Dashboard Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
        <Card 
          sx={{ 
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: themeSettings.primaryColor }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">24</Typography>
                <Typography variant="body2" color="textSecondary">
                  Active Youth
                </Typography>
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={75} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: themeSettings.primaryColor
                }
              }}
            />
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: themeSettings.secondaryColor }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">89%</Typography>
                <Typography variant="body2" color="textSecondary">
                  Compliance Rate
                </Typography>
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={89} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: themeSettings.secondaryColor
                }
              }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Mock Youth Profile Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: themeSettings.primaryColor }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">Sarah Johnson</Typography>
              <Typography variant="body2" color="textSecondary">
                Case #: YTH-2024-001
              </Typography>
            </Box>
            <Chip 
              label="Active" 
              size="small" 
              sx={{ 
                bgcolor: themeSettings.primaryColor,
                color: 'white'
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
              View Profile
            </Button>
            <Button 
              variant="outlined" 
              size="small"
              sx={{ 
                borderColor: themeSettings.secondaryColor,
                color: themeSettings.secondaryColor,
                '&:hover': {
                  borderColor: themeSettings.secondaryColor,
                  bgcolor: `${themeSettings.secondaryColor}10`
                }
              }}
            >
              Add Note
            </Button>
          </Box>
          
          <Typography variant="body2" color="textSecondary">
            Last updated: 2 hours ago
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>
        This preview shows how your theme will appear throughout the application
      </Typography>
    </Paper>
  );
};

export default ThemePreview;