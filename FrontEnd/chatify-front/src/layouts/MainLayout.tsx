import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { Box } from '@mui/material';

interface LayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar />
      <Box sx={{ flex: 1, mt: 8, p: 2 }}>
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default MainLayout;
