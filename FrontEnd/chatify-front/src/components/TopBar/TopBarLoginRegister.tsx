import HomeIcon from '@mui/icons-material/Home';
import { Box, IconButton, useTheme } from '@mui/material';
import ThemeButton from '../Buttons/ThemeButton/ThemeButton';
import { useNavigate } from 'react-router';

type TopBarLoginRegisterProps = {
  toggleTheme: () => void;
};

const TopBarLoginRegister: React.FC<TopBarLoginRegisterProps> = ({ toggleTheme }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavegateStart = () => {
    navigate('/');
  };

  return (
    <Box sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        gap: 1.5,
        zIndex: 10,
        backgroundColor: theme.palette.custom.topBarBg,
        padding: '8px 12px',
        borderRadius: 2,
        boxShadow: theme.shadows[4],
        alignItems: 'center',
      }}
      >
        <ThemeButton toggleTheme={toggleTheme}/>
        <IconButton
            size="small"
            onClick={handleNavegateStart}
        >
            <HomeIcon fontSize="medium" sx={{color:theme.palette.custom.topBarText}} />
        </IconButton>
    </Box>
  );
};

export default TopBarLoginRegister;