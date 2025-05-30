import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import UserMenu from './UserMenu.tsx'
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo.tsx'
import logo from '../../assets/Logo.png';
import { useTheme } from "@mui/material/styles";
import ThemeButton from '../Buttons/ThemeButton/ThemeButton.tsx';

type TopBarHomeProps = {
  toggleTheme: () => void;
};

const TopBarHome: React.FC<TopBarHomeProps> = ({ toggleTheme }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavegateChat = () => {
    navigate('/home');
  };

  return (
    <AppBar position="static"  sx={{ backgroundColor: theme.palette.custom.topBarBg, color: theme.palette.custom.topBarText, zIndex: 10 }}>
      <Toolbar>

        <Box 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
            onClick={handleNavegateChat} //Al dar al logo o al nombre de de la aplicación se volverá a 'home'
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