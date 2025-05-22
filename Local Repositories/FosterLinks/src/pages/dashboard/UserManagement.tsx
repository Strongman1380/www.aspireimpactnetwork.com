import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon
} from '@mui/icons-material';
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase/firebase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: 'admin' | 'worker' | 'foster_parent';
  status: 'active' | 'inactive';
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [isNewUser, setIsNewUser] = useState(true);
  const [password, setPassword] = useState('');
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        showSnackbar('Failed to load users', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Handle adding a new user
  const handleAddUser = () => {
    setCurrentUser({
      email: '',
      firstName: '',
      lastName: '',
      displayName: '',
      role: 'worker',
      status: 'active',
      createdAt: new Date().toISOString()
    });
    
    setPassword('');
    setIsNewUser(true);
    setDialogOpen(true);
  };
  
  // Handle editing a user
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setPassword('');
    setIsNewUser(false);
    setDialogOpen(true);
  };
  
  // Handle deleting a user
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'users', id));
      
      setUsers(users.filter(user => user.id !== id));
      showSnackbar('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Failed to delete user', 'error');
    }
  };
  
  // Handle toggling user status
  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      await setDoc(doc(db, 'users', user.id), {
        ...user,
        status: newStatus
      }, { merge: true });
      
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      ));
      
      showSnackbar(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (error) {
      console.error('Error updating user status:', error);
      showSnackbar('Failed to update user status', 'error');
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      if (name === 'firstName' || name === 'lastName') {
        const firstName = name === 'firstName' ? value as string : currentUser.firstName || '';
        const lastName = name === 'lastName' ? value as string : currentUser.lastName || '';
        
        setCurrentUser({
          ...currentUser,
          [name]: value,
          displayName: `${firstName} ${lastName}`.trim()
        });
      } else {
        setCurrentUser({
          ...currentUser,
          [name]: value
        });
      }
    }
  };
  
  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  // Handle saving a user
  const handleSaveUser = async () => {
    if (!currentUser.email || !currentUser.firstName || !currentUser.lastName || !currentUser.role) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }
    
    if (isNewUser && !password) {
      showSnackbar('Please enter a password for the new user', 'error');
      return;
    }
    
    try {
      if (isNewUser) {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, currentUser.email, password);
        const uid = userCredential.user.uid;
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', uid), {
          ...currentUser,
          id: undefined // Remove id from the data to be saved
        });
        
        const newUser = {
          id: uid,
          ...currentUser
        } as User;
        
        setUsers([...users, newUser]);
        showSnackbar('User created successfully', 'success');
      } else {
        // Update existing user
        if (!currentUser.id) return;
        
        await setDoc(doc(db, 'users', currentUser.id), {
          ...currentUser,
          id: undefined // Remove id from the data to be saved
        }, { merge: true });
        
        setUsers(users.map(user => 
          user.id === currentUser.id ? { ...currentUser } as User : user
        ));
        
        showSnackbar('User updated successfully', 'success');
      }
      
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving user:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        showSnackbar('Email is already in use', 'error');
      } else if (error.code === 'auth/invalid-email') {
        showSnackbar('Invalid email address', 'error');
      } else if (error.code === 'auth/weak-password') {
        showSnackbar('Password is too weak', 'error');
      } else {
        showSnackbar('Failed to save user', 'error');
      }
    }
  };
  
  // Show snackbar message
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Get role display text
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'worker':
        return 'Case Worker';
      case 'foster_parent':
        return 'Foster Parent';
      default:
        return role;
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
            User Management
          </Typography>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleDisplay(user.role)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status} 
                        color={user.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditUser(user)} size="small">
                        <EditIcon />
                      </IconButton>
                      
                      <IconButton onClick={() => handleToggleStatus(user)} size="small">
                        {user.status === 'active' ? <LockIcon /> : <LockOpenIcon />}
                      </IconButton>
                      
                      <IconButton onClick={() => handleDeleteUser(user.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isNewUser ? 'Add User' : 'Edit User'}
        </DialogTitle>
        
        <DialogContent>
          <Grid component="div" container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={currentUser.firstName || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={currentUser.lastName || ''}
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
                value={currentUser.email || ''}
                onChange={handleInputChange}
                required
                disabled={!isNewUser} // Can't change email for existing users
              />
            </Grid>
            
            {isNewUser && (
              <Grid component="div" item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={currentUser.role || 'worker'}
                  onChange={handleInputChange}
                  label="Role"
                >
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="worker">Case Worker</MenuItem>
                  <MenuItem value="foster_parent">Foster Parent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentUser.status || 'active'}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;