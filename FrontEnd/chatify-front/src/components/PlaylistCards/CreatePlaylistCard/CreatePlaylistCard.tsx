import { Card, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";

const CreatePlaylistCard = ({ onClick }: { onClick: () => void }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        width: 320,
        height: 320,
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
      onClick={onClick}
    >
      <AddIcon sx={{ fontSize: 80 }} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Crear Playlist
      </Typography>
    </Card>
  );
};

export default CreatePlaylistCard;