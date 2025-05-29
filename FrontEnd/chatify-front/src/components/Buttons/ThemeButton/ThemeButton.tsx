import { useTheme, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // luna
import Brightness7Icon from '@mui/icons-material/Brightness7'; // sol

type ThemeButtonProps = {
  toggleTheme: () => void;
};

const ThemeButton: React.FC<ThemeButtonProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <IconButton onClick={toggleTheme}
      sx={{
        color:theme.palette.custom.topBarText,
        "&:focus": { outline: "none", border: "none", boxShadow: "none" },
        "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
        "&:active": { outline: "none", border: "none", boxShadow: "none" },
      }}
    >
      {isDark ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  );
};

export default ThemeButton;