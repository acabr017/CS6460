import React, { useState, useEffect, useContext } from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate, useLocation, Link } from 'react-router';
import {
  List, ListItemButton, ListItemIcon, ListItemText, ListSubheader,
  Dialog, DialogActions, DialogContent, DialogTitle, Button
} from '@mui/material';
import AxiosInstance from '../axios';
import { SchoolYearContext } from '../SchoolYearContext';
import { ClassContext } from '../ClassContext';

import SchoolYearSubmenu from './SchoolYearSubMenu';
import ClassSubmenu from './ClassSubMenu';
import UnitSubmenu from './UnitSubMenu';

export default function MyMenu() {
  const { schoolYears, fetchSchoolYears } = useContext(SchoolYearContext);
  const { classes, fetchClasses } = useContext(ClassContext);

  const [schoolYearOpen, setSchoolYearOpen] = useState(true);
  const [classesOpen, setClassesOpen] = useState(false);
  const [unitsOpen, setUnitsOpen] = useState(false);

  // const [selectedClassId, setSelectedClassId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  // const selectedClass = classes.find(cls => cls.id === selectedClassId);


  const schoolYearMatch = path.match(/\/school_year\/calendar\/(\d+)/);
  const currentSchoolYearId = schoolYearMatch ? parseInt(schoolYearMatch[1]) : null;

  const classesForSchoolYear = currentSchoolYearId
    ? classes.filter(cls => cls.school_year === currentSchoolYearId)
    : [];

  // Handlers for delete actions
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteType('schoolYear');
    setOpenDialog(true);
  };
  const handleDeleteClassClick = (item) => {
    setSelectedItem(item);
    setDeleteType('class');
    setOpenDialog(true);
  };
  const handleDeleteUnitClick = (item) => {
    setSelectedItem(item);
    setDeleteType('unit');
    setOpenDialog(true);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setDeleteType(null);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteType === 'schoolYear') {
        await AxiosInstance.delete(`schoolyear/${selectedItem.id}/`);
        await fetchSchoolYears();
      } else if (deleteType === 'class') {
        await AxiosInstance.delete(`class/${selectedItem.id}/`);
        await fetchClasses();
      } else if (deleteType === 'unit') {
        await AxiosInstance.delete(`unit/${selectedItem.id}/`);
        await fetchClasses();
      }
      navigate('/');
    } catch (err) {
      console.error('Deletion failed:', err);
    } finally {
      handleCancelDelete();
    }
  };

  useEffect(() => {
    fetchSchoolYears();
    fetchClasses();
  }, []);

  return (
    <>
      <List subheader={<ListSubheader>Navigation</ListSubheader>}>
        {/* <ListItemButton component={Link} to="/calendar1" selected={path === "/calendar1"}>
          <ListItemIcon><CalendarMonthIcon /></ListItemIcon>
          <ListItemText primary="Calendar #1" />
        </ListItemButton> */}

        {/* Submenus */}
        <SchoolYearSubmenu
          schoolYearOpen={schoolYearOpen}
          setSchoolYearOpen={setSchoolYearOpen}
          path={path}  
          navigate={navigate}
          handleDeleteClick={handleDeleteClick}
        />

        <ClassSubmenu
          classesOpen={classesOpen}
          setClassesOpen={setClassesOpen}
          path={path}
          navigate={navigate}
          handleDeleteClassClick={handleDeleteClassClick}
          // selectedClassId={selectedClassId}
          // setSelectedClassId={setSelectedClassId}
          classesForSchoolYear={classesForSchoolYear}
          currentSchoolYearId={currentSchoolYearId}
        />

        <UnitSubmenu
          unitsOpen={unitsOpen}
          setUnitsOpen={setUnitsOpen}
          currentSchoolYearId={currentSchoolYearId}
          // selectedClass={selectedClass}
          handleDeleteUnitClick={handleDeleteUnitClick}
        />
      </List>

      {/* Delete confirmation dialog */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Delete {deleteType}</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{selectedItem?.name || selectedItem?.schoolyear}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}