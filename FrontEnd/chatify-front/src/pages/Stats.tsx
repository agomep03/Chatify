import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography, CircularProgress, Paper, Divider, useTheme, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUserTopInfo } from "../api/spotifyService";
import { useAlert } from "../components/Alert/Alert";
import TopBarHome from "../components/TopBar/TopBarHome";
import { getScrollbarStyles } from "../styles/scrollbarStyles";
import { useNavigate } from "react-router-dom";

/**
 * Página de estadísticas de usuario (top artistas, canciones y géneros).
 */
const Stats: React.FC<{ toggleTheme: () => void }> = ({ toggleTheme }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { customAlert } = useAlert();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await fetchUserTopInfo();
        setStats(data);
      } catch (error) {
        customAlert("error", "Error al obtener estadísticas de Spotify.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const periodLabels: Record<string, string> = {
    semanal: "Esta semana",
    seis_meses: "Últimos 6 meses",
    todo_el_tiempo: "Todo el tiempo",
  };

  return (
    <Box
      sx={{
        position: "relative",
        top: 0,
        left: 0,
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.paper,
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
            Mis Estadísticas de Spotify
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
        ) : stats ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {Object.keys(periodLabels).map((period) => (
              <Paper
                key={period}
                elevation={2}
                sx={{
                  maxWidth: 480,
                  minHeight: 320,
                  position: "relative",
                  margin: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  boxSizing: "border-box",
                  p: 2,
                  background: theme.palette.background.default,
                  "@media (max-width:750px)": {
                    minHeight: "unset",
                    width: "90%",
                  },
                }}
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  {periodLabels[period]}
                </Typography>
                <Divider sx={{ width: "100%", mb: 1 }} />
                <Box mb={0} sx={{ width: "100%" }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0 }}>
                    Artistas más escuchados:
                  </Typography>
                  {(stats.top_artists?.[period] || []).length > 0 ? (
                    <Box component="ul" sx={{ pl: 2, mb: 0, mt: 0 }}>
                      {stats.top_artists[period].map((artist: string, i: number) => (
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
                  {(stats.top_tracks?.[period] || []).length > 0 ? (
                    <Box component="ul" sx={{ pl: 2, mb: 0, mt: 0 }}>
                      {stats.top_tracks[period].map((track: string, i: number) => (
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
                  {(stats.top_genres?.[period] || []).length > 0 ? (
                    <Box component="ul" sx={{ pl: 2, mb: 0, mt: 0 }}>
                      {stats.top_genres[period].map((genre: string, i: number) => (
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
            ))}
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

export default Stats;