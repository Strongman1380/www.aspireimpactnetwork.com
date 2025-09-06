import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './AuthContext';

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  logoName?: string;
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
      if (!currentUser) {
        // User logged out, reset to default theme
        setThemeSettings(defaultThemeSettings);
        return;
      }
      
      try {
        console.log('Fetching theme settings for user:', currentUser.uid);
        const themeDoc = await getDoc(doc(db, 'themes', currentUser.uid));
        
        if (themeDoc.exists()) {
          console.log('Theme settings found:', themeDoc.data());
          setThemeSettings(themeDoc.data() as ThemeSettings);
        } else {
          console.log('No theme settings found, using defaults');
          setThemeSettings(defaultThemeSettings);
        }
      } catch (error) {
        console.error('Error fetching theme settings:', error);
        // On error, reset to defaults
        setThemeSettings(defaultThemeSettings);
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
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
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