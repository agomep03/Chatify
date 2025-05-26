import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import CustomDialog from "./Dialog";
import Form from "./Form";
import { useTheme } from "@mui/material/styles";
import {
  fetchUserPlaylists,
  updateUserPlaylist,
  autoGeneratePlaylist,
} from "../api/spotifyService";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

  // Ref para el formulario de edición
  const formRef = useRef<HTMLFormElement>(null);

  // Usamos theme para los colores
  const theme = useTheme();

  // Estado para el diálogo de generación automática
  const [autoDialogOpen, setAutoDialogOpen] = useState(false);
  const [autoPrompt, setAutoPrompt] = useState("");
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState<string | null>(null);
  const autoTextareaRef = useRef<HTMLTextAreaElement>(null); // <-- Añadido

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

  type PlaylistsResponse = {
    playlists?: Playlist[];
  } | Playlist[];

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: PlaylistsResponse = await fetchUserPlaylists();
        // Ajuste: extraer el array de la propiedad 'playlists' si existe, o usar data si ya es array
        setPlaylists(Array.isArray(data) ? data : (data && Array.isArray((data as any).playlists)) ? (data as any).playlists : []);
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

  // Handler para editar la playlist usando el endpoint real
  const handleEditSubmit = async (formData: Record<string, string>) => {
    if (!selectedPlaylist) return;
    try {
      await updateUserPlaylist(selectedPlaylist.id, {
        title: formData.name,
        // Si quieres soportar imagen, añade aquí image_base64
      });
      setPlaylists((prev) =>
        prev.map((pl) =>
          pl.id === selectedPlaylist.id
            ? { ...pl, name: formData.name }
            : pl
        )
      );
    } catch (e: any) {
      setError("Error al actualizar la playlist.");
    }
    handleDialogClose();
  };

  // Handler para aceptar el dialog (dispara el submit del form)
  const handleDialogAccept = () => {
    formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
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
          : (data && Array.isArray((data as any).playlists))
          ? (data as { playlists: Playlist[] }).playlists
          : []
      );
      handleCloseAutoDialog();
    } catch (e: any) {
      setAutoError("Error al generar la playlist.");
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
        {/* Card para crear playlist automáticamente */}
        <Card
          sx={{
            width: 500,
            height: 500,
            position: "relative",
            margin: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            cursor: "pointer",
            border: `2px dashed ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            transition: "box-shadow 0.2s",
            "&:hover": {
              boxShadow: 6,
              backgroundColor: theme.palette.action.hover,
            },
          }}
          onClick={handleOpenAutoDialog}
        >
          <AddIcon sx={{ fontSize: 80 }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Crear Playlist Automática
          </Typography>
        </Card>
        {/* Resto de playlists */}
        {Array.isArray(playlists) && playlists.map((playlist) => (
          <Card
            key={playlist.id}
            sx={{
              width: 320,
              height: 320,
              position: "relative",
              margin: 1,
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              p: 0,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* Botones en la parte superior derecha */}
            <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2, display: "flex", gap: 1 }}>
              <Button
                type="button"
                variant="text"
                size="small"
                sx={{
                  minWidth: 0,
                  p: 1,
                  color: theme => theme.palette.text.primary,
                  "&:hover": { backgroundColor: theme => theme.palette.action.hover }
                }}
                onClick={() => handleEditClick(playlist)}
              >
                <EditIcon />
              </Button>
              <Button
                type="button"
                variant="text"
                size="small"
                sx={{
                  minWidth: 0,
                  p: 1,
                  color: theme => theme.palette.error.main,
                  "&:hover": { backgroundColor: theme => theme.palette.action.hover }
                }}
                onClick={() => {
                  setPlaylists(prev => prev.filter(pl => pl.id !== playlist.id));
                }}
              >
                <DeleteIcon />
              </Button>
            </Box>
            <CardContent
              sx={{
                flex: 1,
                pb: 2,
                pt: 3,
                px: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                height: "100%",
                overflow: "hidden",
                textAlign: "justify" // justifica el texto
              }}
            >
              {/* Imagen de la playlist */}
              {playlist.image && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2, width: "100%" }}>
                  <img
                    src={playlist.image}
                    alt={playlist.name}
                    style={{
                      width: "70%",
                      maxWidth: 120,
                      height: "auto",
                      aspectRatio: "1/1",
                      borderRadius: 12,
                      objectFit: "cover",
                      display: "block",
                      margin: "0 auto"
                    }}
                  />
                </Box>
              )}
              {/* Nombre de la playlist */}
              <Typography
                variant="h6"
                component="div"
                sx={{
                  mb: 1,
                  width: "100%",
                  textAlign: "center", // centrado
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {playlist.name}
              </Typography>
              {/* Botón para ver canciones */}
              {playlist.tracks && Array.isArray(playlist.tracks) && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 2,
                    mt: 1,
                    borderRadius: "9999px",
                    fontWeight: "bold",
                    textTransform: "none",
                    width: "100%",
                    maxWidth: 220
                  }}
                  onClick={() => {
                    setSongsPlaylist(playlist);
                    setSongsDialogOpen(true);
                  }}
                >
                  Ver canciones
                </Button>
              )}
              {/* Espaciador flexible para ajustar el contenido */}
              <Box sx={{ flex: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
      {/* Dialogo de edición similar a NavMenu */}
      {selectedPlaylist && (
        <CustomDialog
          open={editOpen}
          onClose={handleDialogClose}
          onConfirm={handleDialogAccept}
          buttons={[
            { label: "Cancelar", color: "secondary" },
            { label: "Guardar", color: "primary" }
          ]}
        >
          <Form
            ref={formRef}
            title="Editar Playlist"
            fields={[
              { name: "name", label: "Nombre", type: "text" },
              { name: "description", label: "Descripción", type: "text" },
            ]}
            initialValues={{
              name: selectedPlaylist.name,
              description: selectedPlaylist.description,
            }}
            onSubmit={handleEditSubmit}
            buttonText=""
            showButton={false}
            showHomeButton={false}
            noBackground
          />
        </CustomDialog>
      )}
      {/* Diálogo para generación automática */}
      <CustomDialog
        open={autoDialogOpen}
        onClose={handleCloseAutoDialog}
        onConfirm={handleAutoGenerate}
        buttons={[
          { label: "Cancelar", color: "secondary" },
          { label: autoLoading ? "Generando..." : "Crear", color: "primary" }
        ]}
      >
        <Box
          component="form"
          onSubmit={e => { e.preventDefault(); handleAutoGenerate(); }}
          sx={{
            width: "600px", // <-- más ancho
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Ingresa un prompt para tu playlist
          </Typography>
          {!autoLoading && (
            <textarea
              ref={autoTextareaRef}
              value={autoPrompt}
              onChange={e => setAutoPrompt(e.target.value)}
              rows={5}
              style={{
                width: "100%",
                minHeight: "100px",
                maxHeight: "180px",
                resize: "none",
                padding: "12px",
                borderRadius: "8px",
                border: `1px solid ${theme.palette.custom?.outlinedBorder || "#ccc"}`,
                fontSize: "1rem",
                color: theme.palette.text.primary,
                background: theme.palette.background.paper,
                fontFamily: "inherit",
                boxSizing: "border-box",
                overflowY: "auto",
                overflowX: "hidden"
              }}
              disabled={autoLoading}
              placeholder="Ejemplo: Playlist para una tarde de lluvia y café"
            />
          )}
          {autoError && (
            <Typography color="error" variant="body2">
              {autoError}
            </Typography>
          )}
          {autoLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100px", // igual que el textarea
                width: "100%"
              }}
            >
              <CircularProgress size={28} />
            </Box>
          )}
        </Box>
      </CustomDialog>
      {/* Dialog para ver canciones */}
      <CustomDialog
        open={songsDialogOpen}
        onClose={() => setSongsDialogOpen(false)}
        onConfirm={() => setSongsDialogOpen(false)}
        buttons={[
          { label: "Cerrar", color: "primary" }
        ]}
      >
        <Box sx={{ width: "100%", maxWidth: 500, maxHeight: 400, overflowY: "auto" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Canciones de {songsPlaylist?.name}
          </Typography>
          {songsPlaylist?.tracks && Array.isArray(songsPlaylist.tracks) ? (
            songsPlaylist.tracks.map((track: any, idx: number) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                  {track.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Array.isArray(track.artists) ? track.artists.join(", ") : track.artists}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay canciones en esta playlist.
            </Typography>
          )}
        </Box>
      </CustomDialog>
    </Box>
  );
};

export default PlaylistCards;
