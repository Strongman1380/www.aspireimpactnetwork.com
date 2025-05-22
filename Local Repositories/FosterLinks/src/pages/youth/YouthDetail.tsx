import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  MedicalServices as MedicalIcon
} from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import YouthDashboard from '../../components/YouthDashboard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`youth-tabpanel-${index}`}
      aria-labelledby={`youth-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const YouthDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [youthExists, setYouthExists] = useState(false);
  const [youthName, setYouthName] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Check if youth profile exists
  useEffect(() => {
    const checkYouthProfile = async () => {
      if (!id) return;
      
      try {
        const youthDoc = await getDoc(doc(db, 'youth_profiles', id));
        
        if (youthDoc.exists()) {
          setYouthExists(true);
          const data = youthDoc.data();
          setYouthName(`${data.first_name} ${data.last_name}`);
        }
      } catch (error) {
        console.error('Error checking youth profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkYouthProfile();
  }, [id]);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Navigate to medication log
  const handleViewMedicationLog = () => {
    if (id) {
      navigate(`/medication-logs/${id}`);
    }
  };
  
  // Navigate back to youth profiles
  const handleBack = () => {
    if (userRole === 'foster_parent') {
      navigate('/my-youth');
    } else {
      navigate('/youth-profiles');
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!youthExists) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Youth Profile Not Found
          </Typography>
          
          <Typography align="center" paragraph>
            The youth profile you are looking for does not exist or you do not have permission to view it.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back to Youth Profiles
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            
            <Typography variant="h4">
              {youthName}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            startIcon={<MedicalIcon />}
            onClick={handleViewMedicationLog}
          >
            Medication Log
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="youth profile tabs">
            <Tab label="Profile" />
            <Tab label="Case Notes" />
            <Tab label="Documents" />
            <Tab label="Timeline" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <YouthDashboard />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1">
            Case notes functionality will be implemented here.
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1">
            Documents functionality will be implemented here.
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Typography variant="body1">
            Timeline functionality will be implemented here.
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default YouthDetail;