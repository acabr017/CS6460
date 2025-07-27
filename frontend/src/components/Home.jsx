import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          The Long View
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          Welcome to tthe Long View - a year-long curriculum planning utility.
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Use this tool to create and manage your school years, register your classes,
          and plan curriculum units on an interactive calendar.
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          💡 To get started:
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          • Go to <strong>School Years</strong> to create a school year. You can include out-of-service/non-instructional dates, as well as define terms.<br />
          • Register <strong>Classes</strong> and attach them to a school year.<br />
          • Create <strong>Units</strong>, register them to a class, and drag them onto the calendar to schedule them.<br />
        </Typography>

        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          All your data is synced between the calendar and unit views.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home;