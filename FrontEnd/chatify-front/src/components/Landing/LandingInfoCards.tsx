import { Box } from "@mui/material";
import InfoCard from "../../layouts/InfoCardLanding";

type InfoCardData = {
  title: string;
  description: string;
  image: string;
};

type LandingInfoCardsProps = {
  infoCardsData: InfoCardData[];
};

const LandingInfoCards: React.FC<LandingInfoCardsProps> = ({ infoCardsData }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: { xs: 2, md: 4 },
      px: { xs: 1, md: 2 },
      py: { xs: 1, md: 4 },
      width: { xs: "90%", md: "90%" },
      maxWidth: 900,
      mx: "auto",
    }}
  >
    {infoCardsData.map((card, index) => (
      <InfoCard
        key={index}
        title={card.title}
        description={card.description}
        image={card.image}
      />
    ))}
  </Box>
);

export default LandingInfoCards;