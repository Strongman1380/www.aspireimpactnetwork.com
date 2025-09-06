import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';

interface UIContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  isLoading: boolean;
}

const UIContext = createContext<UIContextType>({
  showLoading: () => {},
  hideLoading: () => {},
  showSnackbar: () => {},
  isLoading: false,
});

export const useUI = () => useContext(UIContext);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const showLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <UIContext.Provider value={{ showLoading, hideLoading, showSnackbar, isLoading: loading }}>
      {children}
      
      {/* Global loading indicator */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <CircularProgress color="inherit" />
          {loadingMessage && <div>{loadingMessage}</div>}
        </div>
      </Backdrop>
      
      {/* Global snackbar */}
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
    </UIContext.Provider>
  );
};

export default UIContext;