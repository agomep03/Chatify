import React from "react";

/**
 * Interfaz para las propiedades del componente Logo.
 * @param {string} logoUrl - URL de la imagen del logo.
 * @returns {JSX.Element}
 */
interface LogoProps {
  logoUrl: string;
}

/**
 * Componente Logo.
 * @param {LogoProps} props - Propiedades del componente.
 * @returns {JSX.Element}
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
