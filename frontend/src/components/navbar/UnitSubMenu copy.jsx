import React, { useContext } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton
} from '@mui/material';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link, useLocation, useNavigate } from 'react-router';
import { UnitContext } from '../UnitsContext';


export default function UnitSubmenu({
  unitsOpen,
  setUnitsOpen,
  selectedClass,
  currentSchoolYearId,
  handleDeleteUnitClick
}) {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const { units } = useContext(UnitContext);
  const classUnits = units.filter(unit => unit.class_obj === selectedClass?.id);

  const isCalendarView = path.startsWith('/school_year/calendar/')

  return (
    <>
      <ListItemButton sx={{ pl: 1, pr: 1 }} disableRipple selected={path === '/units'}>
        <Box
          onClick={() => navigate('/units')}
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
            <ImportContactsOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Units" />
        </Box>

        <Box
          onClick={(e) => {
            e.stopPropagation();
            setUnitsOpen(!unitsOpen);
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
          {unitsOpen ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </ListItemButton>

      <Collapse in={unitsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {!currentSchoolYearId && (
            <ListItemText
              sx={{ pl: 4, pb: 1, fontStyle: 'italic', color: 'text.secondary' }}
              primary="Select a school year to view associated classes."
            />
          )}

          {currentSchoolYearId && !selectedClass && (
            <ListItemText
              sx={{ pl: 4, pb: 1, fontStyle: 'italic', color: 'text.secondary' }}
              primary="Please select a class to view its units."
            />
          )}

          {currentSchoolYearId && selectedClass && selectedClass.units?.length === 0 && (
            <ListItemText
              sx={{ pl: 4, pb: 1, fontStyle: 'italic', color: 'text.secondary' }}
              primary="This class has no units."
            />
          )}

          {/* {currentSchoolYearId && selectedClass && selectedClass.units?.map(unit => ( */}
		  { selectedClass && selectedClass.units?.map(unit => (
            <ListItemButton
              key={unit.id}
              sx={{ pl: 2 }}
              onClick={() => navigate(`/unit/${unit.id}`)}
            >
              <ListItemIcon>
                <ArrowRightOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="body2">{unit.name}</Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/unit/${unit.id}`);
                        }}
                      >
                        <InfoOutlinedIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/unit/edit/${unit.id}`);
                        }}
                      >
                        <ModeEditIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUnitClick(unit);
                        }}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  </Box>
                }
              />
            </ListItemButton>
          ))}

          {isCalendarView ? (
            <Box id="external-units" sx={{ pl: 2, pr: 2 }}>
              {selectedClass?.units?.map((unit) => (
                <Box
                  key={unit.id}
                  className="fc-event"
                  data-event={JSON.stringify({
                    id: unit.id,
                    title: unit.name,
                    duration: { days: unit.duration },
                    color: unit.color,
                  })}
                  sx={{
                    mb: 1,
                    p: 1,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    backgroundColor: '#f5f5f5',
                    cursor: 'grab',
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">{unit.name}</Typography>
                  <Typography variant="caption">Duration: {unit.duration} day(s)</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            selectedClass?.units?.map((unit) => (
              <ListItemButton
                key={unit.id}
                sx={{ pl: 2 }}
                onClick={() => navigate(`/unit/${unit.id}`)}
              >
                <ListItemIcon>
                  <InfoOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box>
                      <Typography variant="body2">{unit.name}</Typography>
                      <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/unit/edit/${unit.id}`); }}>
                          <ModeEditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteUnitClick(unit); }}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                />
              </ListItemButton>
            ))
          )}

          <ListItemButton sx={{ pl: 4 }} component={Link} to="/unit/create">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="caption">Add Unit</Typography>}
            />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
