import { Box } from "@mui/material";
import InfoCard from "../../layouts/InfoCardLanding";
import logoSpotify from "../../assets/Spotify.png";
import logoPlaylist from "../../assets/Playlist.png";
import logoIA from "../../assets/IA.png";
import logoChat from "../../assets/Bot.png";
import logoLyrics from "../../assets/Lyrics.png";

// Datos de las tarjetas informativas que se mostrarán en la landing page.
// Cada objeto representa una funcionalidad principal de la aplicación.
const infoCardsData = [
    {
        title: "Conecta tu cuenta de Spotify",
        description: "Inicia sesión y vincula tu cuenta de Spotify para desbloquear todas las funcionalidades de Chatify.",
        image: logoSpotify,
    },
    {
        title: "Explora tus playlists",
        description: "Accede rápidamente a tus playlists de Spotify. Administra tus listas, consulta sus detalles y descubre nueva música sin salir de la app.",
        image: logoPlaylist,
    },
    {
        title: "Crea con inteligencia artificial",
        description: "Escribe una idea, un estado de ánimo o un tema, y deja que nuestra IA genere una playlist hecha a medida para ti. Rápido, fácil e inteligente.",
        image: logoIA,
    },
    {
        title: "Habla sobre música",
        description: "Conversa con nuestra IA sobre géneros, artistas, recomendaciones y mucho más. Una experiencia interactiva para amantes de la música.",
        image: logoChat,
    },
    {
        title: "Ver letras de canciones",
        description: "Accede a la letra de las canciones de tus playlists. Perfecto para cantar, entender mejor la música o simplemente disfrutarla más.",
        image: logoLyrics,
    },
];

/**
 * Componente que muestra las tarjetas informativas (InfoCards) en la landing page.
 * @component
 * @returns {JSX.Element} Contenedor con todas las InfoCards.
 * @description
 * Renderiza un bloque responsivo con varias tarjetas informativas sobre las funcionalidades de la app.
 * El diseño se adapta a móvil y escritorio.
 */
const LandingInfoCards = () => (
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