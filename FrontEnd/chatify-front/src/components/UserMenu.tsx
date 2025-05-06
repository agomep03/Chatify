import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import React, { useState } from 'react';

const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeUserMenu = () => {
    setAnchorEl(null);
  };
  return (
    <>
        <IconButton color="inherit" onClick={openUserMenu}>
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
         <MenuItem onClick={closeUserMenu}>Perfil</MenuItem>
         <MenuItem onClick={closeUserMenu}>Cerrar sesión</MenuItem>
        </Menu>
    </>
  );
};

export default UserMenu;
