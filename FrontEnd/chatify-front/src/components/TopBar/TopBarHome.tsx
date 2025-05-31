import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import UserMenu from './UserMenu.tsx'
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo.tsx'
import logo from '../../assets/Logo.png';
import { useTheme } from "@mui/material/styles";
import ThemeButton from '../Buttons/ThemeButton/ThemeButton.tsx';
import MenuIcon from '@mui/icons-material/Menu';

type TopBarHomeProps = {
  toggleTheme: () => void;
  onToggleNav: () => void;
};

const TopBarHome: React.FC<TopBarHomeProps> = ({ toggleTheme, onToggleNav }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavegateChat = () => {
    navigate('/home');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.custom.topBarBg, color: theme.palette.custom.topBarText, zIndex: 10 }}>
      <Toolbar>
        {/* Botón de menú */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mr: 2 }}>
          <MenuIcon
            onClick={onToggleNav}
            sx={{ cursor: 'pointer', fontSize: 32 }}
          />
        </Box>
        {/* Logo y nombre */}
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
        <ThemeButton toggleTheme={toggleTheme}/>
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default TopBarHome;