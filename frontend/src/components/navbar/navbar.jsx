// import * as React from 'react';
import {React, useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MyMenu from './menu'
import ShortMenu from './shortmenu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {Link, useLocation} from 'react-router'
import AxiosInstance from '../axios';
import { useNavigate } from 'react-router';

const drawerWidth = 240;
const shortDrawerWidth = 80;

export default function NavBar({content}) {

  // const {content} = data
  const location = useLocation();
	const path = location.pathname
	const [isBigMenu, setIsBigMenu] = useState(false);
  const navigate = useNavigate()

	const changeMenu = () => {
		setIsBigMenu(!isBigMenu)
	}

  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const logoutUser = () =>{
    AxiosInstance.post(`logoutall/`,{})
    .then( () =>{
      localStorage.removeItem("Token")
      navigate('/')
    })
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
       
      {/* This is the navigation bar on top, goes from left to right. Has the toggle for menu.  */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>

          {/* This is the icon button to expand/contract the menu */}
          <IconButton onClick={changeMenu} sx={{color: 'white', marginRight: '40px'}}>
              {isBigMenu ? <MenuOpenIcon/> : <MenuIcon/>} 
          </IconButton>

        {/* This gives me the text to the right of the menu icon, for title purposes. */}
        <Typography variant="h6" noWrap component="div">
            Clipped drawer
        </Typography>

        
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          sx={{ml:'auto'}}
        >
          <AccountCircle />
        </IconButton>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {auth ? (
            <div>
            <MenuItem onClick={handleClose} component={Link} to='/'>Profile</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to='/'>Settings</MenuItem>
            <MenuItem onClick={logoutUser} component={Link} to='/'>Logout</MenuItem>
          </div>
        ) : (
          <>
            <MenuItem onClick={handleClose} component={Link} to='/login'>Log In</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to='/register'>Register</MenuItem>
          </>
        )}
        </Menu>
            

        
        </Toolbar>
        
      </AppBar>

      {/* This is the content of the navigation bar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isBigMenu ? drawerWidth : shortDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: isBigMenu ? drawerWidth : shortDrawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
			{isBigMenu ? <MyMenu/> : <ShortMenu/>}
			
      </Drawer>

      {/* This is the content of my page */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}
