import React from "react";

interface LogoProps {
  logoUrl: string;
}

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