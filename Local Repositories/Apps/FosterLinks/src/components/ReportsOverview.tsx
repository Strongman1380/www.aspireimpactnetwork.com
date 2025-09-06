import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TableChart as TableChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  MedicalServices as MedicalIcon,
  Warning as WarningIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  AttachMoney as MoneyIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  GetApp as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface ReportType {
  id: string;
  name: string;
  description: string;
  category: 'operational' | 'clinical' | 'financial' | 'compliance';
  icon: React.ReactNode;
  outputFormats: ('table' | 'chart' | 'summary' | 'timeline')[];
  fields: string[];
  frequency: string;
  accessLevel: ('admin' | 'worker' | 'foster_parent')[];
  sampleData?: any[];
}

const ReportsOverview: React.FC = () => {
  const { userRole } = useAuth();
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const reportTypes: ReportType[] = [
    {
      id: 'youth_demographics',
      name: 'Youth Demographics',
      description: 'Comprehensive overview of youth in care including age, gender, placement history, and current status.',
      category: 'operational',
      icon: <PersonIcon />,
      outputFormats: ['table', 'chart', 'summary'],
      fields: ['Name', 'Age', 'Gender', 'Placement Date', 'Foster Parent', 'Worker', 'Status'],
      frequency: 'Real-time',
      accessLevel: ['admin', 'worker'],
      sampleData: [
        { name: 'John Doe', age: 16, gender: 'Male', placementDate: '2024-01-15', fosterParent: 'Smith Family', worker: 'Jane Wilson', status: 'Active' },
        { name: 'Sarah Johnson', age: 14, gender: 'Female', placementDate: '2024-02-20', fosterParent: 'Brown Family', worker: 'Mike Davis', status: 'Active' }
      ]
    },
    {
      id: 'medication_administration',
      name: 'Medication Administration',
      description: 'Detailed logs of medication administration including dosages, times, and administering personnel.',
      category: 'clinical',
      icon: <MedicalIcon />,
      outputFormats: ['table', 'timeline', 'summary'],
      fields: ['Youth Name', 'Medication', 'Dosage', 'Time', 'Administered By', 'Notes'],
      frequency: 'Real-time',
      accessLevel: ['admin', 'worker', 'foster_parent'],
      sampleData: [
        { youthName: 'John Doe', medication: 'Adderall XR', dosage: '10mg', time: '08:00 AM', administeredBy: 'Mary Smith', notes: 'Taken with breakfast' },
        { youthName: 'Sarah Johnson', medication: 'Prozac', dosage: '20mg', time: '07:30 AM', administeredBy: 'Tom Brown', notes: 'No side effects noted' }
      ]
    },
    {
      id: 'incident_reports',
      name: 'Incident Reports',
      description: 'Documentation of incidents, behavioral issues, and interventions taken.',
      category: 'operational',
      icon: <WarningIcon />,
      outputFormats: ['table', 'chart', 'summary'],
      fields: ['Date', 'Youth', 'Incident Type', 'Description', 'Action Taken', 'Follow-up Required'],
      frequency: 'As needed',
      accessLevel: ['admin', 'worker'],
      sampleData: [
        { date: '2024-03-15', youth: 'John Doe', incidentType: 'Behavioral', description: 'Verbal altercation with peer', actionTaken: 'Counseling session scheduled', followUp: 'Yes' }
      ]
    },
    {
      id: 'home_visits',
      name: 'Home Visit Reports',
      description: 'Documentation of home visits including observations, assessments, and recommendations.',
      category: 'compliance',
      icon: <HomeIcon />,
      outputFormats: ['table', 'summary'],
      fields: ['Date', 'Foster Family', 'Worker', 'Duration', 'Observations', 'Recommendations'],
      frequency: 'Monthly',
      accessLevel: ['admin', 'worker'],
      sampleData: [
        { date: '2024-03-10', fosterFamily: 'Smith Family', worker: 'Jane Wilson', duration: '2 hours', observations: 'Home environment stable', recommendations: 'Continue current placement' }
      ]
    },
    {
      id: 'placement_history',
      name: 'Placement History',
      description: 'Historical data on youth placements including duration, outcomes, and transitions.',
      category: 'operational',
      icon: <TimelineIcon />,
      outputFormats: ['table', 'timeline', 'chart'],
      fields: ['Youth', 'Placement Start', 'Placement End', 'Foster Family', 'Reason for Change', 'Outcome'],
      frequency: 'Historical',
      accessLevel: ['admin', 'worker'],
      sampleData: [
        { youth: 'John Doe', placementStart: '2024-01-15', placementEnd: 'Current', fosterFamily: 'Smith Family', reasonForChange: 'N/A', outcome: 'Ongoing' }
      ]
    },
    {
      id: 'educational_progress',
      name: 'Educational Progress',
      description: 'Academic performance, school attendance, and educational goals tracking.',
      category: 'clinical',
      icon: <SchoolIcon />,
      outputFormats: ['table', 'chart', 'summary'],
      fields: ['Youth', 'School', 'Grade Level', 'GPA', 'Attendance %', 'Special Needs', 'Goals'],
      frequency: 'Quarterly',
      accessLevel: ['admin', 'worker'],
      sampleData: [
        { youth: 'John Doe', school: 'Lincoln High', gradeLevel: '10th', gpa: '3.2', attendance: '92%', specialNeeds: 'IEP', goals: 'Improve math scores' }
      ]
    },
    {
      id: 'behavioral_assessments',
      name: 'Behavioral Assessments',
      description: 'Psychological evaluations, behavioral interventions, and progress tracking.',
      category: 'clinical',
      icon: <PsychologyIcon />,
      outputFormats: ['table', 'summary', 'timeline'],
      fields: ['Youth', 'Assessment Date', 'Assessor', 'Behavioral Concerns', 'Interventions', 'Progress'],
      frequency: 'As needed',
      accessLevel: ['admin', 'worker'],
      sampleData: [
        { youth: 'Sarah Johnson', assessmentDate: '2024-02-28', assessor: 'Dr. Smith', behavioralConcerns: 'Anxiety', interventions: 'CBT sessions', progress: 'Improving' }
      ]
    },
    {
      id: 'financial_summary',
      name: 'Financial Summary',
      description: 'Financial data including placement costs, reimbursements, and budget tracking.',
      category: 'financial',
      icon: <MoneyIcon />,
      outputFormats: ['table', 'chart', 'summary'],
      fields: ['Period', 'Placement Costs', 'Reimbursements', 'Administrative Costs', 'Total Budget', 'Variance'],
      frequency: 'Monthly',
      accessLevel: ['admin'],
      sampleData: [
        { period: 'March 2024', placementCosts: '$15,000', reimbursements: '$12,000', adminCosts: '$2,000', totalBudget: '$20,000', variance: '+$1,000' }
      ]
    }
  ];

  // Filter reports based on user access level
  const accessibleReports = reportTypes.filter(report => 
    report.accessLevel.includes(userRole as any)
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operational': return 'primary';
      case 'clinical': return 'secondary';
      case 'financial': return 'success';
      case 'compliance': return 'warning';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'operational': return <AssessmentIcon />;
      case 'clinical': return <MedicalIcon />;
      case 'financial': return <MoneyIcon />;
      case 'compliance': return <HomeIcon />;
      default: return <AssessmentIcon />;
    }
  };

  const handlePreviewReport = (report: ReportType) => {
    setSelectedReport(report);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedReport(null);
  };

  const renderSampleTable = (report: ReportType) => {
    if (!report.sampleData || report.sampleData.length === 0) {
      return (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
          No sample data available
        </Typography>
      );
    }

    const columns = Object.keys(report.sampleData[0]);

    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: 'bold' }}>
                  {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {report.sampleData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reports Overview
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Comprehensive reporting system for Foster Links. View available report types, their formats, and sample outputs.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {accessibleReports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>
                    {report.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {report.name}
                  </Typography>
                </Box>

                <Chip
                  icon={getCategoryIcon(report.category)}
                  label={report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                  color={getCategoryColor(report.category) as any}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Typography variant="body2" color="textSecondary" paragraph>
                  {report.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Output Formats:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {report.outputFormats.map((format) => (
                      <Chip
                        key={format}
                        label={format}
                        size="small"
                        variant="outlined"
                        icon={
                          format === 'table' ? <TableChartIcon fontSize="small" /> :
                          format === 'chart' ? <BarChartIcon fontSize="small" /> :
                          format === 'timeline' ? <TimelineIcon fontSize="small" /> :
                          <PieChartIcon fontSize="small" />
                        }
                      />
                    ))}
                  </Box>
                </Box>

                <Typography variant="caption" color="textSecondary" display="block">
                  Update Frequency: {report.frequency}
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<ViewIcon />}
                  onClick={() => handlePreviewReport(report)}
                >
                  Preview
                </Button>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  disabled
                >
                  Generate
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {selectedReport?.icon}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {selectedReport?.name} - Preview
              </Typography>
            </Box>
            <IconButton onClick={handleClosePreview}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {selectedReport && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedReport.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Report Fields
              </Typography>
              <List dense>
                {selectedReport.fields.map((field, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TableChartIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={field} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Sample Data
              </Typography>
              {renderSampleTable(selectedReport)}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button startIcon={<PrintIcon />} disabled>
            Print Preview
          </Button>
          <Button startIcon={<DownloadIcon />} disabled>
            Export Sample
          </Button>
          <Button onClick={handleClosePreview}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsOverview;