import { useTheme, IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useState } from 'react';

/**
 * Botón para alternar entre modo claro y oscuro en la aplicación.
 * @component
 * @param {() => void} toggleTheme - Función para alternar el tema de la app.
 * @param {object} [sx] - Estilos adicionales para sobrescribir los estilos por defecto.
 * @returns {JSX.Element} Botón con icono de sol/luna y tooltip explicativo.
 * @description
 * Este componente muestra un botón con un icono que permite cambiar entre modo claro y oscuro.
 * El icono y el tooltip cambian según el tema actual.
 * El tooltip se controla manualmente para evitar que quede abierto tras hacer click.
 * Permite sobrescribir estilos mediante la prop sx.
 */

type ThemeButtonProps = {
  toggleTheme: () => void;
  sx?: object;
};

const ThemeButton: React.FC<ThemeButtonProps> = ({ toggleTheme, sx }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [ignoreHover, setIgnoreHover] = useState(false);

  const handleClick = () => {
    setTooltipOpen(false);
    setIgnoreHover(true);
    toggleTheme();
  };

  const handleMouseEnter = () => {
    if (!ignoreHover) setTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    setTooltipOpen(false);
    setIgnoreHover(false);
  };

  return (
    <Tooltip
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      open={tooltipOpen}
      onOpen={handleMouseEnter}
      onClose={handleMouseLeave}
      disableFocusListener
      disableTouchListener
    >
      <IconButton
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          color: theme.palette.custom.topBarText,
          "&:focus": { outline: "none", border: "none", boxShadow: "none" },
          "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
          "&:active": { outline: "none", border: "none", boxShadow: "none" },
          ...sx,
        }}
      >
        {isDark ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeButton;