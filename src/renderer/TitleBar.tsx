import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem } from '@mui/material';
import { ipc } from './ipc';
import { unsetAuthState } from './slices/Auth';
import { useDispatch } from 'react-redux';


export default function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    dispatch(unsetAuthState());
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shiddy
          </Typography>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ position: 'absolute', top: '0.6rem', right: '1rem' }}
            onClick={() => ipc.quit()}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={logOut}>Logout</MenuItem>
        </Menu>
      </AppBar>
    </Box>
  );
}

{/* <Menu
id="fade-menu"
MenuListProps={{
  'aria-labelledby': 'fade-button',
}}
anchorEl={anchorEl}
open={open}
onClose={handleClose}
TransitionComponent={Fade}
>
<MenuItem onClick={handleClose}>Profile</MenuItem>
<MenuItem onClick={handleClose}>My account</MenuItem>
<MenuItem onClick={handleClose}>Logout</MenuItem>
</Menu> */}