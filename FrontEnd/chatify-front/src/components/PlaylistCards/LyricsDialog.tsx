import { Dialog, DialogTitle, DialogContent, Typography, CircularProgress, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {song ? `Letra de "${song.name}"` : "Letra"}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          outline: "none",
          border: "none",
          boxShadow: "none",
          "&:focus": { outline: "none", border: "none", boxShadow: "none" },
          "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
          "&:active": { outline: "none", border: "none", boxShadow: "none" },
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
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
    </DialogContent>
  </Dialog>
);

export default LyricsDialog;
