import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './AuthContext';

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
}

interface ThemeContextType {
  themeSettings: ThemeSettings;
  updateThemeSettings: (newSettings: ThemeSettings) => Promise<void>;
}

const defaultThemeSettings: ThemeSettings = {
  mode: 'light',
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e'
};

const ThemeContext = createContext<ThemeContextType>({
  themeSettings: defaultThemeSettings,
  updateThemeSettings: async () => {}
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const { currentUser } = useAuth();

  // Fetch user theme settings
  useEffect(() => {
    const fetchThemeSettings = async () => {
      if (!currentUser) return;
      
      try {
        console.log('Fetching theme settings for user:', currentUser.uid);
        const themeDoc = await getDoc(doc(db, 'themes', currentUser.uid));
        
        if (themeDoc.exists()) {
          console.log('Theme settings found:', themeDoc.data());
          setThemeSettings(themeDoc.data() as ThemeSettings);
        } else {
          console.log('No theme settings found, using defaults');
        }
      } catch (error) {
        console.error('Error fetching theme settings:', error);
      }
    };
    
    fetchThemeSettings();
  }, [currentUser]);

  // Determine actual mode based on system preference if needed
  const getActualMode = () => {
    if (themeSettings.mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeSettings.mode;
  };

  // Create MUI theme based on settings
  const theme = createTheme({
    palette: {
      mode: getActualMode() as 'light' | 'dark',
      primary: {
        main: themeSettings.primaryColor,
      },
      secondary: {
        main: themeSettings.secondaryColor,
      },
    },
  });

  // Update theme settings
  const updateThemeSettings = async (newSettings: ThemeSettings) => {
    if (!currentUser) return;
    
    try {
      // Update Firestore
      await setDoc(doc(db, 'themes', currentUser.uid), newSettings);
      
      // Update local state
      setThemeSettings(newSettings);
      console.log('Theme settings updated successfully');
    } catch (error) {
      console.error('Error updating theme settings:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider value={{ themeSettings, updateThemeSettings }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;