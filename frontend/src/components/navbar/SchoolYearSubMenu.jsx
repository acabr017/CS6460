import React, { useContext } from 'react';
import {
  Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography, Box, IconButton
} from '@mui/material';
import { Link } from 'react-router'; 
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { SchoolYearContext } from '../SchoolYearContext';

const SchoolYearSubmenu = ({ schoolYearOpen, setSchoolYearOpen, path, navigate, handleDeleteClick }) => {
  const { schoolYears = [] } = useContext(SchoolYearContext);

  return (
    <>
      <ListItemButton sx={{ pl: 1, pr: 1 }} disableRipple selected={path === '/school_years'}>
        <Box onClick={() => navigate('/school_years')} sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }, borderRadius: 1, pl: 1, pr: 1, py: 0.5 }}>
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText primary="School Years" />
        </Box>
        <Box onClick={(e) => { e.stopPropagation(); setSchoolYearOpen(!schoolYearOpen); }} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', px: 1, '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }, borderRadius: 1 }}>
          {schoolYearOpen ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </ListItemButton>

      <Collapse in={schoolYearOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {schoolYears.map((year) => (
            <ListItemButton
              key={year.id}
              sx={{ pl: 2 }}
              selected={
                path.includes(`/school_year/${year.id}`) &&
                !path.includes(`/school_year/edit/${year.id}`) &&
                !path.includes(`/school_year/calendar/${year.id}`)
              }
              onClick={() => navigate(`/school_year/calendar/${year.id}`)}
            >
              <ListItemIcon>
                <ArrowRightOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" align="center" sx={{ fontWeight: 500 }}>{year.schoolyear}</Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/school_year/${year.id}`); }}>
                        <InfoOutlinedIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/school_year/edit/${year.id}`); }}>
                        <ModeEditIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteClick(year); }}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  </Box>
                }
              />
            </ListItemButton>
          ))}

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/school_year/create">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={<Typography variant="caption">Add School Year</Typography>} />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
};

export default SchoolYearSubmenu;