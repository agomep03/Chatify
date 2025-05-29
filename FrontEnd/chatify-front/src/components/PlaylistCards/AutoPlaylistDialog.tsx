import { useRef } from "react";
import CustomDialog from "../Dialog/Dialog";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AutoPlaylistDialog = ({
  open,
  prompt,
  loading,
  error,
  onPromptChange,
  onClose,
  onGenerate,
}: {
  open: boolean;
  prompt: string;
  loading: boolean;
  error: string | null;
  onPromptChange: (value: string) => void;
  onClose: () => void;
  onGenerate: () => void;
}) => {
  const theme = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      onConfirm={onGenerate}
      buttons={[
        { label: "Cancelar", color: "secondary" },
        { label: loading ? "Generando..." : "Crear", color: "primary" },
      ]}
    >
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
        sx={{
          width: "600px",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
          Ingresa un prompt para tu playlist
        </Typography>
        {!loading && (
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              minHeight: "100px",
              maxHeight: "180px",
              resize: "none",
              padding: "12px",
              borderRadius: "8px",
              border: `1px solid ${
                theme.palette.custom?.outlinedBorder || "#ccc"
              }`,
              fontSize: "1rem",
              color: theme.palette.text.primary,
              background: theme.palette.background.paper,
              fontFamily: "inherit",
              boxSizing: "border-box",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            disabled={loading}
            placeholder="Ejemplo: Playlist para una tarde de lluvia y café"
          />
        )}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100px",
              width: "100%",
            }}
          >
            <CircularProgress size={28} />
          </Box>
        )}
      </Box>
    </CustomDialog>
  );
};

export default AutoPlaylistDialog;
