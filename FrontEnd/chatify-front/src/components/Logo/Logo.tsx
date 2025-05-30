import React from "react";
import { useTheme } from "@mui/material/styles";

/**
 * Interfaz para las propiedades del componente Logo.
 * @param {string} logoUrl - URL de la imagen del logo claro.
 * @returns {JSX.Element}
 */
interface LogoProps {
  logoUrl: string;
}

/**
 * Componente Logo.
 * Cambia automáticamente a la versión oscura si el tema es claro.
 */
const Logo: React.FC<LogoProps> = ({ logoUrl }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const logoSrc = isLight
    ? logoUrl.replace(".", "_dark.")
    : logoUrl;

  return (
    <img
      src={logoSrc}
      alt="Logo"
      style={{ width: "50px", marginRight: "8px" }}
    />
  );
};

export default Logo;
