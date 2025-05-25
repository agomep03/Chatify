import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3be477', contrastText: '#000000' },
    background: {
      default: '#1f1f1f',
      paper: '#151515',
    },
    text: {
      primary: '#ffffff',
      secondary: '#eeeeee',
    },
    custom: {
      userDialogBg: '#414141',
      botDialogBg: '#303030',
      topBarBg: '#020202',
      topBarText : '#ffffff',
      primaryHover: '#1abc54',
      outlinedBorder: '#7c7c7c',
      tabBg: '#282828',
    },
  },
});
