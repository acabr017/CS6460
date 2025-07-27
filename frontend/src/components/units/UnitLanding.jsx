import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import { useParams } from 'react-router';
import AxiosInstance from '../axios';
import { ClassContext } from '../ClassContext';

const UnitLanding = () => {
  const { id } = useParams(); // unit id from the URL
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const { classes } = useContext(ClassContext);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await AxiosInstance.get(`/unit/${id}/`);
        setUnit(response.data);
      } catch (error) {
        console.error('Failed to fetch unit:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [id]);

  const getClassName = (classId) => {
    const match = classes.find(cls => cls.id === classId);
    return match ? match.name : 'Unknown Class';
  };

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (!unit) return <Typography sx={{ m: 4 }}>Unit not found.</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {unit.name}
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Class: {getClassName(unit.class_obj)}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Duration:</strong> {unit.length} day(s)
        </Typography>

        <Typography variant="body1">
          <strong>Placement:</strong>{' '}
          {unit.start_date
            ? `Placed starting on ${unit.start_date}`
            : 'Not placed on calendar'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default UnitLanding;