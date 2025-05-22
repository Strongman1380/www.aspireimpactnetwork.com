import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Tabs,
  Tab
} from '@mui/material';
import { Print as PrintIcon, GetApp as DownloadIcon } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

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
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

interface Report {
  id: string;
  type: 'medication' | 'incident' | 'home_visit' | 'behavior';
  date: string;
  youthId: string;
  youthName: string;
  fosterParentId: string;
  fosterParentName: string;
  workerId: string;
  workerName: string;
  details: any;
  timestamp: number;
}

interface FilterOptions {
  startDate: string;
  endDate: string;
  fosterParentId: string;
  workerId: string;
}

const ReportsDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [fosterParents, setFosterParents] = useState<{id: string, name: string}[]>([]);
  const [workers, setWorkers] = useState<{id: string, name: string}[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    startDate: '',
    endDate: '',
    fosterParentId: '',
    workerId: ''
  });
  
  const printRef = useRef<HTMLDivElement>(null);
  
  // Fetch reports and filter options
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reports
        const reportsQuery = query(
          collection(db, 'reports'),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(reportsQuery);
        
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Report[];
        
        setReports(reportsData);
        setFilteredReports(reportsData);
        
        // Fetch foster parents for filter
        const fosterParentsQuery = query(collection(db, 'foster_parents'));
        const fosterParentsSnapshot = await getDocs(fosterParentsQuery);
        
        const fosterParentsData = fosterParentsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: `${doc.data().first_name} ${doc.data().last_name}`
        }));
        
        setFosterParents(fosterParentsData);
        
        // Fetch workers for filter
        const workersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'worker')
        );
        
        const workersSnapshot = await getDocs(workersQuery);
        
        const workersData = workersSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().displayName || doc.data().email
        }));
        
        setWorkers(workersData);
      } catch (error) {
        console.error('Error fetching reports data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    // Filter reports by type based on tab
    const reportTypes = ['medication', 'incident', 'home_visit', 'behavior'];
    const selectedType = reportTypes[newValue];
    
    if (selectedType) {
      applyFilters(selectedType);
    } else {
      applyFilters();
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };
  
  // Apply filters
  const applyFilters = (specificType?: string) => {
    let filtered = [...reports];
    
    // Filter by report type if specified
    if (specificType) {
      filtered = filtered.filter(report => report.type === specificType);
    } else {
      // Get the current tab's report type
      const reportTypes = ['medication', 'incident', 'home_visit', 'behavior'];
      const selectedType = reportTypes[tabValue];
      filtered = filtered.filter(report => report.type === selectedType);
    }
    
    // Apply date filters
    if (filters.startDate) {
      const startTimestamp = new Date(filters.startDate).getTime();
      filtered = filtered.filter(report => report.timestamp >= startTimestamp);
    }
    
    if (filters.endDate) {
      const endTimestamp = new Date(filters.endDate + 'T23:59:59').getTime();
      filtered = filtered.filter(report => report.timestamp <= endTimestamp);
    }
    
    // Apply foster parent filter
    if (filters.fosterParentId) {
      filtered = filtered.filter(report => report.fosterParentId === filters.fosterParentId);
    }
    
    // Apply worker filter
    if (filters.workerId) {
      filtered = filtered.filter(report => report.workerId === filters.workerId);
    }
    
    setFilteredReports(filtered);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      fosterParentId: '',
      workerId: ''
    });
    
    // Get the current tab's report type
    const reportTypes = ['medication', 'incident', 'home_visit', 'behavior'];
    const selectedType = reportTypes[tabValue];
    
    const filtered = reports.filter(report => report.type === selectedType);
    setFilteredReports(filtered);
  };
  
  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Foster Links Reports',
  });
  
  // Generate CSV for download
  const generateCSV = () => {
    if (filteredReports.length === 0) return;
    
    // Get the current tab's report type
    const reportTypes = ['medication', 'incident', 'home_visit', 'behavior'];
    const selectedType = reportTypes[tabValue];
    
    // Define headers based on report type
    let headers: string[] = ['Date', 'Youth Name', 'Foster Parent', 'Worker'];
    
    switch (selectedType) {
      case 'medication':
        headers = [...headers, 'Medication', 'Dosage', 'Administered By', 'Notes'];
        break;
      case 'incident':
        headers = [...headers, 'Incident Type', 'Description', 'Action Taken'];
        break;
      case 'home_visit':
        headers = [...headers, 'Visit Duration', 'Observations', 'Follow-up Required'];
        break;
      case 'behavior':
        headers = [...headers, 'Behavior Type', 'Description', 'Intervention'];
        break;
    }
    
    // Create CSV content
    let csvContent = headers.join(',') + '\\n';
    
    filteredReports.forEach(report => {
      const date = new Date(report.date).toLocaleDateString();
      let row = [
        date,
        report.youthName,
        report.fosterParentName,
        report.workerName
      ];
      
      // Add type-specific fields
      switch (selectedType) {
        case 'medication':
          row = [
            ...row,
            report.details.medication || '',
            report.details.dosage || '',
            report.details.administeredBy || '',
            report.details.notes || ''
          ];
          break;
        case 'incident':
          row = [
            ...row,
            report.details.incidentType || '',
            report.details.description || '',
            report.details.actionTaken || ''
          ];
          break;
        case 'home_visit':
          row = [
            ...row,
            report.details.visitDuration || '',
            report.details.observations || '',
            report.details.followUpRequired ? 'Yes' : 'No'
          ];
          break;
        case 'behavior':
          row = [
            ...row,
            report.details.behaviorType || '',
            report.details.description || '',
            report.details.intervention || ''
          ];
          break;
      }
      
      // Escape any commas in the data
      const escapedRow = row.map(field => {
        const stringField = String(field);
        return stringField.includes(',') ? `"${stringField}"` : stringField;
      });
      
      csvContent += escapedRow.join(',') + '\\n';
    });
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedType}_reports.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) {
    return <Typography>Loading reports...</Typography>;
  }
  
  // Render report table based on type
  const renderReportTable = () => {
    // Get the current tab's report type
    const reportTypes = ['medication', 'incident', 'home_visit', 'behavior'];
    const selectedType = reportTypes[tabValue];
    
    switch (selectedType) {
      case 'medication':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Youth</TableCell>
                  <TableCell>Foster Parent</TableCell>
                  <TableCell>Medication</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Administered By</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>{report.youthName}</TableCell>
                      <TableCell>{report.fosterParentName}</TableCell>
                      <TableCell>{report.details.medication}</TableCell>
                      <TableCell>{report.details.dosage}</TableCell>
                      <TableCell>{report.details.administeredBy}</TableCell>
                      <TableCell>{report.details.notes}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No medication reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );
        
      case 'incident':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Youth</TableCell>
                  <TableCell>Foster Parent</TableCell>
                  <TableCell>Worker</TableCell>
                  <TableCell>Incident Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Action Taken</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>{report.youthName}</TableCell>
                      <TableCell>{report.fosterParentName}</TableCell>
                      <TableCell>{report.workerName}</TableCell>
                      <TableCell>{report.details.incidentType}</TableCell>
                      <TableCell>{report.details.description}</TableCell>
                      <TableCell>{report.details.actionTaken}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No incident reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );
        
      case 'home_visit':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Youth</TableCell>
                  <TableCell>Foster Parent</TableCell>
                  <TableCell>Worker</TableCell>
                  <TableCell>Visit Duration</TableCell>
                  <TableCell>Observations</TableCell>
                  <TableCell>Follow-up Required</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>{report.youthName}</TableCell>
                      <TableCell>{report.fosterParentName}</TableCell>
                      <TableCell>{report.workerName}</TableCell>
                      <TableCell>{report.details.visitDuration}</TableCell>
                      <TableCell>{report.details.observations}</TableCell>
                      <TableCell>{report.details.followUpRequired ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No home visit reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );
        
      case 'behavior':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Youth</TableCell>
                  <TableCell>Foster Parent</TableCell>
                  <TableCell>Worker</TableCell>
                  <TableCell>Behavior Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Intervention</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>{report.youthName}</TableCell>
                      <TableCell>{report.fosterParentName}</TableCell>
                      <TableCell>{report.workerName}</TableCell>
                      <TableCell>{report.details.behaviorType}</TableCell>
                      <TableCell>{report.details.description}</TableCell>
                      <TableCell>{report.details.intervention}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No behavior reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );
        
      default:
        return <Typography>Select a report type</Typography>;
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Reports Dashboard</Typography>
          
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<PrintIcon />} 
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<DownloadIcon />} 
              onClick={generateCSV}
            >
              Export CSV
            </Button>
          </Box>
        </Box>
        
        {/* Report Type Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="report types">
            <Tab label="Medication" />
            <Tab label="Incident" />
            <Tab label="Home Visit" />
            <Tab label="Behavior" />
          </Tabs>
        </Box>
        
        {/* Filters */}
        <Paper elevation={1} sx={{ p: 2, my: 3 }}>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel id="foster-parent-label">Foster Parent</InputLabel>
                <Select
                  labelId="foster-parent-label"
                  name="fosterParentId"
                  value={filters.fosterParentId}
                  onChange={handleFilterChange}
                  label="Foster Parent"
                >
                  <MenuItem value="">All</MenuItem>
                  {fosterParents.map((parent) => (
                    <MenuItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel id="worker-label">Worker</InputLabel>
                <Select
                  labelId="worker-label"
                  name="workerId"
                  value={filters.workerId}
                  onChange={handleFilterChange}
                  label="Worker"
                >
                  <MenuItem value="">All</MenuItem>
                  {workers.map((worker) => (
                    <MenuItem key={worker.id} value={worker.id}>
                      {worker.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  onClick={() => applyFilters()}
                  fullWidth
                >
                  Apply
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={resetFilters}
                  fullWidth
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Report Content */}
        <div ref={printRef}>
          <TabPanel value={tabValue} index={0}>
            {renderReportTable()}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {renderReportTable()}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {renderReportTable()}
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            {renderReportTable()}
          </TabPanel>
        </div>
      </Paper>
    </Box>
  );
};

export default ReportsDashboard;