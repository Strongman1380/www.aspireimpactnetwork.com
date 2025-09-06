import React, { useEffect, useState } from 'react';
import { Box, Fade, Zoom } from '@mui/material';
import { useAppTheme } from '../contexts/ThemeContext';

interface ThemeTransitionProps {
  children: React.ReactNode;
}

const ThemeTransition: React.FC<ThemeTransitionProps> = ({ children }) => {
  const { themeSettings } = useAppTheme();
  const [key, setKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [themeSettings.primaryColor, themeSettings.secondaryColor, themeSettings.mode]);

  return (
    <Box
      sx={{
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, ${themeSettings.primaryColor}10, ${themeSettings.secondaryColor}10)`,
          opacity: isTransitioning ? 0.3 : 0,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: 'none',
          zIndex: 1000,
        }
      }}
    >
      <Fade in={!isTransitioning} timeout={300}>
        <Box key={key}>
          {children}
        </Box>
      </Fade>
    </Box>
  );
};

export default ThemeTransition;