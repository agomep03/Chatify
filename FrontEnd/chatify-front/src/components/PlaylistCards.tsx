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

/**
 * Componente para mostrar las playlists del usuario en forma de tarjetas.
 * @returns {JSX.Element} Componente de tarjetas de playlists.
 */
const PlaylistCards: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para controlar el diálogo y la playlist seleccionada
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);

  // Ref para el formulario de edición
  const formRef = useRef<HTMLFormElement>(null);

  // Usamos theme para los colores
  const theme = useTheme();

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
      {
        id: 4,
        name: "Playlist 4",
        description: "Descripción de la playlist 4",
      },
    ];

    // Simular llamada a la API
    setTimeout(() => {
      setPlaylists(mockPlaylists);
      setLoading(false);
    }, 1000);
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

  // Handler para simular la edición (no hay endpoint)
  const handleEditSubmit = (formData: Record<string, string>) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === selectedPlaylist.id
          ? { ...pl, ...formData }
          : pl
      )
    );
    handleDialogClose();
  };

  // Handler para aceptar el dialog (dispara el submit del form)
  const handleDialogAccept = () => {
    formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
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
          gap: 2, // Espacio consistente entre cartas
        }}
      >
        {playlists.map((playlist) => (
          <Card key={playlist.id} sx={{ width: 500, height: 500, position: "relative", margin: 1 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {playlist.name}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {playlist.description}
              </Typography>
              {/* Botón para editar */}
              <Button
                type="button"
                variant="contained"
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 130,
                  minWidth: 0,
                  width: "110px",
                  px: 2,
                  py: 0.5,
                  backgroundColor: theme => theme.palette.primary.main,
                  color: theme => theme.palette.primary.contrastText,
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  borderRadius: "9999px",
                  textTransform: "none",
                  boxShadow: "none",
                  // Añadir gap con el botón de eliminar
                  marginRight: "10px",
                  "&:hover": { backgroundColor: theme => theme.palette.custom.primaryHover },
                  "&:focus": { outline: "none", border: "none", boxShadow: "none" },
                  "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
                  "&:active": { outline: "none", border: "none", boxShadow: "none" },
                }}
                onClick={() => handleEditClick(playlist)}
              >
                Editar
              </Button>
              {/* Botón para eliminar */}
              <Button
                type="button"
                variant="outlined"
                size="small"
                color="secondary"
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  minWidth: 0,
                  width: "110px",
                  px: 2,
                  py: 0.5,
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  borderRadius: "9999px",
                  textTransform: "none",
                  boxShadow: "none",
                  borderColor: theme => theme.palette.custom.outlinedBorder,
                  color: theme => theme.palette.text.primary,
                  "&:hover": {
                    borderColor: theme => theme.palette.text.primary,
                  },
                  "&:focus": { outline: "none", border: "none", boxShadow: "none" },
                  "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
                  "&:active": { outline: "none", border: "none", boxShadow: "none" },
                }}
                onClick={() => {
                  // Simular eliminación local (en el futuro llamar al endpoint)
                  setPlaylists(prev => prev.filter(pl => pl.id !== playlist.id));
                }}
              >
                Eliminar
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      {/* Dialogo de edición similar a NavMenu */}
      <CustomDialog
        open={editOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogAccept}
        buttons={[
          { label: "Cancelar", color: "secondary" },
          { label: "Guardar", color: "primary" }
        ]}
      >
        {selectedPlaylist && (
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
        )}
      </CustomDialog>
    </Box>
  );
};

export default PlaylistCards;
