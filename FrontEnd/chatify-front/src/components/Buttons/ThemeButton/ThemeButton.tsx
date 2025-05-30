import { useTheme, IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useState } from 'react';

type ThemeButtonProps = {
  toggleTheme: () => void;
};

const ThemeButton: React.FC<ThemeButtonProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleClick = () => {
    setTooltipOpen(false);
    toggleTheme();
  };

  return (
    <Tooltip
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      open={tooltipOpen}
      onOpen={() => setTooltipOpen(true)}
      onClose={() => setTooltipOpen(false)}
      disableFocusListener
      disableTouchListener
    >
      <IconButton
        onClick={handleClick}
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        sx={{
          color: theme.palette.custom.topBarText,
          "&:focus": { outline: "none", border: "none", boxShadow: "none" },
          "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
          "&:active": { outline: "none", border: "none", boxShadow: "none" },
        }}
      >
        {isDark ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeButton;