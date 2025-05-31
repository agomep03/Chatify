import { Theme } from "@mui/material/styles";

/**
 * Devuelve estilos personalizados para scrollbars compatibles con MUI sx.
 * @param {Theme} theme - Tema de MUI para usar colores del tema.
 * @returns {object} Objeto de estilos para scrollbars.
 * @description
 * Aplica estilos personalizados a la barra de scroll usando selectores ::-webkit-scrollbar.
 * Cambia el ancho, color y efecto hover del thumb según el tema.
 * Útil para aplicar en componentes con overflow y scroll.
 */
export const getScrollbarStyles = (theme: Theme) => ({
  // Estilo para la barra de scroll (fondo)
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  // Estilo para el thumb (la parte que se mueve)
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[600],
    borderRadius: "4px",
  },
  // Estilo para el thumb al hacer hover
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: theme.palette.grey[800],
  },
});