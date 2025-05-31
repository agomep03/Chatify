import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/**
 * Interfaz para las propiedades del componente LogoLarge.
 * @param {string} logoUrl - URL de la imagen del logo claro.
 * @param {string|number} [width] - Ancho opcional del logo.
 * @returns {JSX.Element}
 */
interface LogoLargeProps {
  logoUrl: string;
  width?: string | number;
}

/**
 * Componente LogoLarge.
 * Cambia automáticamente a la versión oscura si el tema es claro.
 */
const LogoLarge: React.FC<LogoLargeProps> = ({ logoUrl, width }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const logoSrc = isLight
    ? logoUrl.replace(".", "_dark.")
    : logoUrl;

  const computedWidth = width ?? (isMobile ? "250px" : "500px");

  return (
    <img
      src={logoSrc}
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