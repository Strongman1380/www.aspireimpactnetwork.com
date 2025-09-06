import React from 'react';
import { Card, CardContent, CardActions, Skeleton, Box } from '@mui/material';

interface SkeletonCardProps {
  cardStyles?: any;
  cardContentStyles?: any;
  cardActionStyles?: any;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  cardStyles, 
  cardContentStyles, 
  cardActionStyles 
}) => {
  return (
    <Card sx={cardStyles}>
      <CardContent sx={cardContentStyles}>
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
      </CardContent>
      <CardActions sx={cardActionStyles}>
        <Skeleton variant="rectangular" width="100%" height={32} sx={{ borderRadius: 1 }} />
      </CardActions>
    </Card>
  );
};

export default SkeletonCard;