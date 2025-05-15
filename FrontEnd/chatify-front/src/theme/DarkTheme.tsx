import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#3be477',       // main color
      contrastText: '#000000', // texto cuando fondo es primary (botón)
    },
    background: {
      default: '#1f1f1f',    // fondo alertas y navmenu
      paper: '#414141',      // fondo diálogo usuario
    },
    text: {
      primary: '#fff',       // textos alertas y diálogos
    },
    info: {
      main: '#303030',       // fondo diálogo bot (usar info o custom)
    },
    success: {
      main: '#1abc54',       // verde oscuro para seleccionado
    },
    topBar: {
      main: '#121212',       // fondo topbar (custom, usar overrides)
      contrastText: '#fff',  // texto topbar
    },
  },
});
