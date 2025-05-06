import { AppBar, Toolbar, Typography, Avatar, Box, IconButton } from '@mui/material';
import Logo from '../assets/Logo.png'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import openUserMenu from './UserMenu.tsx'

const TopBar: React.FC = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#121212' }}>
      <Toolbar>
        <Avatar 
          src={Logo}
          alt="Chatify Logo"
          sx={{ mr: 2 }} 
        />
        <Typography variant="h6" component="div">
          Chatify
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit" onClick={openUserMenu}>
            <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
