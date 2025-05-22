import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  CircularProgress,
  Paper
} from '@mui/material';
import { 
  Person as PersonIcon, 
  MedicalServices as MedicationIcon, 
  Note as NoteIcon, 
  Assignment as ReportIcon 
} from '@mui/icons-material';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';

interface ActivityItem {
  id: string;
  type: 'user' | 'youth' | 'medication' | 'report';
  title: string;
  description: string;
  timestamp: number;
  userId: string;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { userRole, currentUser } = useAuth();
  
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        console.log('Fetching recent activity...');
        const activityItems: ActivityItem[] = [];
        
        // Fetch recent user activities (for admins only)
        if (userRole === 'admin') {
          const userQuery = query(
            collection(db, 'users'),
            orderBy('createdAt', 'desc'),
            limit(3)
          );
          
          const userSnapshot = await getDocs(userQuery);
          
          userSnapshot.forEach(doc => {
            const userData = doc.data();
            activityItems.push({
              id: doc.id,
              type: 'user',
              title: 'New User',
              description: `${userData.displayName || userData.email} joined as ${userData.role}`,
              timestamp: new Date(userData.createdAt).getTime(),
              userId: userData.id || doc.id
            });
          });
        }
        
        // Fetch recent medication logs
        let medicationQuery;
        
        if (userRole === 'foster_parent' && currentUser) {
          medicationQuery = query(
            collection(db, 'medication_logs'),
            orderBy('timestamp', 'desc'),
            limit(5)
          );
        } else {
          medicationQuery = query(
            collection(db, 'medication_logs'),
            orderBy('timestamp', 'desc'),
            limit(5)
          );
        }
        
        const medicationSnapshot = await getDocs(medicationQuery);
        
        medicationSnapshot.forEach(doc => {
          const logData = doc.data();
          activityItems.push({
            id: doc.id,
            type: 'medication',
            title: 'Medication Log',
            description: `${logData.medicationName} administered by ${logData.administeredBy}`,
            timestamp: logData.timestamp,
            userId: logData.administeredBy
          });
        });
        
        // Sort all activities by timestamp
        activityItems.sort((a, b) => b.timestamp - a.timestamp);
        
        // Take only the 5 most recent activities
        setActivities(activityItems.slice(0, 5));
        console.log('Recent activity fetched successfully');
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchRecentActivity();
    } else {
      setLoading(false);
    }
  }, [currentUser, userRole]);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <PersonIcon />;
      case 'youth':
        return <PersonIcon />;
      case 'medication':
        return <MedicationIcon />;
      case 'report':
        return <ReportIcon />;
      default:
        return <NoteIcon />;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user':
        return '#3f51b5'; // Indigo
      case 'youth':
        return '#2196f3'; // Blue
      case 'medication':
        return '#f44336'; // Red
      case 'report':
        return '#4caf50'; // Green
      default:
        return '#9e9e9e'; // Grey
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      
      {activities.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No recent activity to display.
        </Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" display="block" color="textSecondary">
                        {new Date(activity.timestamp).toLocaleString()}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default RecentActivity;