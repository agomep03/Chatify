import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';
import NavMenu from '../components/NavMenu';
import { Box, Toolbar } from '@mui/material';

interface LayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <Toolbar />
      <Box sx={{ display: 'flex', flex: 1, width: '100%'  }}>
        <NavMenu />
        <Box sx={{ flexGrow: 1, p: 2}}>
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
