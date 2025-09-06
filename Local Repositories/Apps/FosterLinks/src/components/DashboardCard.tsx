import React, { memo } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

interface DashboardCardProps {
  title: string;
  count: number | null;
  buttonText: string;
  onButtonClick: () => void;
  cardStyles: any;
  cardContentStyles: any;
  cardActionStyles: any;
  statNumberStyles: any;
}

const DashboardCard: React.FC<DashboardCardProps> = memo(({ 
  title, 
  count, 
  buttonText, 
  onButtonClick,
  cardStyles,
  cardContentStyles,
  cardActionStyles,
  statNumberStyles
}) => {
  return (
    <Card sx={cardStyles}>
      <CardContent sx={cardContentStyles}>
        <Typography color="textSecondary" variant="body2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div" sx={statNumberStyles}>
          {count !== null ? count : '...'}
        </Typography>
      </CardContent>
      <CardActions sx={cardActionStyles}>
        <Button 
          size="small" 
          onClick={onButtonClick}
          fullWidth
          sx={{ textTransform: 'none' }}
        >
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
});

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;