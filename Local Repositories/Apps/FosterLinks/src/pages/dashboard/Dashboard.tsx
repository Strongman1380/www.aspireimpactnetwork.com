import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import RecentActivity from '../../components/RecentActivity';
import NavigationBar from '../../components/NavigationBar';

const Dashboard: React.FC = () => {
  const { currentUser, userRole } = useAuth();
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
  
  // Memoized fetch function to prevent unnecessary re-fetches
  const fetchDashboardData = useCallback(async () => {
    if (!currentUser || !userRole) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching dashboard data...');
      
      // Use Promise.all for parallel fetching to improve performance
      if (userRole === 'admin') {
        const [userSnapshot, youthSnapshot, fosterParentSnapshot, reportSnapshot] = await Promise.all([
          getCountFromServer(collection(db, 'users')),
          getCountFromServer(collection(db, 'youth_profiles')),
          getCountFromServer(query(collection(db, 'users'), where('role', '==', 'foster_parent'))),
          getCountFromServer(collection(db, 'reports'))
        ]);
        
        setUserCount(userSnapshot.data().count);
        setYouthCount(youthSnapshot.data().count);
        setFosterParentCount(fosterParentSnapshot.data().count);
        setReportCount(reportSnapshot.data().count);
      } 
      else if (userRole === 'worker') {
        const [assignedYouthSnapshot, fosterParentSnapshot] = await Promise.all([
          getCountFromServer(query(collection(db, 'youth_profiles'), where('foster_worker', '==', currentUser.uid))),
          getCountFromServer(query(collection(db, 'users'), 
            where('role', '==', 'foster_parent'),
            where('assigned_worker', '==', currentUser.uid)
          ))
        ]);
        
        setAssignedYouthCount(assignedYouthSnapshot.data().count);
        setFosterParentCount(fosterParentSnapshot.data().count);
      } 
      else if (userRole === 'foster_parent') {
        const [youthInCareSnapshot, medicationLogSnapshot] = await Promise.all([
          getCountFromServer(query(collection(db, 'youth_profiles'), where('fosterParentId', '==', currentUser.uid))),
          getCountFromServer(query(collection(db, 'medication_logs'), where('fosterParentId', '==', currentUser.uid)))
        ]);
        
        setYouthCount(youthInCareSnapshot.data().count);
        setMedicationLogCount(medicationLogSnapshot.data().count);
      }
      
      console.log('Dashboard data fetched successfully');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, userRole]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);
  
  // Memoize styles to prevent re-creation on every render
  const cardStyles = useMemo(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 4,
    },
  }), []);

  const cardContentStyles = useMemo(() => ({
    flexGrow: 1,
    p: { xs: 2, sm: 3 },
  }), []);

  const cardActionStyles = useMemo(() => ({
    p: { xs: 1.5, sm: 2 },
    pt: 0,
  }), []);

  const statNumberStyles = useMemo(() => ({
    fontSize: { xs: '1.75rem', sm: '2.125rem' },
    fontWeight: 'bold',
    my: 1,
  }), []);

  // Dashboard content based on user role
  const getDashboardContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 4 } }}>
          <CircularProgress />
        </Box>
      );
    }
    
    
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
                    View My Youth
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
                    onClick={() => handleNavigation('/medication-logs')}
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
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              Welcome to Foster Links
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Please contact your administrator for access.
            </Typography>
          </Paper>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavigationBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Welcome back! Here's an overview of your Foster Links system.
        </Typography>
        {getDashboardContent()}
      </Container>
    </Box>
  );
};

export default Dashboard;