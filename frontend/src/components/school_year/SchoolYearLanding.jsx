import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router';
import AxiosInstance from '../axios';
import {
  Typography,
  Paper,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ClassContext } from '../ClassContext';

const SchoolYearLanding = () => {
  const { id } = useParams();
  const [schoolYear, setSchoolYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const { classes } = useContext(ClassContext);

  useEffect(() => {
    const fetchSchoolYear = async () => {
      try {
        const response = await AxiosInstance.get(`schoolyear/${id}/`);
        setSchoolYear(response.data);
      } catch (error) {
        console.error('Error fetching school year:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolYear();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!schoolYear) return <p>School year not found.</p>;

  const registeredClasses = classes.filter(cls => cls.school_year === schoolYear.id);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>{schoolYear.schoolyear}</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Dates</Typography>
        <Typography>Start: {schoolYear.start_date}</Typography>
        <Typography>End: {schoolYear.end_date}</Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Terms</Typography>
        {schoolYear.terms?.length > 0 ? (
          <List>
            {schoolYear.terms.map(term => (
              <ListItem key={term.id}>
                <ListItemText
                  primary={term.name}
                  secondary={`${term.start_date} – ${term.end_date}`}
                />
              </ListItem>
            ))}
          </List>
        ) : <Typography>No terms defined.</Typography>}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Out of Service Dates</Typography>
			{schoolYear.out_of_service_days?.length > 0 ? (
		<List>
			{[...schoolYear.out_of_service_days]
			.sort((a, b) => new Date(a.date) - new Date(b.date))
			.map(day => (
				<ListItem key={day.id}>
				<ListItemText primary={day.date} />
				</ListItem>
			))}
		</List>
		) : <Typography>No out-of-service days listed.</Typography>}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Registered Classes</Typography>
        {registeredClasses.length > 0 ? (
          <List>
            {registeredClasses.map(cls => (
              <ListItem key={cls.id}>
                <ListItemText
                  primary={
                    <Link to={`/class/${cls.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                      {cls.name}
                    </Link>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : <Typography>No classes registered to this year.</Typography>}
      </Paper>
    </Box>
  );
};

export default SchoolYearLanding;