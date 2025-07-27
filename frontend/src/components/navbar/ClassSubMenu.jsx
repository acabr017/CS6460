import React from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import ClassIcon from '@mui/icons-material/Class';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useLocation } from 'react-router';
import { useSelectedClass } from '../SelectedClassContext';

const ClassSubmenu = ({
  classesForSchoolYear,
  currentSchoolYearId,
  classesOpen,
  setClassesOpen,
  // selectedClassId,
  // setSelectedClassId,
  handleDeleteClassClick,
  navigate,
  path
}) => {
  const { selectedClassId, setSelectedClassId } = useSelectedClass();
  const location = useLocation();
//   const path = location.pathname;
//   const classesForSchoolYear = currentSchoolYearId ? classes.filter(cls => cls.school_year === currentSchoolYearId) : [];

  return (
    <>
      <ListItemButton sx={{ pl: 1, pr: 1 }} disableRipple selected={path === '/classes'}>
        <Box
          onClick={() => navigate('/classes')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
            borderRadius: 1,
            pl: 1,
            pr: 1,
            py: 0.5
          }}
        >
          <ListItemIcon>
            <ClassIcon />
          </ListItemIcon>
          <ListItemText primary="Classes" />
        </Box>

        <Box
          onClick={(e) => {
            e.stopPropagation();
            setClassesOpen(!classesOpen);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            px: 1,
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' },
            borderRadius: 1
          }}
        >
          {classesOpen ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </ListItemButton>

      <Collapse in={classesOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {!path.includes('/school_year/calendar/') && (
            <ListItemText
              sx={{ pl: 4, pb: 1, fontStyle: 'italic', color: 'text.secondary' }}
              primary="Select a school year to view associated classes."
            />
          )}

          {currentSchoolYearId && classesForSchoolYear.length > 0 && (
            classesForSchoolYear.map(cls => (
              <ListItemButton
                key={cls.id}
                sx={{ pl: 2 }}
                selected={selectedClassId === cls.id}
                onClick={() => setSelectedClassId(cls.id)}
              >
                <ListItemIcon>
                  <ArrowRightOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        px: 1,
                        py: 0.5
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        {cls.name}
                      </Typography>
                      <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/class/${cls.id}`);
                          }}
                        >
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/class/edit/${cls.id}`);
                          }}
                        >
                          <ModeEditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClassClick(cls);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                />
              </ListItemButton>
            ))
          )}

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/class/create">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="caption">Add Class</Typography>}
            />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
};

export default ClassSubmenu;