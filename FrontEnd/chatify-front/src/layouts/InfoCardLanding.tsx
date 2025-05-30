import { Box, Typography } from "@mui/material";

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
    <Box
      component="img"
      src={image}
      alt={title}
      sx={{
        width: { xs: 80, md: 140 },
        height: { xs: 80, md: 140 },
        objectFit: "cover",
        borderRadius: "50%",
        boxShadow: 2,
        mr: { md: 3 },
        mb: { xs: 2, md: 0 },
      }}
    />
    <Box sx={{ flex: 1 }}>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Box>
);

export default InfoCard;