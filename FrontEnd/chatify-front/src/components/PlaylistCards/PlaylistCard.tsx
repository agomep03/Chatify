import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AppButton from "../Buttons/AppButton/AppButton";
import { deleteUserPlaylist } from "../../api/spotifyService";
import { useState } from "react";
import ConfirmDeleteDialog from "../Dialog/ConfirmDeleteDialog/ConfirmDeleteDialog";

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
  theme: any;
}) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

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
        <Typography
          variant="h6"
          component="div"
          sx={{
            mb: 1,
            width: "100%",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {playlist.name}
        </Typography>
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
      <ConfirmDeleteDialog
        open={openConfirm}
        onClose={() => { if (!loadingDelete) setOpenConfirm(false); }}
        onConfirm={handleDelete}
        itemName={playlist.name}
        loading={loadingDelete}
      />
    </Card>
  );
};

export default PlaylistCard;
