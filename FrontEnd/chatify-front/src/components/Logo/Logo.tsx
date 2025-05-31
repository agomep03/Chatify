import React from "react";

/**
 * Props para el componente Logo.
 * @param {string} logoUrl - URL de la imagen del logo.
 * @returns {JSX.Element} Imagen del logo.
 * @description
 * Componente genérico para mostrar el logo de la aplicación.
 */
interface LogoProps {
  logoUrl: string;
}

/**
 * Componente Logo.
 * Muestra el logo con un ancho fijo y margen derecho.
 */
const Logo: React.FC<LogoProps> = ({ logoUrl }) => {
  return (
    <img
      src={logoUrl}
      alt="Logo"
      style={{ width: "50px", marginRight: "8px" }}
    />
  );
};

export default Logo;
