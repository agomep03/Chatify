import { Card, CardContent, Box, Typography, Button, IconButton, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import AppButton from "../../Buttons/AppButton/AppButton";
import { deleteUserPlaylist } from "../../../api/spotifyService";
import { useState } from "react";
import ConfirmDeleteDialog from "../../Dialog/ConfirmDeleteDialog/ConfirmDeleteDialog";
import CustomDialog from "../../Dialog/Dialog";
import ScrollableText from "../../ScrollableText/ScrollableText";

/**
 * Tarjeta que muestra la información de una playlist.
 * @component
 * @param {object} playlist - Objeto con los datos de la playlist.
 * @param {(playlist: any) => void} onEdit - Callback para editar la playlist.
 * @param {(playlistId: string) => void} onDelete - Callback para eliminar la playlist.
 * @param {(playlist: any) => void} onShowSongs - Callback para mostrar las canciones de la playlist.
 * @param {any} theme - Tema de MUI (no se usa directamente aquí, pero puede venir de props).
 * @returns {JSX.Element} Tarjeta con imagen, nombre, descripción, botones de acción y diálogos.
 * @description
 * Muestra la imagen, nombre y descripción de una playlist.
 * Permite editar, eliminar y ver canciones de la playlist.
 * Incluye diálogos de confirmación para eliminar y para mostrar la descripción completa.
 */

const PlaylistCard = ({
  playlist,
  onEdit,
  onDelete,
  onShowSongs,
}: {
  playlist: any;
  onEdit: (playlist: any) => void;
  onDelete: (playlistId: string) => void;
  onShowSongs: (playlist: any) => void;
}) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const theme = useTheme();

  // Maneja la eliminación de la playlist
  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteUserPlaylist(playlist.id);
      onDelete(playlist.id);
    } catch (e) {
      // Manejo de error opcional
    }
    setLoadingDelete(false);
    setOpenConfirm(false);
  };

  return (
    <Card
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
        justifyContent: "center",
      }}
    >
      {/* Botones de editar y eliminar en la esquina superior derecha */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          display: "flex",
          gap: 1,
        }}
      >
        <Button
          type="button"
          variant="text"
          size="small"
          sx={{
            minWidth: 0,
            p: 1,
            color: (theme) => theme.palette.text.primary,
            "&:hover": { backgroundColor: (theme) => theme.palette.action.hover },
            "&:focus": { outline: "none", border: "none", boxShadow: "none" },
            "&:focus-visible": {
              outline: "none",
              border: "none",
              boxShadow: "none",
            },
            "&:active": { outline: "none", border: "none", boxShadow: "none" },
          }}
          onClick={() => onEdit(playlist)}
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
            color: theme.palette.text.primary,
            "&:hover": { backgroundColor: theme.palette.action.hover },
            "&:focus": { outline: "none", border: "none", boxShadow: "none" },
            "&:focus-visible": {
              outline: "none",
              border: "none",
              boxShadow: "none",
            },
            "&:active": { outline: "none", border: "none", boxShadow: "none" },
          }}
          onClick={() => setOpenConfirm(true)}
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
          textAlign: "justify",
        }}
      >
        {/* Imagen de la playlist */}
        {playlist.image && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              width: "100%",
            }}
          >
            <img
              src={playlist.image}
              alt={playlist.name}
              style={{
                width: "120px",
                height: "120px",
                aspectRatio: "1/1",
                borderRadius: 12,
                objectFit: "cover",
                display: "block",
                margin: "0 auto",
              }}
            />
          </Box>
        )}
        {/* Fila: título centrado y botón info a la derecha */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            mb: 1,
            height: 32, // ajusta según el alto de tu texto/botón
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Texto centrado */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 200,
              mx: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "auto",
            }}
          >
            <ScrollableText text={playlist.name} selected={false} center />
          </Box>
          {/* Botón info a la derecha */}
            <IconButton
            size="small"
            sx={{
              position: "absolute",
              right: 0,
              top: "0%",
              transform: "translateY(-50%)",
              minWidth: 0,
              p: "2px",
              color: theme.palette.text.primary,
              "& svg": { fontSize: 16 },
              "&:hover": { backgroundColor: theme.palette.action.hover },
              "&:focus": { outline: "none", border: "none", boxShadow: "none" },
              "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
              "&:active": { outline: "none", border: "none", boxShadow: "none" },
              zIndex: 1,
            }}
            onClick={() => setOpenInfo(true)}
            aria-label="Mostrar descripción"
            >
            <InfoIcon fontSize="inherit" />
            </IconButton>
        </Box>
        {/* Botón para ver canciones si existen */}
        {playlist.tracks && Array.isArray(playlist.tracks) && (
          <AppButton
            size="small"
            sx={{ mb: 2, mt: 1 }}
            onClick={() => onShowSongs(playlist)}
          >
            Ver canciones
          </AppButton>
        )}
      </CardContent>
      {/* Diálogo de confirmación para eliminar la playlist */}
      <ConfirmDeleteDialog
        open={openConfirm}
        onClose={() => { if (!loadingDelete) setOpenConfirm(false); }}
        onConfirm={handleDelete}
        itemName={playlist.name}
        loading={loadingDelete}
      />
      {/* Diálogo para mostrar la descripción completa */}
      <CustomDialog
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        onConfirm={() => setOpenInfo(false)}
        dialogStyle="darkBackground"
        title={`Descripción de "${playlist.name}"`}
        showCloseIcon={true}
        buttons={[]}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {playlist.description || "Sin descripción"}
        </Typography>
      </CustomDialog>
    </Card>
  );
};

export default PlaylistCard;
