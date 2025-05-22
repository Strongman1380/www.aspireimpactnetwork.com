import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Reports: React.FC = () => {
  const { userRole } = useAuth();
  const [reportType, setReportType] = React.useState('youth');
  const [dateRange, setDateRange] = React.useState('month');
  const [loading, setLoading] = React.useState(false);
  
  // Handle generating a report
  const handleGenerateReport = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  
  // Handle exporting a report
  const handleExportReport = (format: string) => {
    alert(`Exporting report in ${format} format`);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="youth">Youth Demographics</MenuItem>
                <MenuItem value="placements">Placement History</MenuItem>
                <MenuItem value="medications">Medication Administration</MenuItem>
                <MenuItem value="incidents">Incident Reports</MenuItem>
                {userRole === 'admin' && (
                  <MenuItem value="financial">Financial Summary</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ height: '56px' }}
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Report'}
            </Button>
          </Grid>
          
          {dateRange === 'custom' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChartIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">
                  Statistical Reports
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                Generate statistical reports with charts and graphs to visualize data trends.
              </Typography>
            </CardContent>
            
            <CardActions>
              <Button size="small" onClick={() => setReportType('youth')}>
                View Options
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TableChartIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">
                  Tabular Reports
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                Generate detailed tabular reports with filterable and sortable data.
              </Typography>
            </CardContent>
            
            <CardActions>
              <Button size="small" onClick={() => setReportType('placements')}>
                View Options
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PieChartIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">
                  Summary Reports
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                Generate high-level summary reports for quick insights and decision making.
              </Typography>
            </CardContent>
            
            <CardActions>
              <Button size="small" onClick={() => setReportType('incidents')}>
                View Options
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Recent Reports
          </Typography>
          
          <Box>
            <Button 
              startIcon={<DownloadIcon />} 
              sx={{ mr: 1 }}
              onClick={() => handleExportReport('pdf')}
            >
              PDF
            </Button>
            
            <Button 
              startIcon={<DownloadIcon />} 
              sx={{ mr: 1 }}
              onClick={() => handleExportReport('excel')}
            >
              Excel
            </Button>
            
            <Button 
              startIcon={<PrintIcon />}
              onClick={() => handleExportReport('print')}
            >
              Print
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="body1" align="center" sx={{ py: 4 }}>
          No recent reports. Generate a report to see it here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Reports;