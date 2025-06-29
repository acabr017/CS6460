import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Link, useLocation} from 'react-router'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function MyMenu() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const location = useLocation();
	const path = location.pathname
	// console.log(path)
  return (
	<>
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
           {/* this will change what the menu header title is */}
        </ListSubheader>
      }
    >

	  <ListItemButton component={Link} to="/" selected={path === "/"}>
        <ListItemIcon>
          <OtherHousesIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>

    <ListItemButton component={Link} to="/calendar1" selected={path === "/calendar1"}>
        <ListItemIcon>
          <CalendarMonthIcon />
        </ListItemIcon>
        <ListItemText primary={"Calendar #1"} />
      </ListItemButton>


      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="School Year" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} component={Link} to="/create_school_year">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add School Year" />
          </ListItemButton>

		  <ListItemButton sx={{ pl: 4 }} component={Link} to="/edit_school_year/:id">
            <ListItemIcon>
              <ModeEditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit School Year" />
          </ListItemButton>

		  <ListItemButton sx={{ pl: 4 }} component={Link} to="/delete_school_year/:id">
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete School Year" />
          </ListItemButton>
        </List>
      </Collapse>

    </List>

	<List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
           {/* this will change what the menu header title is */}
        </ListSubheader>
      }
    >
	  <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <ClassIcon />
        </ListItemIcon>
        <ListItemText primary="Classes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Class" />
          </ListItemButton>

		  <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <ModeEditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit Class" />
          </ListItemButton>

		  <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete Class" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
	</>
  );
}
