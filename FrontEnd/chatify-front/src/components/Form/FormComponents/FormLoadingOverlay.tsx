import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface FormLoadingOverlayProps {
  loading?: boolean;
  noBackground?: boolean;
}

const FormLoadingOverlay = ({
  loading = false,
  noBackground = false,
}: FormLoadingOverlayProps) => {
  const theme = useTheme();

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bgcolor: noBackground
          ? "transparent"
          : theme.palette.background.default,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,
        zIndex: 10,
      }}
    >
      <CircularProgress sx={{ color: theme.palette.text.primary }} />
    </Box>
  );
};

export default FormLoadingOverlay;
