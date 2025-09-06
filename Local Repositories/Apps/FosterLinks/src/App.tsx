import React, { Suspense } from 'react';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UIProvider } from './contexts/UIContext';
import AppRouter from './components/AppRouter';

// Loading fallback component
const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}
  >
    <CircularProgress />
  </Box>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthProvider>
        <ThemeProvider>
          <CssBaseline />
          <UIProvider>
            <AppRouter />
          </UIProvider>
        </ThemeProvider>
      </AuthProvider>
    </Suspense>
  );
};

export default App;
