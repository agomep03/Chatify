import { AppBar, Toolbar, Typography, Avatar, Box } from '@mui/material';
import Logo from '../assets/Logo.png'; 
import UserMenu from './UserMenu.tsx'
import { useNavigate } from 'react-router-dom';

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavegateChat = () => {
    navigate('/home');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#121212' }}>
      <Toolbar>

        <Box 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
            onClick={handleNavegateChat}
          >
          <Avatar 
            src={Logo}
            alt="Chatify Logo"
            sx={{ mr: 2}}
          />
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