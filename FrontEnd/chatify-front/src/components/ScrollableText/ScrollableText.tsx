import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";

/**
 * Texto con scroll automático si desborda su contenedor, o centrado si se indica y NO hay overflow.
 * @component
 * @param {string} text - Texto a mostrar.
 * @param {boolean} selected - Si la tab está seleccionada (aplica estilos destacados).
 * @param {boolean} [center] - Si true, centra el texto solo si no hay overflow.
 * @returns {JSX.Element} Texto que se desplaza horizontalmente al hacer hover si es muy largo, o centrado si se indica y no hay overflow.
 */
const ScrollableText = ({
  text,
  selected,
  center = false,
}: {
  text: string;
  selected: boolean;
  center?: boolean;
}) => {
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
    const animationFrame = requestAnimationFrame(checkOverflow);
    window.addEventListener('resize', checkOverflow);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text, center]);

  return (
    <Box
      ref={containerRef}
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
        display: "flex",
        // Centra solo si se pide y NO hay overflow
        alignItems: center && !shouldScroll ? "center" : "flex-start",
        justifyContent: center && !shouldScroll ? "center" : "flex-start",
        // Scroll solo si hay overflow
        ...(shouldScroll
          ? {
              "&:hover .scroll-text": {
                animation: "scroll-text 5s linear infinite",
              },
              "@keyframes scroll-text": {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: `translateX(calc(-100% + ${containerRef.current?.clientWidth}px))` },
              },
            }
          : {}),
      }}
    >
      <Box
        ref={textRef}
        className="scroll-text"
        sx={{
          display: "inline-block",
          color: selected ? theme.palette.custom.primaryHover : theme.palette.text.primary,
          fontWeight: selected ? "bold" : "normal",
          paddingRight: "0em",
          alignItems: "center",
        }}
      >
        {text}
      </Box>
    </Box>
  );
};

export default ScrollableText;