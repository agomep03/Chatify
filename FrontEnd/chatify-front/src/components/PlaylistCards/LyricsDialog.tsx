import { Typography, CircularProgress, Box } from "@mui/material";
import CustomDialogDarkBackground from "../Dialog/CustomDialogs/CustomDialogDarkBackground";

const LyricsDialog = ({
  open,
  onClose,
  lyrics,
  loading,
  song,
}: {
  open: boolean;
  onClose: () => void;
  lyrics: string;
  loading: boolean;
  song: { artist: string; name: string } | null;
}) => (
  <CustomDialogDarkBackground
    open={open}
    onClose={onClose}
    onConfirm={onClose}
    buttons={[
      {
        label: "Cerrar",
        color: "primary",
        action: onClose,
      },
    ]}
    title={song ? `Letra de "${song.name}"` : "Letra"}
    showCloseIcon
  >
    {loading ? (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
        <CircularProgress />
      </Box>
    ) : (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: "pre-line",
          fontFamily: "monospace",
          maxHeight: 350,
          overflowY: "auto",
        }}
      >
        {lyrics}
      </Typography>
    )}
  </CustomDialogDarkBackground>
);

export default LyricsDialog;
