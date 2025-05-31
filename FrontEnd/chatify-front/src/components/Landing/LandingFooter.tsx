import { Box, Typography } from "@mui/material";

/**
 * Footer de la landing page.
 * @component
 * @returns {JSX.Element} Pie de página con información de derechos y contacto.
 * @description
 * Muestra un footer fijo al final de la landing con el año actual, derechos reservados y un correo de contacto.
 * El diseño es responsivo y el fondo es semitransparente para destacar sobre el contenido.
 */
const LandingFooter = () => (
  <Box
    sx={{
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      color: "#ffffff",
      padding: 3,
      textAlign: "center",
      mt: 4,
      pb: 10,
    }}
  >
    <Typography variant="body2" sx={{ mb: 1 }}>
      © {new Date().getFullYear()} Chatify. Todos los derechos reservados.
    </Typography>
    <Typography variant="body2">
      ¿Dudas o problemas? Escríbenos a:{" "}
      <a
        href="mailto:chatify25@gmail.com"
        style={{ color: "#ffffff", textDecoration: "underline" }}
      >
        chatify25@gmail.com
      </a>
    </Typography>
  </Box>
);

export default LandingFooter;