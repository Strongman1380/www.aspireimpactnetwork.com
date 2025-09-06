import React, { useState } from 'react';
import { 
  Box, 
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import NavigationBar from '../../components/NavigationBar';
import ReportsOverview from '../../components/ReportsOverview';
import ReportsDashboard from '../../components/ReportsDashboard';

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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
};

const Reports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavigationBar />
      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="reports tabs"
              sx={{ px: 3, pt: 2 }}
            >
              <Tab 
                icon={<VisibilityIcon />} 
                label="Reports Overview" 
                id="reports-tab-0"
                aria-controls="reports-tabpanel-0"
              />
              <Tab 
                icon={<AssessmentIcon />} 
                label="Generate Reports" 
                id="reports-tab-1"
                aria-controls="reports-tabpanel-1"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <ReportsOverview />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ReportsDashboard />
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
};

export default Reports;