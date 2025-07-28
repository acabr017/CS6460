import React, { useState, useContext, useEffect, useRef } from 'react';
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
import { ClassContext } from '../ClassContext';
import { useSelectedClass } from '../SelectedClassContext';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { SketchPicker } from 'react-color';
import Popover from '@mui/material/Popover';
import AxiosInstance from '../axios';
import { Draggable } from '@fullcalendar/interaction';
import dayjs from 'dayjs';


export default function UnitSubmenu({
  unitsOpen,
  setUnitsOpen,
  // selectedClass,
  currentSchoolYearId,
  handleDeleteUnitClick
}) {

  const navigate = useNavigate();
  const path = useLocation().pathname;
  const { units, fetchUnits } = useContext(UnitContext);
  const { selectedClassId } = useSelectedClass();
  const { classes } = useContext(ClassContext);

  const selectedClass = classes.find(cls => cls.id === selectedClassId);
  const classUnits = units.filter(unit => unit.class_obj === selectedClass?.id);

  const isCalendarView = path.startsWith('/school_year/calendar/')

  const [anchorEl, setAnchorEl] = useState(null);
  const [colorPickerUnitId, setColorPickerUnitId] = useState(null);

  const hasInitializedDrag = useRef(false);

  const openColorPicker = (event, unitId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setColorPickerUnitId(unitId);
  };

  const closeColorPicker = () => {
    setAnchorEl(null);
    setColorPickerUnitId(null);
  };

  const handleColorChange = async (color, unit) => {
    closeColorPicker();

    
    await AxiosInstance.patch(`/unit/${unit.id}/`, { color: color.hex });

    await fetchUnits();
  };


  useEffect(() => {
  const isCalendarView = path.startsWith('/school_year/calendar/');
    if (!isCalendarView || !unitsOpen || !selectedClass || hasInitializedDrag.current) return;

    const timeoutId = setTimeout(() => {
      const containerEl = document.getElementById('external-units');
      if (containerEl && containerEl.children.length > 0) {
        new Draggable(containerEl, {
          itemSelector: '.fc-event',
          eventData: (eventEl) => {
            const data = JSON.parse(eventEl.getAttribute('data-event'));
            const length = data.length || 1;
            console.log("checking data:", data);
            return {
              ...data,
              start: new Date(),
              end: dayjs().add(length, 'day').toDate(),
              allDay: true,
              backgroundColor: data.color || '#3788d8',
              borderColor: data.color || '#3788d8',
            };
          },
        });

        hasInitializedDrag.current = true;  // Prevent duplicate initialization
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [unitsOpen, units, selectedClass, path]);

  const buildEvent = (unit) => {
		const start = unit.start_date;
		const end = dayjs(start).add(unit.length || 1, 'day').format('YYYY-MM-DD');

		return {
			id: unit.id,
			title: unit.name,
			start,
			end,
			backgroundColor: unit.color,
			borderColor: unit.color,
		};
		};

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
		      {/* {selectedClass?.units?.map((unit) => { */}
          {isCalendarView ? (
            <div id="external-units">
              {classUnits.map((unit) => {
                const wrapperProps = {
                  className: 'fc-event',
                  'data-event': JSON.stringify({
                    id: unit.id,
                    title: unit.name,
                    length: unit.length,
                    duration: { days: unit.length || 1 },
                    color: unit.color || '#3788d8',
                  }),
                  sx: {
                    mb: 1,
                    mx: 2,
                    p: 1,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    backgroundColor: unit.color || '#f5f5f5',
                    cursor: 'grab',
                    userSelect: 'none',
                    WebkitUserDrag: 'element',
                  },
                };

                return (
                  <Box key={unit.id} {...wrapperProps}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        width: '100%',
                        backgroundColor: `${unit.color || '#f5f5f5'} !important`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        {unit.name}
                      </Typography>
                      <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/unit/${unit.id}`); }}>
                          <InfoOutlinedIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/unit/edit/${unit.id}`); }}>
                          <ModeEditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteUnitClick(unit); }}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => openColorPicker(e, unit.id)}>
                          <ColorLensIcon fontSize="inherit" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </div>
          ) : (
            // Fallback rendering for non-calendar views
            classUnits.map((unit) => (
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

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closeColorPicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {colorPickerUnitId && (
          <SketchPicker
            color={
              selectedClass?.units?.find(u => u.id === colorPickerUnitId)?.color || '#f5f5f5'
            }
            onChangeComplete={(color) =>
              handleColorChange(
                color,
                selectedClass.units.find(u => u.id === colorPickerUnitId)
              )
            }
          />
        )}
      </Popover>
    </>
  );
}
