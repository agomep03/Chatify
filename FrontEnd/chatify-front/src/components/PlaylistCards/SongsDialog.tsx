import CustomDialog from "../Dialog/Dialog";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SongsDialog = ({
  open,
  playlist,
  onClose,
}: {
  open: boolean;
  playlist: any;
  onClose: () => void;
}) => {
  const theme = useTheme();
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      onConfirm={onClose}
      buttons={[{ label: "Cerrar", color: "primary" }]}
    >
      <Box
        sx={{
          m: 1,
          p: 3,
          width: "100%",
          maxWidth: 500,
          maxHeight: 400,
          overflowY: "auto",
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
        <Typography variant="h6" sx={{ mb: 2 }}>
          Canciones de {playlist?.name}
        </Typography>
        {playlist?.tracks && Array.isArray(playlist.tracks) ? (
          playlist.tracks.map((track: any, idx: number) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ fontWeight: 500 }}
              >
                {track.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Array.isArray(track.artists)
                  ? track.artists.join(", ")
                  : track.artists}
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
  );
};

export default SongsDialog;
