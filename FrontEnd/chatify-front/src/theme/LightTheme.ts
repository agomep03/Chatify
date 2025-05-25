import { createTheme } from '@mui/material';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1db954', contrastText: '#ffffff' },
    background: {
      default: '#e9e9e9',
      paper: '#f4f4f4',
    },
    text: {
      primary: '#121212',
      secondary: '#232323',
    },
    custom: {
      userDialogBg: '#e9e9e9',
      botDialogBg: '#f2f2f2',
      topBarBg: '#1db954',
      topBarText : '#ffffff',
      primaryHover: '#3be477',
      outlinedBorder: '#b3b3b3',
      tabBg: '#dddddd',
    },
  },
});
