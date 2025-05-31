import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import UserMenu from './UserMenu/UserMenu.tsx'
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo.tsx'
import logo from '../../assets/Logo.png';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ThemeButton from '../Buttons/ThemeButton/ThemeButton.tsx';
import MenuIcon from '@mui/icons-material/Menu';

/**
 * Barra superior principal de la vista Home.
 * @component
 * @param {() => void} toggleTheme - Función para alternar entre modo claro y oscuro.
 * @param {() => void} onToggleNav - Función para abrir/cerrar el menú lateral en pantallas pequeñas.
 * @returns {JSX.Element} Barra superior con logo, nombre, botón de menú, cambio de tema y menú de usuario.
 * @description
 * Muestra la barra superior de la app con el logo, nombre de la app, botón de menú lateral (en pantallas pequeñas),
 * botón para cambiar el tema y el menú de usuario. El logo y nombre redirigen a /home al hacer click.
 */

type TopBarHomeProps = {
  toggleTheme: () => void;
  onToggleNav: () => void;
};

const TopBarHome: React.FC<TopBarHomeProps> = ({ toggleTheme, onToggleNav }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const computerScreenIsSmall = useMediaQuery("(max-width:1200px)");

  // Navega a la página principal al hacer click en el logo/nombre
  const handleNavegateChat = () => {
    navigate('/home');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.custom.topBarBg, color: theme.palette.custom.topBarText, zIndex: 10 }}>
      <Toolbar>
        {/* Botón de menú solo si la pantalla es pequeña */}
        {computerScreenIsSmall && (
          <Box sx={{ mr: 2 }}>
            <MenuIcon
              onClick={onToggleNav}
              sx={{ cursor: 'pointer', fontSize: 32 }}
            />
          </Box>
        )}
        {/* Logo y nombre de la app, clickeables */}
        <Box 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
          onClick={handleNavegateChat}
        >
          <Logo logoUrl={logo}/>
          <Typography variant="h6" component="div">
            Chatify
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {/* Botón para alternar tema */}
        <ThemeButton toggleTheme={toggleTheme}/>
        {/* Menú de usuario */}
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default TopBarHome;