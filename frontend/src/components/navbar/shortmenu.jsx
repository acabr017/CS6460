import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


import {Link, useLocation} from 'react-router'

export default function ShortMenu() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  	const location = useLocation();
	const path = location.pathname
	console.log(path)
  return (
	<>
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >

	  {/* <ListItemButton component={Link} to="/" selected={path === "/"} sx={{display:'flex', justifyContent:'center'}}>
        <ListItemIcon sx={{display:'flex', justifyContent:'center'}}>
          <OtherHousesIcon />
        </ListItemIcon>
      </ListItemButton> */}

      <ListItemButton component={Link} to="/calendar1" selected={path === "/calendar1"} sx={{display:'flex', justifyContent:'center'}}>
        <ListItemIcon sx={{display:'flex', justifyContent:'center'}}>
          <CalendarMonthIcon />
        </ListItemIcon>
      </ListItemButton>


      <ListItemButton component={Link} to="/school_years" selected={path === "/school_years"} sx={{display:'flex', justifyContent:'center'}}>
        <ListItemIcon sx={{display:'flex', justifyContent:'center'}}>
          <SchoolIcon />
        </ListItemIcon>
      </ListItemButton>

      <ListItemButton component={Link} to="/classes" selected={path === "/classes"} sx={{display:'flex', justifyContent:'center'}}>
        <ListItemIcon sx={{display:'flex', justifyContent:'center'}}>
          <ClassIcon />
        </ListItemIcon>
      </ListItemButton>
      
    </List>

	
	</>
  );
}
