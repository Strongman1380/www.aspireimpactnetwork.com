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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface FosterParent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  capacity: number;
  current_placements: number;
}

const FosterParents: React.FC = () => {
  const [fosterParents, setFosterParents] = useState<FosterParent[]>([]);
  const [filteredParents, setFilteredParents] = useState<FosterParent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentParent, setCurrentParent] = useState<Partial<FosterParent>>({});
  const [isNewParent, setIsNewParent] = useState(true);
  
  const { userRole } = useAuth();
  
  // Fetch foster parents
  useEffect(() => {
    const fetchFosterParents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'foster_parents'));
        
        const parents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FosterParent[];
        
        setFosterParents(parents);
        setFilteredParents(parents);
      } catch (error) {
        console.error('Error fetching foster parents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFosterParents();
  }, []);
  
  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredParents(fosterParents);
    } else {
      const filtered = fosterParents.filter(
        parent => 
          parent.first_name.toLowerCase().includes(value) || 
          parent.last_name.toLowerCase().includes(value) ||
          parent.email.toLowerCase().includes(value)
      );
      
      setFilteredParents(filtered);
    }
  };
  
  // Handle adding a new foster parent
  const handleAddParent = () => {
    setCurrentParent({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
      capacity: 2,
      current_placements: 0
    });
    
    setIsNewParent(true);
    setDialogOpen(true);
  };
  
  // Handle editing a foster parent
  const handleEditParent = (parent: FosterParent) => {
    setCurrentParent(parent);
    setIsNewParent(false);
    setDialogOpen(true);
  };
  
  // Handle deleting a foster parent
  const handleDeleteParent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this foster parent?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'foster_parents', id));
      
      setFosterParents(fosterParents.filter(parent => parent.id !== id));
      setFilteredParents(filteredParents.filter(parent => parent.id !== id));
    } catch (error) {
      console.error('Error deleting foster parent:', error);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | 
    { target: { name: string; value: unknown } }
  ) => {
    const { name, value } = e.target;
    
    if (name) {
      setCurrentParent({
        ...currentParent,
        [name]: value
      });
    }
  };
  
  // Handle saving a foster parent
  const handleSaveParent = async () => {
    if (!currentParent.first_name || !currentParent.last_name || !currentParent.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      if (isNewParent) {
        // Add new foster parent
        const docRef = await addDoc(collection(db, 'foster_parents'), currentParent);
        
        const newParent = {
          id: docRef.id,
          ...currentParent
        } as FosterParent;
        
        setFosterParents([...fosterParents, newParent]);
        setFilteredParents([...filteredParents, newParent]);
      } else {
        // Update existing foster parent
        if (!currentParent.id) return;
        
        await setDoc(doc(db, 'foster_parents', currentParent.id), {
          ...currentParent,
          id: undefined // Remove id from the data to be saved
        }, { merge: true });
        
        setFosterParents(fosterParents.map(parent => 
          parent.id === currentParent.id ? { ...currentParent } as FosterParent : parent
        ));
        
        setFilteredParents(filteredParents.map(parent => 
          parent.id === currentParent.id ? { ...currentParent } as FosterParent : parent
        ));
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving foster parent:', error);
    }
  };
  
  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
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
            Foster Parents
          </Typography>
          
          {(userRole === 'admin' || userRole === 'worker') && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddParent}
            >
              Add Foster Parent
            </Button>
          )}
        </Box>
        
        <TextField
          fullWidth
          margin="normal"
          placeholder="Search by name or email..."
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
        
        {filteredParents.length === 0 ? (
          <Typography align="center" color="textSecondary" sx={{ mt: 4 }}>
            No foster parents found
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredParents.map((parent) => (
              <Grid item xs={12} sm={6} md={4} key={parent.id}>
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
                        <HomeIcon />
                      </IconButton>
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">
                          {parent.first_name} {parent.last_name}
                        </Typography>
                        
                        <Typography variant="body2" color="textSecondary">
                          {parent.email}
                        </Typography>
                      </Box>
                      
                      <Chip 
                        label={parent.status} 
                        color={getStatusColor(parent.status) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Phone:</strong> {parent.phone}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Placements:</strong> {parent.current_placements}/{parent.capacity}
                    </Typography>
                  </CardContent>
                  
                  {(userRole === 'admin' || userRole === 'worker') && (
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        onClick={() => handleEditParent(parent)}
                        sx={{ flexGrow: 1 }}
                      >
                        Edit
                      </Button>
                      
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteParent(parent.id)}
                        sx={{ flexGrow: 1 }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      
      {/* Add/Edit Foster Parent Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isNewParent ? 'Add Foster Parent' : 'Edit Foster Parent'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={currentParent.first_name || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={currentParent.last_name || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={currentParent.email || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={currentParent.phone || ''}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={currentParent.address || ''}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentParent.status || 'active'}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity"
                name="capacity"
                type="number"
                value={currentParent.capacity || 2}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, max: 10 } }}
              />
            </Grid>
            
            {!isNewParent && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Placements"
                  name="current_placements"
                  type="number"
                  value={currentParent.current_placements || 0}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0, max: currentParent.capacity || 10 } }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveParent} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FosterParents;