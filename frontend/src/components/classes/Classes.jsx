import React, { useContext } from 'react';
import { Link } from 'react-router';
import { ClassContext } from '../ClassContext';
import { UnitContext } from '../UnitsContext';
import { SchoolYearContext } from '../SchoolYearContext';
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  IconButton,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import AxiosInstance from '../axios';

const Classes = () => {
  const { classes, fetchClasses } = useContext(ClassContext);
  const { units } = useContext(UnitContext);
  const { schoolYears } = useContext(SchoolYearContext);
  const navigate = useNavigate();

  const getSchoolYearName = (schoolYearId) => {
    const match = schoolYears.find((sy) => sy.id === schoolYearId);
    return match ? match.schoolyear : 'Unassigned';
  };

  const handleDeleteClass = async (classId) => {
    const confirmed = window.confirm("Are you sure you want to delete this class?");
    if (!confirmed) return;

    try {
      await AxiosInstance.delete(`/class/${classId}/`);
      await fetchClasses(); // refresh class list
    } catch (error) {
      console.error("Failed to delete class:", error);
    }
  };

   return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Classes
      </Typography>
      {classes.map((cls) => {
        const classUnits = units.filter((unit) => unit.class_obj === cls.id);
        const schoolYear = getSchoolYearName(cls.school_year);

        return (
         <Paper key={cls.id} sx={{ p: 3, mb: 4 }} elevation={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Left: Class Name & School Year */}
            <Box>
              <Typography
                variant="h6"
                component={Link}
                to={`/class/${cls.id}`}
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {cls.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {schoolYear}
              </Typography>
            </Box>

            {/* Right: Edit/Delete Icons */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <IconButton
                size="small"
                onClick={() => navigate(`/class/edit/${cls.id}`)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                   handleDeleteClass(cls.id)
                }}
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <List dense>
            {classUnits.length > 0 ? (
              classUnits.map((unit) => (
                <ListItem key={unit.id}>
                  <ListItemText primary={unit.name} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary={<em>No units added yet.</em>}
                  primaryTypographyProps={{ color: 'text.disabled' }}
                />
              </ListItem>
            )}
          </List>
        </Paper>
        );
      })}
    </Box>
  );
};

export default Classes;