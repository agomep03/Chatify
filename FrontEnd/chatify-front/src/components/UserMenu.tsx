import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    closeUserMenu();
    navigate('/login');
  };

  const handleProfile = () => {
    closeUserMenu();
    navigate('/profile');
  };

  return (
    <>
        <IconButton
          color="inherit"
          onClick={openUserMenu}
          disableRipple
          disableFocusRipple
          sx={{
            "&:focus": { outline: "none", border: "none", boxShadow: "none" },
            "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
            "&:active": { outline: "none", border: "none", boxShadow: "none" },
          }}
        >
            <AccountCircleIcon />
        </IconButton>
        <Menu
         anchorEl={anchorEl}
         open={Boolean(anchorEl)}
         onClose={closeUserMenu}
         anchorOrigin={{
           vertical: 'top',
           horizontal: 'right',
         }}
         transformOrigin={{
           vertical: 'top',
           horizontal: 'right',
         }}
        >
         <MenuItem onClick={handleProfile}>Perfil</MenuItem>
         <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        </Menu>
    </>
  );
};

export default UserMenu;