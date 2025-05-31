import { Card, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";

/**
 * Tarjeta para crear una nueva playlist.
 * @component
 * @param {() => void} onClick - Función que se ejecuta al hacer click en la tarjeta.
 * @returns {JSX.Element} Tarjeta estilizada con icono y texto para crear una playlist.
 * @description
 * Muestra una tarjeta con borde punteado, icono de suma y texto "Crear Playlist".
 * Al hacer click, ejecuta la función onClick recibida por props.
 * El diseño es responsivo y resalta al pasar el mouse.
 */
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