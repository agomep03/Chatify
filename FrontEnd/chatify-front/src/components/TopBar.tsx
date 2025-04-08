import { AppBar, Toolbar, Typography, Avatar } from '@mui/material';
import Logo from '../assets/Logo.png'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 

const TopBar: React.FC = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Avatar 
          src={Logo}
          alt="Chatify Logo"
          sx={{ mr: 2 }} 
        />
        <Typography variant="h6" component="div">
          Chatify
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
