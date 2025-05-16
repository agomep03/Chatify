import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      userDialogBg: string;
      botDialogBg: string;
      topBarBg: string;
      primaryHover: string;
      outlinedBorder: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      userDialogBg?: string;
      botDialogBg?: string;
      topBarBg?: string;
      primaryHover?: string;
      outlinedBorder?: string;
    };
  }
}

export const darkTheme = createTheme({
  palette: {
    primary: { main: '#3be477', contrastText: '#000000' },
    background: {
      default: '#1f1f1f',
      paper: '#191919',
    },
    text: {
      primary: '#ffffff',
    },
    custom: {
      userDialogBg: '#414141',
      botDialogBg: '#303030',
      topBarBg: '#121212',
      primaryHover: '#1abc54',
      outlinedBorder: '#7c7c7c',
    },
  },
});
