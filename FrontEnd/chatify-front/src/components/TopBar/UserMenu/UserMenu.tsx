import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Menú de usuario en la barra superior.
 * @component
 * @returns {JSX.Element} Icono de usuario que despliega un menú con opciones de perfil y cerrar sesión.
 * @description
 * Muestra un icono de usuario en la barra superior. Al hacer click, despliega un menú con opciones para ir al perfil o cerrar sesión.
 * Al cerrar sesión, elimina el token del localStorage y redirige a la página principal.
 * Al seleccionar "Perfil", navega a la ruta /profile.
 */

const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  // Abre el menú de usuario
  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Cierra el menú de usuario
  const closeUserMenu = () => {
    setAnchorEl(null);
  };

  // Maneja el cierre de sesión: elimina el token y redirige a la página principal
  const handleLogout = () => {
    localStorage.removeItem('token');
    closeUserMenu();
    navigate('/');
  };

  // Navega a la página de perfil
  const handleProfile = () => {
    closeUserMenu();
    navigate('/profile');
  };

  // Navega a la página de perfil
  const handleStats = () => {
    closeUserMenu();
    navigate('/stats');
  };

  return (
    <>
        {/* Icono de usuario que abre el menú */}
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
        {/* Menú desplegable con opciones de perfil y cerrar sesión */}
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
         <MenuItem onClick={handleStats}>Mis estadísticas</MenuItem>
         <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        </Menu>
    </>
  );
};

export default UserMenu;