import React, { useState, useEffect, useContext } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import {Link, useLocation} from 'react-router'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AxiosInstance from '../axios'
import { SchoolYearContext } from '../SchoolYearContext';
import { ClassContext } from '../ClassContext';
import { useNavigate } from 'react-router';
import {
  Box, Button, DialogActions, DialogContent, DialogTitle, Dialog, IconButton, Collapse, ListItemButton, ListItemIcon, ListItemText, ListSubheader, List, Typography
} from '@mui/material';


export default function MyMenu() {

  const { schoolYears, fetchSchoolYears, loading } = useContext(SchoolYearContext);
  const { classes, fetchClasses } = useContext(ClassContext);
  const [schoolYearOpen, setSchoolYearOpen] = React.useState(true);
  const [classesOpen, setClassesOpen] = React.useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const selectedClass = classes.find(cls => cls.id === selectedClassId);
  const [unitsOpen, setUnitsOpen] = React.useState(false);
  const [unregisteredOpen, setUnregisteredOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
	const path = location.pathname
  const schoolYearMatch = path.match(/\/school_year\/calendar\/(\d+)/);
  const currentSchoolYearId = schoolYearMatch ? parseInt(schoolYearMatch[1]) : null;
  const classesForSchoolYear = currentSchoolYearId ? classes.filter(cls => cls.school_year === currentSchoolYearId) : [];

  

  // Dialog Stuff
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const handleDeleteClick = (year) => {
    setSelectedItem(year);
    setDeleteType('schoolYear');
    setOpenDialog(true);
  };
  const handleDeleteClassClick = (cls) => {
    setSelectedItem(cls);
    setDeleteType('class');
    setOpenDialog(true);
  };

  const handleDeleteUnitClick = (unit) => {
    setSelectedItem(unit);
    setDeleteType('unit');
    setOpenDialog(true);
  };

  useEffect(() => {
      fetchSchoolYears();
      fetchClasses();
    }, []);

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setDeleteType(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    try {
      if (deleteType === 'schoolYear') {
        await AxiosInstance.delete(`schoolyear/${selectedItem.id}/`);
        await fetchSchoolYears();
      } else if (deleteType === 'class') {
        await AxiosInstance.delete(`class/${selectedItem.id}/`);
        await fetchClasses();
      } else if (deleteType === 'unit') {
        await AxiosInstance.delete(`unit/${selectedItem.id}/`);
        await fetchClasses(); // Optional: reload related data if unit deletion affects class view
      }

      navigate('/');
    } catch (error) {
      console.error(`Failed to delete ${deleteType}:`, error);
    } finally {
      setOpenDialog(false);
      setSelectedItem(null);
      setDeleteType(null);
    }
  };

  
  return (
	<>
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'transparent' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
           {/* this will change what the menu header title is */}
        </ListSubheader>
      }
    >

    <ListItemButton component={Link} to="/calendar1" selected={path === "/calendar1"}>
        <ListItemIcon>
          <CalendarMonthIcon />
        </ListItemIcon>
        <ListItemText primary={"Calendar #1"} />
      </ListItemButton>


      <ListItemButton sx={{pl:1, pr:1}} disableRipple selected={path === '/school_years'}>
       <Box 
        onClick={() => navigate('/school_years')}
        sx={{
          display:'flex',
          alignItems: 'center',
          flexGrow: 1,
          cursor: 'pointer',
          '&:hover': {backgroundColor: 'rgba(0,0,0,0.04)'},
            borderRadius: 1,
            pl: 1,
            pr: 1,
            py: 0.5
        }}
        >
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="School Years" />
       </Box>

       <Box
        onClick={(e) => {
          e.stopPropagation();
          setSchoolYearOpen(!schoolYearOpen);
        }}
        sx={{
          display:'flex',
          alignItems:'center',
          cursor:'pointer',
          px:1,
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)'},
          borderRadius:1
        }}
        >
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
              onClick={() => navigate(`/school_year/${year.id}`)}
            >
              <ListItemIcon>
                <ArrowRightOutlinedIcon />
              </ListItemIcon>

              <ListItemText
                primary={
                  <Box sx={{ width: '100%' }}>
                    {/* Centered School Year Name */}
                    <Typography
                      variant="subtitle2"
                      align="center"
                      sx={{ fontWeight: 500 }}
                    >
                      {year.schoolyear}
                    </Typography>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        mt: 0.5,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/school_year/calendar/${year.id}`);
                        }}
                      >
                        <CalendarMonthIcon fontSize="inherit" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/school_year/edit/${year.id}`);
                        }}
                      >
                        <ModeEditIcon fontSize="inherit" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(year);
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

          {/* Add School Year Button */}
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/school_year/create">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="caption">
                  Add School Year
                </Typography>
              }
            />
          </ListItemButton>
        </List>
      </Collapse>


      <ListItemButton sx={{pl:1, pr:1}} disableRipple selected={path === '/classes'}>
       <Box 
        onClick={() => navigate('/classes')}
        sx={{
          display:'flex',
          alignItems: 'center',
          flexGrow: 1,
          cursor: 'pointer',
          '&:hover': {backgroundColor: 'rgba(0,0,0,0.04)'},
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
          display:'flex',
          alignItems:'center',
          cursor:'pointer',
          px:1,
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)'},
          borderRadius:1
        }}
        >
          {classesOpen ? <ExpandLess /> : <ExpandMore />}
       </Box>
        
      </ListItemButton>

      <Collapse in={classesOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Show this message if they aren't on a School Year Page */}
          {!path.includes('/school_year/calendar/') && (
            <ListItemText
              sx={{pl:4, pb:1, fontStyle:'italic', color:'text.secondary'}}
              primary="Select a school year to view associated classes."
            />
          )}
          { currentSchoolYearId && classesForSchoolYear.length > 0 && (
            <>
              {classesForSchoolYear.map(cls => (
                
                <ListItemButton
                  key={cls.id}
                  sx={{pl:2}}
                  selected={currentSchoolYearId && selectedClassId === cls.id}
                  onClick={() => {
                    if (currentSchoolYearId) {
                      setSelectedClassId(cls.id);
                    }
                  }}
                >
                  <ListItemIcon>
                  <ArrowRightOutlinedIcon/>
                </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          px: 1, // horizontal padding
                          py: 0.5,
                        }}
                      >
                        {/* Class Name */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                          {cls.name}
                        </Typography>

                        {/* Action Icons */}
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
              ))}
            </>
          )
          }
          {/* <ListItemButton onClick={() => setUnregisteredOpen(!unregisteredOpen)} sx={{pl:4}}>
            <ListItemIcon>
              <ClassOutlinedIcon/>
            </ListItemIcon>
            <ListItemText  
              primary="Unregistered Classes"
              slotProps={{primary: {variant:'body2'}}}
            />
            {unregisteredOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={unregisteredOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {classes.filter((cls) => !cls.school_year).map((cls) => (

                <ListItemButton key={cls.id} sx={{pl:1}} onClick={() => navigate(`/class/${cls.id}`)}>
                  <ListItemIcon>
                    <ArrowRightOutlinedIcon/>
                  </ListItemIcon>

                  <ListItemText 
                    primary={
                      <Box>
                          <Typography variant='body2'>{cls.name}</Typography>

                          <Box
                            sx={{mt: 0.5, display:'flex', gap:1}}
                          >
                            <IconButton
                              size='small'
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/class/${cls.id}`)
                              }}
                            >
                              <InfoOutlinedIcon fontSize='inherit'/>
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/class/edit/${cls.id}`);
                                }}
                              >
                                <ModeEditIcon fontSize="inherit" />
                              </IconButton>
                              
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClassClick(cls);
                                }}
                              >
                                <DeleteIcon  fontSize="inherit"/>
                              </IconButton>
                          </Box>
                      </Box>
                    } />
                </ListItemButton>
              ))}
            </List>
          </Collapse> */}
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/class/create">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="caption">
                  Add Class
                </Typography>
              }
            />
          </ListItemButton>
        </List>
      </Collapse>



          {/* Units    */}
       <ListItemButton sx={{pl:1, pr:1}} disableRipple selected={path === '/units'}>
       <Box 
        onClick={() => navigate('/units')}
        sx={{
          display:'flex',
          alignItems: 'center',
          flexGrow: 1,
          cursor: 'pointer',
          '&:hover': {backgroundColor: 'rgba(0,0,0,0.04)'},
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
          display:'flex',
          alignItems:'center',
          cursor:'pointer',
          px:1,
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)'},
          borderRadius:1
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

          {currentSchoolYearId && selectedClass && selectedClass.units?.map(unit => (
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
                          handleDeleteUnitClick(unit); // implement similar to class delete
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
         <ListItemButton sx={{ pl: 4 }} component={Link} to="/unit/create">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="caption">
                  Add Unit
                </Typography>
              }
            />
          </ListItemButton>

        </List>
    </Collapse>
      
    </List>

    <Dialog open={openDialog} onClose={handleCancelDelete}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {deleteType === 'schoolYear'
          ? 'Delete School Year'
          : deleteType === 'class'
          ? 'Delete Class'
          : 'Delete Unit'}
      </DialogTitle>
      <DialogContent>
        {deleteType === 'schoolYear' && (
          <>
            <p>Are you sure you want to delete the <strong>{selectedItem?.schoolyear}</strong> school year?</p>
            <p>All data related to this school year will be lost on deletion.</p>
          </>
        )}
        {deleteType === 'class' && (
          <>
            <p>Are you sure you want to delete the <strong>{selectedItem?.name}</strong> class?</p>
            <p>This action cannot be undone.</p>
          </>
        )}
        {deleteType === 'unit' && (
          <>
            <p>Are you sure you want to delete the <strong>{selectedItem?.name}</strong> unit?</p>
            <p>This action cannot be undone and will remove the unit from its associated class.</p>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelDelete} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>

	
	</>
  );
}
