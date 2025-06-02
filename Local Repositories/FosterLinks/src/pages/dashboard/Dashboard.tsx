import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ChildCare as ChildCareIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  MedicalServices as MedicalIcon,
  Note as NoteIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import RecentActivity from '../../components/RecentActivity';

interface DashboardProps {
  navigationItems: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ navigationItems }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { currentUser, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Dashboard data state
  const [userCount, setUserCount] = useState<number | null>(null);
  const [youthCount, setYouthCount] = useState<number | null>(null);
  const [fosterParentCount, setFosterParentCount] = useState<number | null>(null);
  const [reportCount, setReportCount] = useState<number | null>(null);
  const [assignedYouthCount, setAssignedYouthCount] = useState<number | null>(null);
  const [medicationLogCount, setMedicationLogCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const drawerWidth = 240;
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        
        if (userRole === 'admin') {
          // Fetch user count
          const userSnapshot = await getCountFromServer(collection(db, 'users'));
          setUserCount(userSnapshot.data().count);
          
          // Fetch youth count
          const youthSnapshot = await getCountFromServer(collection(db, 'youth_profiles'));
          setYouthCount(youthSnapshot.data().count);
          
          // Fetch foster parent count
          const fosterParentSnapshot = await getCountFromServer(
            query(collection(db, 'users'), where('role', '==', 'foster_parent'))
          );
          setFosterParentCount(fosterParentSnapshot.data().count);
          
          // Fetch report count
          const reportSnapshot = await getCountFromServer(collection(db, 'reports'));
          setReportCount(reportSnapshot.data().count);
        } 
        else if (userRole === 'worker' && currentUser) {
          // Fetch assigned youth count
          const assignedYouthSnapshot = await getCountFromServer(
            query(collection(db, 'youth_profiles'), where('foster_worker', '==', currentUser.uid))
          );
          setAssignedYouthCount(assignedYouthSnapshot.data().count);
          
          // Fetch foster parent count for this worker
          const fosterParentSnapshot = await getCountFromServer(
            query(collection(db, 'users'), 
              where('role', '==', 'foster_parent'),
              where('assigned_worker', '==', currentUser.uid)
            )
          );
          setFosterParentCount(fosterParentSnapshot.data().count);
        } 
        else if (userRole === 'foster_parent' && currentUser) {
          // Fetch youth in care count
          const youthInCareSnapshot = await getCountFromServer(
            query(collection(db, 'youth_profiles'), where('fosterParentId', '==', currentUser.uid))
          );
          setYouthCount(youthInCareSnapshot.data().count);
          
          // Fetch medication log count
          const medicationLogSnapshot = await getCountFromServer(
            query(collection(db, 'medication_logs'), where('fosterParentId', '==', currentUser.uid))
          );
          setMedicationLogCount(medicationLogSnapshot.data().count);
        }
        
        console.log('Dashboard data fetched successfully');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser && userRole) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUser, userRole]);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Get icon for navigation item
  const getNavIcon = (item: string) => {
    switch (item) {
      case 'User Management':
        return <PeopleIcon />;
      case 'Youth Profiles':
      case 'Youth':
        return <ChildCareIcon />;
      case 'Foster Parents':
        return <HomeIcon />;
      case 'Reports':
        return <AssessmentIcon />;
      case 'My Profile':
        return <PeopleIcon />;
      case 'Logs':
        return <NoteIcon />;
      case 'Documents':
        return <NoteIcon />;
      default:
        return <DashboardIcon />;
    }
  };
  
  // Get path for navigation item
  const getNavPath = (item: string) => {
    switch (item) {
      case 'User Management':
        return '/user-management';
      case 'Youth Profiles':
        return '/youth-profiles';
      case 'Foster Parents':
        return '/foster-parents';
      case 'Reports':
        return '/reports';
      case 'My Profile':
        return '/my-profile';
      case 'Youth':
        return '/my-youth';
      case 'Logs':
        return '/logs';
      case 'Documents':
        return '/documents';
      default:
        return '/';
    }
  };
  
  // Dashboard content based on user role
  const getDashboardContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 4 } }}>
          <CircularProgress />
        </Box>
      );
    }
    
    // Common card styles for consistency and better mobile experience
    const cardStyles = {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      },
    };
    
    const cardContentStyles = {
      flexGrow: 1,
      p: { xs: 2, sm: 3 },
    };
    
    const cardActionStyles = {
      p: { xs: 1.5, sm: 2 },
      pt: 0,
    };
    
    const statNumberStyles = {
      fontSize: { xs: '1.75rem', sm: '2.125rem' },
      fontWeight: 'bold',
      my: 1,
    };
    
    switch (userRole) {
      case 'admin':
        return (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={6} sm={6} md={3}>
              <Card sx={cardStyles}>
                <CardContent sx={cardContentStyles}>
                  <Typography color="textSecondary" variant="body2" gutterBottom>
                    Users
                  </Typography>
                  <Typography variant="h5" component="div" sx={statNumberStyles}>
                    {userCount !== null ? userCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions sx={cardActionStyles}>
                  <Button 
                    size="small" 
                    onClick={() => handleNavigation('/user-management')}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    Manage Users
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Card sx={cardStyles}>
                <CardContent sx={cardContentStyles}>
                  <Typography color="textSecondary" variant="body2" gutterBottom>
                    Youth
                  </Typography>
                  <Typography variant="h5" component="div" sx={statNumberStyles}>
                    {youthCount !== null ? youthCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions sx={cardActionStyles}>
                  <Button 
                    size="small" 
                    onClick={() => handleNavigation('/youth-profiles')}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    View Youth
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Card sx={cardStyles}>
                <CardContent sx={cardContentStyles}>
                  <Typography color="textSecondary" variant="body2" gutterBottom>
                    Foster Parents
                  </Typography>
                  <Typography variant="h5" component="div" sx={statNumberStyles}>
                    {fosterParentCount !== null ? fosterParentCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions sx={cardActionStyles}>
                  <Button 
                    size="small" 
                    onClick={() => handleNavigation('/foster-parents')}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    View Foster Parents
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Card sx={cardStyles}>
                <CardContent sx={cardContentStyles}>
                  <Typography color="textSecondary" variant="body2" gutterBottom>
                    Reports
                  </Typography>
                  <Typography variant="h5" component="div" sx={statNumberStyles}>
                    {reportCount !== null ? reportCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions sx={cardActionStyles}>
                  <Button 
                    size="small" 
                    onClick={() => handleNavigation('/reports')}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    View Reports
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 3 } }}>
                <RecentActivity />
              </Paper>
            </Grid>
          </Grid>
        );
        
      case 'worker':
        return (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card sx={cardStyles}>
                <CardContent sx={cardContentStyles}>
                  <Typography color="textSecondary" variant="body2" gutterBottom>
                    Assigned Youth
                  </Typography>
                  <Typography variant="h5" component="div" sx={statNumberStyles}>
                    {assignedYouthCount !== null ? assignedYouthCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions sx={cardActionStyles}>
                  <Button 
                    size="small" 
                    onClick={() => handleNavigation('/youth-profiles')}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    View Youth
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card sx={cardStyles}>
                <CardContent sx={cardContentStyles}>
                  <Typography color="textSecondary" variant="body2" gutterBottom>
                    Foster Parents
                  </Typography>
                  <Typography variant="h5" component="div" sx={statNumberStyles}>
                    {fosterParentCount !== null ? fosterParentCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions sx={cardActionStyles}>
                  <Button 
                    size="small" 
                    onClick={() => handleNavigation('/foster-parents')}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    View Foster Parents
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 3 } }}>
                <RecentActivity />
              </Paper>
            </Grid>
          </Grid>
        );
        
      case 'foster_parent':
        return (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card sx={cardStyles}>
                <CardContent sx={cardContentStyles}>
                  <Typography color="textSecondary" variant="body2" gutterBottom>
                    Youth in Care
                  </Typography>
                  <Typography variant="h5" component="div" sx={statNumberStyles}>
                    {youthCount !== null ? youthCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions sx={cardActionStyles}>
                  <Button 
                    size="small" 
                    onClick={() => handleNavigation('/my-youth')}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    View Youth
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card sx={cardStyles}>
                <CardContent sx={cardContentStyles}>
                  <Typography color="textSecondary" variant="body2" gutterBottom>
                    Medication Logs
                  </Typography>
                  <Typography variant="h5" component="div" sx={statNumberStyles}>
                    {medicationLogCount !== null ? medicationLogCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions sx={cardActionStyles}>
                  <Button 
                    size="small" 
                    onClick={() => handleNavigation('/logs')}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    View Logs
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 3 } }}>
                <RecentActivity />
              </Paper>
            </Grid>
          </Grid>
        );
        
      default:
        return (
          <Typography sx={{ textAlign: 'center', py: 4 }}>
            Welcome to Foster Links. Please contact your administrator for access.
          </Typography>
        );
    }
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(drawerOpen && !isMobile && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar sx={{ 
          pr: { xs: 1, sm: 2 }, // Reduce padding on small screens
          minHeight: { xs: 56, sm: 64 } // Smaller toolbar on mobile
        }}>
          <IconButton
            color="inherit"
            aria-label={drawerOpen ? "close drawer" : "open drawer"}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: { xs: 1, sm: 2 } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem' } // Smaller font on mobile
            }}
          >
            Foster Links
          </Typography>
          
          <IconButton 
            color="inherit" 
            onClick={handleLogout}
            aria-label="logout"
            sx={{ ml: 1 }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? drawerOpen : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: { xs: 0, sm: 'auto' }, // Full height on mobile
            height: '100%',
          },
        }}
      >
        <Toolbar 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end',
            minHeight: { xs: 56, sm: 64 } // Match AppBar height
          }}
        />
        
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          {currentUser && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography variant="subtitle1" noWrap>
                {currentUser.displayName || currentUser.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userRole ? `${userRole.charAt(0).toUpperCase()}${userRole.slice(1).replace('_', ' ')}` : 'User'}
              </Typography>
            </Box>
          )}
          
          <Divider />
          
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton 
                  onClick={() => handleNavigation(getNavPath(item))}
                  sx={{ 
                    py: { xs: 1.5, sm: 1 }, // Taller touch targets on mobile
                  }}
                >
                  <ListItemIcon>
                    {getNavIcon(item)}
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Divider />
          
          <List>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleNavigation('/theme-settings')}
                sx={{ py: { xs: 1.5, sm: 1 } }}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Theme Settings" />
              </ListItemButton>
            </ListItem>
            
            {userRole === 'admin' && (
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => handleNavigation('/agency-settings')}
                  sx={{ py: { xs: 1.5, sm: 1 } }}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Agency Settings" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 }, // Less padding on mobile
          width: '100%',
          marginLeft: { sm: `${drawerWidth}px` },
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} /> {/* Spacer for fixed app bar */}
        
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: { xs: 2, sm: 4 }, 
            mb: { xs: 2, sm: 4 },
            px: { xs: 1, sm: 2 } // Less padding on mobile
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2.125rem' }, // Smaller heading on mobile
              mb: { xs: 2, sm: 3 }
            }}
          >
            Dashboard
          </Typography>
          
          {getDashboardContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;