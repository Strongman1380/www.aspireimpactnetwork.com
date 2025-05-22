import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  TextField, 
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface YouthProfile {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  fosterParentId?: string;
  foster_worker?: string;
}

const YouthProfiles: React.FC = () => {
  const [youthProfiles, setYouthProfiles] = useState<YouthProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<YouthProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');
  
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  
  // Show snackbar message
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Fetch youth profiles
  useEffect(() => {
    const fetchYouthProfiles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching youth profiles...');
        let youthQuery;
        
        // If user is a foster parent, only fetch youth assigned to them
        if (userRole === 'foster_parent' && currentUser) {
          console.log('Fetching youth for foster parent:', currentUser.uid);
          youthQuery = query(
            collection(db, 'youth_profiles'),
            where('fosterParentId', '==', currentUser.uid)
          );
        } else {
          // Admin and workers can see all youth
          console.log('Fetching all youth profiles');
          youthQuery = collection(db, 'youth_profiles');
        }
        
        const querySnapshot = await getDocs(youthQuery);
        
        const profiles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as YouthProfile[];
        
        console.log(`Found ${profiles.length} youth profiles`);
        setYouthProfiles(profiles);
        setFilteredProfiles(profiles);
        
        if (profiles.length === 0) {
          showSnackbar('No youth profiles found', 'info');
        }
      } catch (error: any) {
        console.error('Error fetching youth profiles:', error);
        setError('Failed to load youth profiles. Please try again.');
        showSnackbar('Error loading youth profiles: ' + (error.message || 'Unknown error'), 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser && userRole) {
      fetchYouthProfiles();
    } else {
      setLoading(false);
    }
  }, [currentUser, userRole]);
  
  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredProfiles(youthProfiles);
    } else {
      const filtered = youthProfiles.filter(
        youth => 
          youth.first_name.toLowerCase().includes(value) || 
          youth.last_name.toLowerCase().includes(value)
      );
      
      setFilteredProfiles(filtered);
    }
  };
  
  // Navigate to youth detail page
  const handleViewYouth = (id: string) => {
    navigate(`/youth-profiles/${id}`);
  };
  
  // Navigate to create new youth profile
  const handleCreateYouth = () => {
    navigate('/youth-profiles/new');
  };
  
  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            {userRole === 'foster_parent' ? 'My Youth' : 'Youth Profiles'}
          </Typography>
          
          {(userRole === 'admin' || userRole === 'worker') && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleCreateYouth}
            >
              Add New Youth
            </Button>
          )}
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Button 
              size="small" 
              sx={{ ml: 2 }} 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Alert>
        )}
        
        <TextField
          fullWidth
          margin="normal"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        
        {!error && filteredProfiles.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
            <Typography align="center" color="textSecondary" variant="h6" sx={{ mb: 2 }}>
              No youth profiles found
            </Typography>
            {searchTerm ? (
              <Typography variant="body2" color="textSecondary">
                No results match your search. Try different keywords or clear the search.
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {userRole === 'foster_parent' 
                  ? "You don't have any youth assigned to you yet." 
                  : "There are no youth profiles in the system yet."}
              </Typography>
            )}
            {(userRole === 'admin' || userRole === 'worker') && !searchTerm && (
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={handleCreateYouth}
                sx={{ mt: 2 }}
              >
                Add Your First Youth Profile
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredProfiles.map((youth) => (
              <Grid component="div" item xs={12} sm={6} md={4} key={youth.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconButton 
                        sx={{ 
                          backgroundColor: 'primary.light', 
                          color: 'white',
                          mr: 2
                        }}
                        disabled
                      >
                        <PersonIcon />
                      </IconButton>
                      
                      <Box>
                        <Typography variant="h6">
                          {youth.first_name} {youth.last_name}
                        </Typography>
                        
                        <Typography variant="body2" color="textSecondary">
                          Age: {calculateAge(youth.dob)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    {youth.foster_worker && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Case Worker:</strong> {youth.foster_worker}
                      </Typography>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleViewYouth(youth.id)}
                      fullWidth
                    >
                      View Profile
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
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

export default YouthProfiles;