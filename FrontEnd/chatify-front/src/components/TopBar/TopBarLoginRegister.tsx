import HomeIcon from '@mui/icons-material/Home';
import { Box, IconButton, useTheme } from '@mui/material';
import ThemeButton from '../Buttons/ThemeButton/ThemeButton';
import { useNavigate } from 'react-router';

/**
 * Barra superior para las páginas de login y registro.
 * @component
 * @param {() => void} toggleTheme - Función para alternar entre modo claro y oscuro.
 * @returns {JSX.Element} Barra superior con botón de inicio y cambio de tema.
 * @description
 * Muestra una barra superior flotante en las páginas de login y registro.
 * Incluye un botón para volver a la página principal (landing) y un botón para alternar el tema.
 * El diseño es compacto, con fondo y sombra personalizados según el tema.
 */

type TopBarLoginRegisterProps = {
  toggleTheme: () => void;
};

const TopBarLoginRegister: React.FC<TopBarLoginRegisterProps> = ({ toggleTheme }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Navega a la página principal (landing) al hacer click en el icono de inicio
  const handleNavegateStart = () => {
    navigate('/');
  };

  return (
    <Box sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        gap: 1.5,
        zIndex: 10,
        backgroundColor: theme.palette.custom.topBarBg,
        padding: '8px 12px',
        borderRadius: 2,
        boxShadow: theme.shadows[4],
        alignItems: 'center',
      }}
      >
        {/* Botón para alternar el tema */}
        <ThemeButton toggleTheme={toggleTheme}/>
        {/* Botón para volver a la página principal */}
        <IconButton
            size="small"
            onClick={handleNavegateStart}
        >
            <HomeIcon fontSize="medium" sx={{color:theme.palette.custom.topBarText}} />
        </IconButton>
    </Box>
  );
};

export default TopBarLoginRegister;