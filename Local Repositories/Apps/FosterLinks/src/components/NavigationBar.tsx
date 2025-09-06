import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ChildCare as ChildCareIcon,
  Assessment as AssessmentIcon,
  Home as HomeIcon,
  MedicalServices as MedicalIcon,
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
  FamilyRestroom as FamilyIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppTheme } from '../contexts/ThemeContext';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const NavigationBar: React.FC = () => {
  const { currentUser, userRole, signOut } = useAuth();
  const { themeSettings } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Define navigation items based on user roles
  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <DashboardIcon />,
      roles: ['admin', 'worker', 'foster_parent']
    },
    {
      label: 'User Management',
      path: '/user-management',
      icon: <PeopleIcon />,
      roles: ['admin']
    },
    {
      label: 'Youth Profiles',
      path: '/youth-profiles',
      icon: <ChildCareIcon />,
      roles: ['admin', 'worker']
    },
    {
      label: 'Foster Parents',
      path: '/foster-parents',
      icon: <HomeIcon />,
      roles: ['admin', 'worker']
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <AssessmentIcon />,
      roles: ['admin', 'worker']
    },
    {
      label: 'My Youth',
      path: '/my-youth',
      icon: <ChildCareIcon />,
      roles: ['foster_parent']
    },
    {
      label: 'Medication Logs',
      path: '/medication-logs',
      icon: <MedicalIcon />,
      roles: ['foster_parent']
    }
  ];

  // Filter navigation items based on user role
  const accessibleItems = navigationItems.filter(item =>
    item.roles.includes(userRole || '')
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      handleMenuClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <AdminIcon fontSize="small" />;
      case 'worker':
        return <WorkIcon fontSize="small" />;
      case 'foster_parent':
        return <FamilyIcon fontSize="small" />;
      default:
        return <AccountIcon fontSize="small" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'worker':
        return 'primary';
      case 'foster_parent':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'worker':
        return 'Social Worker';
      case 'foster_parent':
        return 'Foster Parent';
      default:
        return 'User';
    }
  };

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {themeSettings.logoUrl && (
            <Avatar
              src={themeSettings.logoUrl}
              sx={{ 
                width: 28, 
                height: 28, 
                mr: 1.5,
                bgcolor: 'grey.100'
              }}
              variant="rounded"
            />
          )}
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Foster Links
          </Typography>
        </Box>
        {currentUser && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="textSecondary">
              {currentUser.displayName || currentUser.email}
            </Typography>
            <Chip
              icon={getRoleIcon(userRole || '')}
              label={getRoleLabel(userRole || '')}
              size="small"
              color={getRoleColor(userRole || '') as any}
              sx={{ mt: 0.5 }}
            />
          </Box>
        )}
      </Box>
      <Divider />
      <List>
        {accessibleItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/theme-settings')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Theme Settings" />
          </ListItemButton>
        </ListItem>
        {userRole === 'admin' && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/agency-settings')}>
              <ListItemIcon>
                <AdminIcon />
              </ListItemIcon>
              <ListItemText primary="Agency Settings" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={2}
        sx={{ 
          backgroundColor: themeSettings.primaryColor,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo/Title */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: isMobile ? 1 : 0,
              cursor: 'pointer',
              mr: 4
            }}
            onClick={() => navigate('/')}
          >
            {themeSettings.logoUrl && (
              <Avatar
                src={themeSettings.logoUrl}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1.5,
                  bgcolor: 'rgba(255,255,255,0.1)'
                }}
                variant="rounded"
              />
            )}
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold'
              }}
            >
              Foster Links
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              {accessibleItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 2,
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* User Menu */}
          {currentUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && (
                <Chip
                  icon={getRoleIcon(userRole || '')}
                  label={getRoleLabel(userRole || '')}
                  size="small"
                  color={getRoleColor(userRole || '') as any}
                  variant="outlined"
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              )}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                  {currentUser.displayName ? 
                    currentUser.displayName.charAt(0).toUpperCase() : 
                    currentUser.email?.charAt(0).toUpperCase()
                  }
                </Avatar>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Desktop User Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {currentUser && (
          <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Signed in as
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {currentUser.displayName || currentUser.email}
            </Typography>
            <Chip
              icon={getRoleIcon(userRole || '')}
              label={getRoleLabel(userRole || '')}
              size="small"
              color={getRoleColor(userRole || '') as any}
              sx={{ mt: 0.5 }}
            />
          </Box>
        )}
        <Divider />
        <MenuItem onClick={() => { handleNavigation('/theme-settings'); handleMenuClose(); }}>
          <SettingsIcon sx={{ mr: 1 }} />
          Theme Settings
        </MenuItem>
        {userRole === 'admin' && (
          <MenuItem onClick={() => { handleNavigation('/agency-settings'); handleMenuClose(); }}>
            <AdminIcon sx={{ mr: 1 }} />
            Agency Settings
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default NavigationBar;