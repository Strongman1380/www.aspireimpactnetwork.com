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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    switch (userRole) {
      case 'admin':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Users
                  </Typography>
                  <Typography variant="h5" component="div">
                    {userCount !== null ? userCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleNavigation('/user-management')}>
                    Manage Users
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Youth
                  </Typography>
                  <Typography variant="h5" component="div">
                    {youthCount !== null ? youthCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleNavigation('/youth-profiles')}>
                    View Youth
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Foster Parents
                  </Typography>
                  <Typography variant="h5" component="div">
                    {fosterParentCount !== null ? fosterParentCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleNavigation('/foster-parents')}>
                    View Foster Parents
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Reports
                  </Typography>
                  <Typography variant="h5" component="div">
                    {reportCount !== null ? reportCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleNavigation('/reports')}>
                    View Reports
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <RecentActivity />
              </Paper>
            </Grid>
          </Grid>
        );
        
      case 'worker':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Assigned Youth
                  </Typography>
                  <Typography variant="h5" component="div">
                    {assignedYouthCount !== null ? assignedYouthCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleNavigation('/youth-profiles')}>
                    View Youth
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Foster Parents
                  </Typography>
                  <Typography variant="h5" component="div">
                    {fosterParentCount !== null ? fosterParentCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleNavigation('/foster-parents')}>
                    View Foster Parents
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <RecentActivity />
              </Paper>
            </Grid>
          </Grid>
        );
        
      case 'foster_parent':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Youth in Care
                  </Typography>
                  <Typography variant="h5" component="div">
                    {youthCount !== null ? youthCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleNavigation('/my-youth')}>
                    View Youth
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Medication Logs
                  </Typography>
                  <Typography variant="h5" component="div">
                    {medicationLogCount !== null ? medicationLogCount : '...'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleNavigation('/logs')}>
                    View Logs
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <RecentActivity />
              </Paper>
            </Grid>
          </Grid>
        );
        
      default:
        return (
          <Typography>
            Welcome to Foster Links. Please contact your administrator for access.
          </Typography>
        );
    }
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(drawerOpen && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Foster Links
          </Typography>
          
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          {currentUser && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography variant="subtitle1" noWrap>
                {currentUser.displayName || currentUser.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'User'}
              </Typography>
            </Box>
          )}
          
          <Divider />
          
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton onClick={() => handleNavigation(getNavPath(item))}>
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* Spacer for fixed app bar */}
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          
          {getDashboardContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;