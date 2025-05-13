import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import UserMenu from './UserMenu.tsx'
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.tsx'

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
          <Logo logoUrl='/src/assets/Logo.png'/>
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