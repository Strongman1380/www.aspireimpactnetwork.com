import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Access Denied
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="error">
          Unauthorized Access
        </Typography>
        
        <Typography variant="body1" paragraph>
          You don't have permission to access this page.
        </Typography>
        
        {currentUser && (
          <Typography variant="body2" color="textSecondary" paragraph>
            Logged in as: {currentUser.email} 
            {userRole && ` (${userRole})`}
          </Typography>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Foster Links. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default Unauthorized;