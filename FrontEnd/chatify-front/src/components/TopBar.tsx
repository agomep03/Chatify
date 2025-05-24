import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import UserMenu from './UserMenu.tsx'
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.tsx'
import logo from '../assets/Logo.png';

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavegateChat = () => {
    navigate('/home');
  };

  return (
    <AppBar position="static"  sx={{ backgroundColor: '#121212', color: '#fff', zIndex: 10 }}>
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
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;