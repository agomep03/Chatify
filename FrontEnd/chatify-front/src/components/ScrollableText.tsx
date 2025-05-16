import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const ScrollableText = ({ text, selected }: { text: string; selected: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

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
        "&:hover .scroll-text": {
          animation: shouldScroll ? "scroll-text 5s linear infinite" : "none",
        },
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
          color: selected ? "#1abc54" : "#ffffff",
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