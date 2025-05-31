import { Box, Typography } from "@mui/material";
import Logo from "../components/Logo/LogoLarge";

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
    <Box sx={{ width: { xs: 60, sm: 80, md: 100 }, mb: { xs: 1, md: 0 } }}>
      <Logo logoUrl={image} width="100%" />
    </Box>
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