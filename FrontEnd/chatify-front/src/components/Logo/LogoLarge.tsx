import React from "react";
import { useTheme } from "@mui/material/styles";

/**
 * Interfaz para las propiedades del componente LogoLarge.
 * @param {string} logoUrl - URL de la imagen del logo claro.
 * @returns {JSX.Element}
 */
interface LogoLargeProps {
  logoUrl: string;
}

/**
 * Componente LogoLarge.
 * Cambia automáticamente a la versión oscura si el tema es claro.
 */
const LogoLarge: React.FC<LogoLargeProps> = ({ logoUrl }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const logoSrc = isLight
    ? logoUrl.replace(".", "_dark.")
    : logoUrl;

  return (
    <img
      src={logoSrc}
      alt="Logo"
      style={{
        width: "500px",
        maxWidth: "100%",
        height: "auto",
        marginRight: "0",
        display: "block",
      }}
    />
  );
};

export default LogoLarge;