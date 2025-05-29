import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  fetchUserPlaylists,
  updateUserPlaylist,
  autoGeneratePlaylist,
} from "../api/spotifyService";
import PlaylistList from "./PlaylistCards/PlaylistList";
import AutoPlaylistCard from "./PlaylistCards/AutoPlaylistCard";
import SongsDialog from "./PlaylistCards/SongsDialog";
import EditPlaylistDialog from "./PlaylistCards/EditPlaylistDialog";
import AutoPlaylistDialog from "./PlaylistCards/AutoPlaylistDialog";
import { useAlert } from "./Alert";

/**
 * Componente para mostrar las playlists del usuario en forma de tarjetas.
 * @returns {JSX.Element} Componente de tarjetas de playlists.
 */
const PlaylistCards: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para controlar el diálogo y la playlist seleccionada
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);

  // Usamos theme para los colores
  const theme = useTheme();

  // Estado para el diálogo de generación automática
  const [autoDialogOpen, setAutoDialogOpen] = useState(false);
  const [autoPrompt, setAutoPrompt] = useState("");
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState<string | null>(null);

  // Estado para mostrar el dialog de canciones
  const [songsDialogOpen, setSongsDialogOpen] = useState(false);
  const [songsPlaylist, setSongsPlaylist] = useState<any | null>(null);

  // Define a type for the playlist and the response
  type Playlist = {
    id: string;
    name: string;
    description?: string;
    [key: string]: any;
  };

  type PlaylistsResponse =
    | {
        playlists?: Playlist[];
      }
    | Playlist[];

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: PlaylistsResponse = await fetchUserPlaylists();
        // Ajuste: extraer el array de la propiedad 'playlists' si existe, o usar data si ya es array
        setPlaylists(
          Array.isArray(data)
            ? data
            : data && Array.isArray((data as any).playlists)
            ? (data as any).playlists
            : []
        );
      } catch (e: any) {
        if (e.message === "Sesión expirada") {
          setError("Sesión expirada. Por favor, vuelve a iniciar sesión.");
        } else {
          setError("Error al cargar las playlists.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  // Handler para abrir el diálogo de edición
  const handleEditClick = (playlist: any) => {
    setSelectedPlaylist(playlist);
    setEditOpen(true);
  };

  // Handler para cerrar el diálogo
  const handleDialogClose = () => {
    setEditOpen(false);
    setSelectedPlaylist(null);
  };

  // Estado para el loading del edit
  const [editLoading, setEditLoading] = useState(false);

  // Handler para editar la playlist usando el endpoint real
  const handleEditSubmit = async (formData: Record<string, string>) => {
    if (!selectedPlaylist) return;
    setEditLoading(true);
    try {
      await updateUserPlaylist(selectedPlaylist.id, {
        title: formData.name,
        // Si quieres soportar imagen, añade aquí image_base64
      });
      setPlaylists((prev) =>
        prev.map((pl) =>
          pl.id === selectedPlaylist.id ? { ...pl, name: formData.name } : pl
        )
      );
    } catch (e: any) {
      setError("Error al actualizar la playlist.");
    }
    setEditLoading(false);
    handleDialogClose();
  };

  // Handler para abrir el diálogo de generación automática
  const handleOpenAutoDialog = () => {
    setAutoPrompt("");
    setAutoError(null);
    setAutoDialogOpen(true);
  };

  // Handler para cerrar el diálogo de generación automática
  const handleCloseAutoDialog = () => {
    setAutoDialogOpen(false);
    setAutoPrompt("");
    setAutoError(null);
  };

  // Hook para mostrar alertas
  const { customAlert } = useAlert();

  // Handler para enviar el prompt y crear la playlist automáticamente
  const handleAutoGenerate = async () => {
    if (!autoPrompt.trim()) {
      setAutoError("El prompt no puede estar vacío.");
      return;
    }
    setAutoLoading(true);
    setAutoError(null);
    try {
      await autoGeneratePlaylist(autoPrompt);
      // Refrescar playlists después de crear
      const data = await fetchUserPlaylists();
      setPlaylists(
        Array.isArray(data)
          ? data
          : data && Array.isArray((data as any).playlists)
          ? (data as { playlists: Playlist[] }).playlists
          : []
      );
      handleCloseAutoDialog();
    } catch (e: any) {
      customAlert("error", "Error al generar la playlist.");
      // setAutoError("Error al generar la playlist."); // Ya no se usa
    } finally {
      setAutoLoading(false);
    }
  };

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

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
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
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.grey[600],
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: theme.palette.grey[800],
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
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <AutoPlaylistCard onClick={handleOpenAutoDialog} />
        <PlaylistList
          playlists={playlists}
          onEdit={handleEditClick}
          onDelete={(playlistId) => {
            setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
          }}
          onShowSongs={(playlist) => {
            setSongsPlaylist(playlist);
            setSongsDialogOpen(true);
          }}
          theme={theme}
        />
      </Box>
      <EditPlaylistDialog
        open={editOpen}
        playlist={selectedPlaylist}
        onClose={handleDialogClose}
        onSubmit={handleEditSubmit}
        loading={editLoading}
      />
      <AutoPlaylistDialog
        open={autoDialogOpen}
        prompt={autoPrompt}
        loading={autoLoading}
        error={autoError}
        onPromptChange={setAutoPrompt}
        onClose={handleCloseAutoDialog}
        onGenerate={handleAutoGenerate}
      />
      <SongsDialog
        open={songsDialogOpen}
        playlist={songsPlaylist}
        onClose={() => setSongsDialogOpen(false)}
      />
    </Box>
  );
};

export default PlaylistCards;
