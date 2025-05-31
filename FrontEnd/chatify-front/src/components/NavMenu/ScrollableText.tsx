import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";

/**
 * Texto con scroll automático si desborda su contenedor.
 * @component
 * @param {string} text - Texto a mostrar.
 * @param {boolean} selected - Si la tab está seleccionada (aplica estilos destacados).
 * @returns {JSX.Element} Texto que se desplaza horizontalmente al hacer hover si es muy largo.
 * @description
 * Este componente muestra un texto que, si es más largo que su contenedor, se desplaza automáticamente al hacer hover.
 * Útil para mostrar títulos largos en tabs/conversaciones.
 * El texto se resalta si la tab está seleccionada.
 */

const ScrollableText = ({ text, selected }: { text: string; selected: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const isOverflowing = textRef.current.scrollWidth > containerRef.current.clientWidth;
        setShouldScroll(isOverflowing);
      }
    };

    // Usamos requestAnimationFrame para asegurarnos de que los elementos estén renderizados
    const animationFrame = requestAnimationFrame(checkOverflow);

    // También añadimos un listener para cambios de tamaño
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
        // Al hacer hover, si el texto desborda, se activa la animación de scroll
        "&:hover .scroll-text": {
          animation: shouldScroll ? "scroll-text 5s linear infinite" : "none",
        },
        // Animación de scroll
        "@keyframes scroll-text": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: `translateX(calc(-100% + ${containerRef.current?.clientWidth}px))` },
        },
      }}
    >
      <Box
        ref={textRef}
        className="scroll-text"
        sx={{
          display: "inline-block",
          color: selected ? theme.palette.custom.primaryHover : theme.palette.text.primary,
          fontWeight: selected ? "bold" : "normal",
          paddingRight: "2em", // Espacio al final para mejor legibilidad
        }}
      >
        {text}
      </Box>
    </Box>
  );
};

export default ScrollableText;