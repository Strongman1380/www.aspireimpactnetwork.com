import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
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
  dob: string;
  address: string;
  mother_name: string;
  father_name: string;
  foster_worker: string;
  probation_info: string;
  siblings: string;
  positive_supports: string;
  medications: Medication[];
}

const YouthDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  const [youth, setYouth] = useState<YouthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedYouth, setEditedYouth] = useState<YouthProfile | null>(null);
  
  // Medication dialog state
  const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null);
  const [isNewMedication, setIsNewMedication] = useState(false);
  
  // Fetch youth data
  useEffect(() => {
    const fetchYouthData = async () => {
      if (!id) return;
      
      try {
        const youthDoc = await getDoc(doc(db, 'youth_profiles', id));
        
        if (youthDoc.exists()) {
          const youthData = { id: youthDoc.id, ...youthDoc.data() } as YouthProfile;
          setYouth(youthData);
          setEditedYouth(youthData);
        } else {
          console.error('Youth profile not found');
        }
      } catch (error) {
        console.error('Error fetching youth data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchYouthData();
  }, [id]);
  
  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedYouth) return;
    
    const { name, value } = e.target;
    setEditedYouth({
      ...editedYouth,
      [name]: value
    });
  };
  
  // Save youth profile
  const handleSave = async () => {
    if (!editedYouth || !id) return;
    
    try {
      await updateDoc(doc(db, 'youth_profiles', id), {
        ...editedYouth,
        // Remove id from the data to be saved
        id: undefined
      });
      
      setYouth(editedYouth);
      setEditing(false);
    } catch (error) {
      console.error('Error updating youth profile:', error);
    }
  };
  
  // Medication handlers
  const handleAddMedication = () => {
    setCurrentMedication({
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      instructions: ''
    });
    setIsNewMedication(true);
    setMedicationDialogOpen(true);
  };
  
  const handleEditMedication = (medication: Medication) => {
    setCurrentMedication(medication);
    setIsNewMedication(false);
    setMedicationDialogOpen(true);
  };
  
  const handleDeleteMedication = (medicationId: string) => {
    if (!editedYouth) return;
    
    const updatedMedications = editedYouth.medications.filter(
      med => med.id !== medicationId
    );
    
    setEditedYouth({
      ...editedYouth,
      medications: updatedMedications
    });
  };
  
  const handleMedicationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentMedication) return;
    
    const { name, value } = e.target;
    setCurrentMedication({
      ...currentMedication,
      [name]: value
    });
  };
  
  const handleSaveMedication = () => {
    if (!editedYouth || !currentMedication) return;
    
    let updatedMedications;
    
    if (isNewMedication) {
      updatedMedications = [...(editedYouth.medications || []), currentMedication];
    } else {
      updatedMedications = editedYouth.medications.map(med => 
        med.id === currentMedication.id ? currentMedication : med
      );
    }
    
    setEditedYouth({
      ...editedYouth,
      medications: updatedMedications
    });
    
    setMedicationDialogOpen(false);
    setCurrentMedication(null);
  };
  
  // Navigate to medication log
  const handleViewMedicationLog = () => {
    if (id) {
      navigate(`/medication-logs/${id}`);
    }
  };
  
  if (loading) {
    return <Typography>Loading youth profile...</Typography>;
  }
  
  if (!youth) {
    return <Typography>Youth profile not found</Typography>;
  }
  
  const isReadOnly = userRole === 'foster_parent';
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">
            {youth.first_name} {youth.last_name}
          </Typography>
          
          {!isReadOnly && (
            <Button 
              variant="contained" 
              color={editing ? "primary" : "secondary"}
              onClick={() => editing ? handleSave() : setEditing(true)}
            >
              {editing ? "Save" : "Edit"}
            </Button>
          )}
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Basic Information</Typography>
            
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="first_name"
              value={editing ? editedYouth?.first_name : youth.first_name}
              onChange={handleInputChange}
              disabled={!editing || isReadOnly}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="last_name"
              value={editing ? editedYouth?.last_name : youth.last_name}
              onChange={handleInputChange}
              disabled={!editing || isReadOnly}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Date of Birth"
              name="dob"
              type="date"
              value={editing ? editedYouth?.dob : youth.dob}
              onChange={handleInputChange}
              disabled={!editing || isReadOnly}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              value={editing ? editedYouth?.address : youth.address}
              onChange={handleInputChange}
              disabled={!editing || isReadOnly}
            />
          </Grid>
          
          {/* Family Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Family Information</Typography>
            
            <TextField
              fullWidth
              margin="normal"
              label="Mother's Name"
              name="mother_name"
              value={editing ? editedYouth?.mother_name : youth.mother_name}
              onChange={handleInputChange}
              disabled={!editing || isReadOnly}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Father's Name"
              name="father_name"
              value={editing ? editedYouth?.father_name : youth.father_name}
              onChange={handleInputChange}
              disabled={!editing || isReadOnly}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Foster Care Specialist"
              name="foster_worker"
              value={editing ? editedYouth?.foster_worker : youth.foster_worker}
              onChange={handleInputChange}
              disabled={!editing || isReadOnly}
            />
          </Grid>
          
          {/* Additional Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Additional Information</Typography>
            
            <TextField
              fullWidth
              margin="normal"
              label="Probation Officer Information"
              name="probation_info"
              multiline
              rows={3}
              value={editing ? editedYouth?.probation_info : youth.probation_info}
              onChange={handleInputChange}
              disabled={!editing || isReadOnly}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Siblings"
              name="siblings"
              multiline
              rows={3}
              value={editing ? editedYouth?.siblings : youth.siblings}
              onChange={handleInputChange}
              disabled={!editing || isReadOnly}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Positive Supports"
              name="positive_supports"
              multiline
              rows={3}
              value={editing ? editedYouth?.positive_supports : youth.positive_supports}
              onChange={handleInputChange}
              disabled={!editing || isReadOnly}
            />
          </Grid>
          
          {/* Medications */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Medications</Typography>
              
              <Box>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleViewMedicationLog}
                  sx={{ mr: 1 }}
                >
                  View Medication Log
                </Button>
                
                {editing && !isReadOnly && (
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={handleAddMedication}
                  >
                    Add Medication
                  </Button>
                )}
              </Box>
            </Box>
            
            <List>
              {(editing ? editedYouth?.medications : youth.medications)?.map((medication) => (
                <Paper key={medication.id} sx={{ mb: 2, p: 2 }}>
                  <ListItem
                    secondaryAction={
                      editing && !isReadOnly ? (
                        <>
                          <IconButton edge="end" onClick={() => handleEditMedication(medication)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDeleteMedication(medication.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ) : null
                    }
                  >
                    <ListItemText
                      primary={medication.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Dosage: {medication.dosage}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Frequency: {medication.frequency}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Instructions: {medication.instructions}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
              
              {(!youth.medications || youth.medications.length === 0) && (
                <Typography variant="body2" color="textSecondary">
                  No medications recorded
                </Typography>
              )}
            </List>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Medication Dialog */}
      <Dialog open={medicationDialogOpen} onClose={() => setMedicationDialogOpen(false)}>
        <DialogTitle>
          {isNewMedication ? 'Add Medication' : 'Edit Medication'}
        </DialogTitle>
        
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Medication Name"
            name="name"
            value={currentMedication?.name || ''}
            onChange={handleMedicationChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Dosage"
            name="dosage"
            value={currentMedication?.dosage || ''}
            onChange={handleMedicationChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Frequency"
            name="frequency"
            value={currentMedication?.frequency || ''}
            onChange={handleMedicationChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Instructions"
            name="instructions"
            multiline
            rows={3}
            value={currentMedication?.instructions || ''}
            onChange={handleMedicationChange}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setMedicationDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMedication} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default YouthDashboard;