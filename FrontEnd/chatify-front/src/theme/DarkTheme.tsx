// theme.ts o donde defines el tema
import { createTheme } from '@mui/material';
import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      userDialogBg: string;
      botDialogBg: string;
      topBarBg: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      userDialogBg?: string;
      botDialogBg?: string;
      topBarBg?: string;
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
      primary: '#fff',
    },
    custom: {
      userDialogBg: '#414141',
      botDialogBg: '#303030',
      topBarBg: '#121212',
    },
  },
});
