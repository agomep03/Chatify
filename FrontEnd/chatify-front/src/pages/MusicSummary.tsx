import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography, CircularProgress, Paper, Divider, useTheme, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUserTopInfo } from "../api/spotifyService";
import { useAlert } from "../components/Alert/Alert";
import TopBarHome from "../components/TopBar/TopBarHome";
import { getScrollbarStyles } from "../styles/scrollbarStyles";
import { useNavigate } from "react-router-dom";

/**
 * Página de resumen musical del usuario.
 * @component
 * @param {() => void} toggleTheme - Función para alternar entre modo claro y oscuro.
 * @returns {JSX.Element} Página de resumen musical del usuario.
 * @description
 * Obtiene y muestra los artistas, canciones y géneros más escuchados del usuario en diferentes periodos de tiempo.
 */

type MusicSummaryProps = {
  toggleTheme: () => void;
};

const MusicSummary: React.FC<MusicSummaryProps> = ({ toggleTheme }) => {
  const [MusicSummary, setMusicSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { customAlert } = useAlert();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMusicSummary = async () => {
      setLoading(true);
      try {
        const data = await fetchUserTopInfo();
        setMusicSummary(data);
      } catch (error) {
        customAlert("error", "Error al obtener estadísticas de Spotify.");
      } finally {
        setLoading(false);
      }
    };
    fetchMusicSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const periodLabels: Record<string, string> = {
    semanal: "Tus vibes semanales",
    seis_meses: "Lo que te marcó tu semestre",
    todo_el_tiempo: "Tus clásicos de siempre",
  };

  return (
    <Box
      sx={{
        position: "relative",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: theme.palette.custom.tabBg,
      }}
    >
      <TopBarHome toggleTheme={toggleTheme} onToggleNav={() => {}} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          padding: 2,
          ...getScrollbarStyles(theme),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
          <IconButton
            onClick={() => navigate("/home")}
            sx={{
              mr: 1,
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "action.hover" },
            }}
            size="large"
          >
            <ArrowBackIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
          <Typography variant="h4" sx={{ color: "text.primary" }}>
            Tu música, tu resumen
          </Typography>
        </Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress sx={{ color: theme.palette.text.primary }} />
          </Box>
        ) : MusicSummary ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
              gap: 2,
            }}
          >
            {Object.keys(periodLabels).map((period) => {
              // Artistas
              const artists = MusicSummary.top_artists?.[period] ?? [];
              const hasArtists = artists.length > 0;

              // Canciones
              const tracks = MusicSummary.top_tracks?.[period] ?? [];
              const hasTracks = tracks.length > 0;

              // Géneros
              const genres = MusicSummary.top_genres?.[period] ?? [];
              const hasGenres = genres.length > 0;

              return (
                <Paper
                  key={period}
                  elevation={2}
                  sx={{
                    flex: 1,
                    minWidth: 260,
                    maxWidth: 400,
                    minHeight: 320,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    boxSizing: "border-box",
                    p: 2,
                    background: theme.palette.background.default,
                    "@media (max-width:1000px)": {
                      width: "calc(40% - 16px)",
                    },
                    "@media (max-width:750px)": {
                      minHeight: "unset",
                      width: "90%",
                    },
                  }}
                >
                  <Typography variant="h6" color="primary" gutterBottom align="center">
                    {periodLabels[period]}
                  </Typography>
                  <Divider sx={{ width: "100%", mb: 1 }} />
                  <Box mb={0} sx={{ width: "100%" }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0 }}>
                      Artistas más escuchados:
                    </Typography>
                    {hasArtists ? (
                      <Box component="ul" sx={{ pl: 5, mb: 0, mt: 0 }}>
                        {artists.map((artist: string, i: number) => (
                          <li key={i}>
                            <Typography variant="body2" color="text.secondary">
                              {artist}
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin datos
                      </Typography>
                    )}
                  </Box>
                  <Box mb={0} sx={{ width: "100%" }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0, mt: 2 }}>
                      Canciones más escuchadas:
                    </Typography>
                    {hasTracks ? (
                      <Box component="ul" sx={{ pl: 5, mb: 0, mt: 0 }}>
                        {tracks.map((track: string, i: number) => (
                          <li key={i}>
                            <Typography variant="body2" color="text.secondary">
                              {track}
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin datos
                      </Typography>
                    )}
                  </Box>
                  <Box mb={0} sx={{ width: "100%" }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0, mt: 2 }}>
                      Géneros favoritos:
                    </Typography>
                    {hasGenres ? (
                      <Box component="ul" sx={{ pl: 5, mb: 0, mt: 0 }}>
                        {genres.map((genre: string, i: number) => (
                          <li key={i}>
                            <Typography variant="body2" color="text.secondary">
                              {genre}
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin datos
                      </Typography>
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Box>
        ) : (
          <Typography color="text.secondary" align="center">
            No se encontraron estadísticas.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MusicSummary;