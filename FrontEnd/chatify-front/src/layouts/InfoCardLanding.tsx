import { Box, Typography } from "@mui/material";
import Logo from "../components/Logo/LogoLarge";

/**
 * Tarjeta informativa para la landing page.
 * @component
 * @param {string} title - Título de la tarjeta.
 * @param {string} description - Descripción o texto principal de la tarjeta.
 * @param {string} image - URL de la imagen o logo a mostrar.
 * @returns {JSX.Element} Tarjeta estilizada con imagen, título y descripción.
 * @description
 * Muestra una tarjeta con un logo/imágen, un título y una descripción.
 * El diseño es responsivo y se adapta a pantallas pequeñas y grandes.
 */

type InfoCardProps = {
  title: string;
  description: string;
  image: string;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, description, image }) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      alignItems: "center",
      gap: { xs: 2, md: 3 },
      bgcolor: "background.paper",
      borderRadius: 5,
      boxShadow: 4,
      p: { xs: 1.5, md: 4 },
      my: 2,
      mx: 0,
    }}
  >
    {/* Logo o imagen de la tarjeta */}
    <Box sx={{ width: { xs: 60, sm: 80, md: 100 }, mb: { xs: 1, md: 0 } }}>
      <Logo logoUrl={image} width="100%" />
    </Box>
    {/* Contenido textual: título y descripción */}
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={0.5}
        color="text.primary"
        sx={{ fontSize: { xs: "1.1rem", md: "1.5rem" } }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ fontSize: { xs: "0.95rem", md: "1.1rem" } }}
      >
        {description}
      </Typography>
    </Box>
  </Box>
);

export default InfoCard;