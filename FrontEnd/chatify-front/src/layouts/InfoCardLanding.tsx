import { Box, Typography } from "@mui/material";
import Logo from "../components/Logo/LogoLarge";

type InfoCardProps = {
  title: string;
  description: string;
  image: string; // URL de la imagen
};

const InfoCard: React.FC<InfoCardProps> = ({ title, description, image }) => (
  <Box
    sx={{
      width: "100%",
      mx: "auto",
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      alignItems: "center",
      gap: 3,
      bgcolor: "background.paper",
      borderRadius: 5,
      boxShadow: 4,
      p: { xs: 2, md: 4 },
      my: 3,
    }}
  >
    <Box sx={{width:100}}>
      <Logo logoUrl={image} />
    </Box>

    <Box sx={{ flex: 1 }}>
      <Typography variant="h3" fontWeight="bold" mb={1} color="text.primary">
        {title}
      </Typography>
      <Typography variant="h6" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Box>
);

export default InfoCard;