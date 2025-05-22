import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container, 
  Link, 
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password || !confirmPassword || !firstName || !lastName || !role) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      console.log('Starting user registration process...');
      
      // Create user in Firebase Auth
      const user = await signUp(email, password);
      console.log('Firebase Auth user created successfully:', user.uid);
      
      try {
        // Create user document in Firestore
        console.log('Attempting to create Firestore user document...');
        await setDoc(doc(db, 'users', user.uid), {
          email,
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`,
          role,
          createdAt: new Date().toISOString()
        });
        console.log('Firestore user document created successfully');
        
        // Redirect to login page
        navigate('/login');
      } catch (firestoreError: any) {
        console.error('Firestore document creation error:', firestoreError);
        setError(`Error creating user profile: ${firestoreError.message}`);
        
        // Even if Firestore fails, the user was created in Auth, so we should redirect
        // They can complete their profile later
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(`Failed to create an account: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Foster Links
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Create your account
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sign Up
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Box>
          
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <MenuItem value="admin">Administrator</MenuItem>
              <MenuItem value="worker">Case Worker</MenuItem>
              <MenuItem value="foster_parent">Foster Parent</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            Password must be at least 6 characters long.
          </Typography>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Box>
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

export default Register;