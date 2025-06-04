import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  Print as PrintIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

interface YouthProfile {
  id: string;
  first_name: string;
  last_name: string;
  medications: Medication[];
}

interface MedicationLogEntry {
  id: string;
  youthId: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  dateTime: string;
  administeredBy: string;
  notes: string;
  timestamp: number;
}

const MedicationLog: React.FC = () => {
  const { youthId } = useParams<{ youthId: string }>();
  const { currentUser, userRole } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [youth, setYouth] = useState<YouthProfile | null>(null);
  const [logs, setLogs] = useState<MedicationLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLog, setCurrentLog] = useState<Partial<MedicationLogEntry>>({});
  const [isNewLog, setIsNewLog] = useState(true);
  
  // Date filter state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Fetch youth data and medication logs
  useEffect(() => {
    const fetchData = async () => {
      if (!youthId) return;
      
      try {
        // Fetch youth profile
        const youthDoc = await getDoc(doc(db, 'youth_profiles', youthId));
        
        if (youthDoc.exists()) {
          const youthData = { id: youthDoc.id, ...youthDoc.data() } as YouthProfile;
          setYouth(youthData);
        } else {
          console.error('Youth profile not found');
        }
        
        // Fetch medication logs
        await fetchMedicationLogs();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [youthId]);
  
  // Fetch medication logs with optional date filtering
  const fetchMedicationLogs = async () => {
    if (!youthId) return;
    
    try {
      let medicationLogsQuery = query(
        collection(db, 'medication_logs'),
        where('youthId', '==', youthId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(medicationLogsQuery);
      
      let logsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MedicationLogEntry[];
      
      // Apply date filters if set
      if (startDate) {
        const startTimestamp = new Date(startDate).getTime();
        logsData = logsData.filter(log => log.timestamp >= startTimestamp);
      }
      
      if (endDate) {
        const endTimestamp = new Date(endDate + 'T23:59:59').getTime();
        logsData = logsData.filter(log => log.timestamp <= endTimestamp);
      }
      
      setLogs(logsData);
    } catch (error) {
      console.error('Error fetching medication logs:', error);
    }
  };
  
  // Handle print functionality
  const handlePrint = useReactToPrint({
    // @ts-ignore - The type definitions for react-to-print are outdated
    content: () => printRef.current,
    documentTitle: `Medication Log - ${youth?.first_name} ${youth?.last_name}`,
  });
  
  // Handle adding a new log
  const handleAddLog = () => {
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16);
    
    setCurrentLog({
      youthId,
      medicationId: '',
      medicationName: '',
      dosage: '',
      dateTime: formattedDateTime,
      administeredBy: currentUser?.displayName || '',
      notes: '',
      timestamp: now.getTime()
    });
    
    setIsNewLog(true);
    setDialogOpen(true);
  };
  
  // Handle editing a log
  const handleEditLog = (log: MedicationLogEntry) => {
    setCurrentLog(log);
    setIsNewLog(false);
    setDialogOpen(true);
  };
  
  // Handle deleting a log
  const handleDeleteLog = async (logId: string) => {
    if (!window.confirm('Are you sure you want to delete this medication log?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'medication_logs', logId));
      setLogs(logs.filter(log => log.id !== logId));
    } catch (error) {
      console.error('Error deleting medication log:', error);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | 
    { target: { name: string; value: unknown } }
  ) => {
    const { name, value } = e.target;
    
    if (name === 'medicationId' && youth) {
      const selectedMedication = youth.medications.find(med => med.id === value);
      
      if (selectedMedication) {
        setCurrentLog({
          ...currentLog,
          medicationId: value as string,
          medicationName: selectedMedication.name,
          dosage: selectedMedication.dosage
        });
      }
    } else if (name) {
      setCurrentLog({
        ...currentLog,
        [name]: value
      });
    }
  };
  
  // Handle saving a log
  const handleSaveLog = async () => {
    if (!currentLog.medicationId || !currentLog.dateTime) {
      alert('Please select a medication and date/time');
      return;
    }
    
    try {
      const timestamp = new Date(currentLog.dateTime).getTime();
      
      if (isNewLog) {
        const docRef = await addDoc(collection(db, 'medication_logs'), {
          ...currentLog,
          timestamp
        });
        
        const newLog = {
          id: docRef.id,
          ...currentLog,
          timestamp
        } as MedicationLogEntry;
        
        setLogs([newLog, ...logs]);
      } else {
        if (!currentLog.id) return;
        
        await updateDoc(doc(db, 'medication_logs', currentLog.id), {
          ...currentLog,
          timestamp
        });
        
        setLogs(logs.map(log => 
          log.id === currentLog.id 
            ? { ...currentLog, timestamp } as MedicationLogEntry 
            : log
        ));
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving medication log:', error);
    }
  };
  
  // Handle date filter changes
  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };
  
  // Apply date filters
  const applyDateFilters = () => {
    fetchMedicationLogs();
  };
  
  // Reset date filters
  const resetDateFilters = () => {
    setStartDate('');
    setEndDate('');
    fetchMedicationLogs();
  };
  
  if (loading) {
    return <Typography>Loading medication logs...</Typography>;
  }
  
  if (!youth) {
    return <Typography>Youth profile not found</Typography>;
  }
  
  const canEdit = userRole === 'admin' || userRole === 'worker' || userRole === 'foster_parent';
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">
            Medication Log: {youth.first_name} {youth.last_name}
          </Typography>
          
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<PrintIcon />} 
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            
            {canEdit && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleAddLog}
              >
                Add Log
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Date Filters */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Filter by Date</Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="startDate"
                value={startDate}
                onChange={handleDateFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="endDate"
                value={endDate}
                onChange={handleDateFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button 
                variant="contained" 
                onClick={applyDateFilters}
                sx={{ mr: 1 }}
              >
                Apply Filters
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={resetDateFilters}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Medication Logs Table */}
        <div ref={printRef}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Medication</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Administered By</TableCell>
                  <TableCell>Notes</TableCell>
                  {canEdit && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {new Date(log.dateTime).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.medicationName}</TableCell>
                      <TableCell>{log.dosage}</TableCell>
                      <TableCell>{log.administeredBy}</TableCell>
                      <TableCell>{log.notes}</TableCell>
                      {canEdit && (
                        <TableCell>
                          <IconButton onClick={() => handleEditLog(log)} size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteLog(log.id)} size="small">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={canEdit ? 6 : 5} align="center">
                      No medication logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
      
      {/* Add/Edit Log Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {isNewLog ? 'Add Medication Log' : 'Edit Medication Log'}
        </DialogTitle>
        
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="medication-select-label">Medication</InputLabel>
            <Select
              labelId="medication-select-label"
              name="medicationId"
              value={currentLog.medicationId || ''}
              onChange={handleInputChange}
              label="Medication"
            >
              {youth.medications?.map((medication) => (
                <MenuItem key={medication.id} value={medication.id}>
                  {medication.name} ({medication.dosage})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            margin="normal"
            label="Date & Time"
            name="dateTime"
            type="datetime-local"
            value={currentLog.dateTime || ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Administered By"
            name="administeredBy"
            value={currentLog.administeredBy || ''}
            onChange={handleInputChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Notes"
            name="notes"
            multiline
            rows={3}
            value={currentLog.notes || ''}
            onChange={handleInputChange}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveLog} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicationLog;