import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";

/**
 * Componente para mostrar las playlists del usuario en forma de tarjetas.
 * @returns {JSX.Element} Componente de tarjetas de playlists.
 */
const PlaylistCards: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de datos de ejemplo
    const mockPlaylists = [
      {
        id: 1,
        name: "Playlist 1",
        description: "Descripción de la playlist 1",
      },
      {
        id: 2,
        name: "Playlist 2",
        description: "Descripción de la playlist 2",
      },
      {
        id: 3,
        name: "Playlist 3",
        description: "Descripción de la playlist 3",
      },
    ];

    // Simular llamada a la API
    setTimeout(() => {
      setPlaylists(mockPlaylists);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        padding: 2,
        "&::-webkit-scrollbar": {
          width: "8px", // Set scrollbar width
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888", // Set scrollbar thumb color
          borderRadius: "4px", // Add rounded corners
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555", // Change color on hover
        },
      }}
    >
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Typography variant="h4" sx={{ color: "text.primary" }}>
          Mis Playlists
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {playlists.map((playlist) => (
          <Card key={playlist.id} sx={{ width: 500, height: 500 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {playlist.name}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {playlist.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default PlaylistCards;
