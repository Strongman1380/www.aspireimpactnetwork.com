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
  Divider,
  CircularProgress,
  Alert,
  Skeleton
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { useYouthStore, YouthProfile } from '../../store/youthStore';

const YouthProfiles: React.FC = () => {
  const [filteredProfiles, setFilteredProfiles] = useState<YouthProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { currentUser, userRole } = useAuth();
  const { showSnackbar } = useUI();
  const navigate = useNavigate();
  
  // Get youth profiles from Zustand store
  const { 
    youthProfiles, 
    loading, 
    error, 
    fetchYouthProfiles 
  } = useYouthStore();
  
  // Fetch youth profiles on component mount
  useEffect(() => {
    const loadProfiles = async () => {
      if (currentUser && userRole) {
        await fetchYouthProfiles(currentUser.uid, userRole);
        
        if (youthProfiles.length === 0) {
          showSnackbar('No youth profiles found', 'info');
        }
      }
    };
    
    loadProfiles();
  }, [currentUser, userRole, fetchYouthProfiles, showSnackbar]);
  
  // Update filtered profiles when youth profiles change
  useEffect(() => {
    setFilteredProfiles(youthProfiles);
  }, [youthProfiles]);
  
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
  
  // Refresh youth profiles
  const handleRefresh = async () => {
    if (currentUser && userRole) {
      await fetchYouthProfiles(currentUser.uid, userRole);
      showSnackbar('Youth profiles refreshed', 'success');
    }
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
  
  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ width: '100%' }}>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Skeleton variant="text" width="60%" />
          </CardContent>
          <CardActions>
            <Skeleton variant="rectangular" width="100%" height={36} />
          </CardActions>
        </Card>
      </Grid>
    ));
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            {userRole === 'foster_parent' ? 'My Youth' : 'Youth Profiles'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh youth profiles"
            >
              Refresh
            </Button>
            
            {(userRole === 'admin' || userRole === 'worker') && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleCreateYouth}
                aria-label="Add new youth profile"
              >
                Add New Youth
              </Button>
            )}
          </Box>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRefresh}
              >
                Retry
              </Button>
            }
          >
            {error}
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
            'aria-label': 'Search youth profiles',
          }}
          sx={{ mb: 3 }}
        />
        
        {loading ? (
          <Grid container spacing={3}>
            {renderSkeletons()}
          </Grid>
        ) : !error && filteredProfiles.length === 0 ? (
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
              <Grid item xs={12} sm={6} md={4} key={youth.id}>
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
                        aria-hidden="true"
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
                      aria-label={`View profile of ${youth.first_name} ${youth.last_name}`}
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
    </Box>
  );
};

export default YouthProfiles;