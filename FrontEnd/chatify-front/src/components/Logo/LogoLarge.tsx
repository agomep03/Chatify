import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/**
 * Props para el componente LogoLarge.
 * @param {string} logoUrl - URL de la imagen del logo.
 * @param {string|number} [width] - Ancho opcional del logo.
 * @returns {JSX.Element}
 */
interface LogoLargeProps {
  logoUrl: string;
  width?: string | number;
}

/**
 * Componente LogoLarge.
 * Muestra un logo grande, adaptando el ancho según el tamaño de pantalla.
 * Si se desea soporte para modo oscuro, se recomienda pasar la URL correspondiente desde el componente padre.
 */
const LogoLarge: React.FC<LogoLargeProps> = ({ logoUrl, width }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const computedWidth = width ?? (isMobile ? "250px" : "500px");

  return (
    <img
      src={logoUrl}
      alt="Logo"
      style={{
        width: computedWidth,
        maxWidth: "100%",
        height: "auto",
        marginRight: "0",
        display: "block",
      }}
    />
  );
};

export default LogoLarge;