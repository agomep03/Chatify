import CustomDialog from "../../../Dialog/Dialog";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import React, { useState } from "react";
import { removeTracksFromPlaylist, fetchLyrics } from "../../../../api/spotifyService";
import LyricsDialog from "./LyricsDialog";
import ConfirmDeleteDialog from "../../../Dialog/ConfirmDeleteDialog/ConfirmDeleteDialog";
import { getScrollbarStyles } from "../../../../styles/scrollbarStyles";
import CustomDialogDarkBackground from "../../../Dialog/CustomDialogs/CustomDialogDarkBackground";
import CustomDialogDefault from "../../../Dialog/CustomDialogs/CustomDialogDefault";

/**
 * Diálogo para mostrar y gestionar las canciones de una playlist.
 * @component
 * @param {boolean} open - Si el diálogo está abierto.
 * @param {object} playlist - Objeto con los datos de la playlist (incluye tracks).
 * @param {() => void} onClose - Callback para cerrar el diálogo.
 * @returns {JSX.Element} Diálogo con la lista de canciones, opciones para ver letra y eliminar canciones.
 * @description
 * Muestra un diálogo con la lista de canciones de la playlist.
 * Permite ver la letra de cada canción y eliminar canciones de la playlist.
 * Usa diálogos secundarios para confirmar el borrado y mostrar la letra.
 */

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
  const [tracks, setTracks] = useState<any[]>(playlist?.tracks || []);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyrics, setLyrics] = useState<string>("");
  const [lyricsSong, setLyricsSong] = useState<{ artist: string; name: string } | null>(null);
  const [openConfirm, setOpenConfirm] = useState<{ idx: number; track: any } | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [notFoundDialog, setNotFoundDialog] = useState(false);
  const [captchaDialog, setCaptchaDialog] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState<string | null>(null);

  // Actualiza tracks si cambia la playlist
  React.useEffect(() => {
    setTracks(playlist?.tracks || []);
  }, [playlist]);

  // Elimina una canción de la playlist
  const handleRemoveTrack = async (trackUri: string, idx: number) => {
    setLoadingDelete(true);
    try {
      await removeTracksFromPlaylist(
        playlist.id,
        [{ uri: trackUri }],
        playlist.snapshot_id
      );
      setTracks((prev) => prev.filter((_, i) => i !== idx));
    } catch (e) {
      // Manejo de error opcional
    }
    setLoadingDelete(false);
    setOpenConfirm(null);
  };

  // Muestra la letra de una canción
  const handleShowLyrics = async (track: any) => {
    setLyricsOpen(true);
    setLyrics("");
    setLyricsSong({ artist: Array.isArray(track.artists) ? track.artists[0] : track.artists, name: track.name });
    setLyricsLoading(true);
    try {
      const artist = Array.isArray(track.artists) ? track.artists[0] : track.artists;
      const result = await fetchLyrics(artist, track.name);

      if (
        typeof result === "object" &&
        result !== null &&
        "Type" in result
      ) {
        const typedResult = result as { Type: string; url?: string };
        if (typedResult.Type === "Redirect" && typedResult.url) {
          window.open(typedResult.url, "_blank");
          setLyricsOpen(false);
        } else if (typedResult.Type === "Captcha") {
          setCaptchaUrl(typedResult.url ?? null);
          setCaptchaDialog(true);
          setLyricsOpen(false);
        } else if (typedResult.Type === "Error") {
          setNotFoundDialog(true);
          setLyricsOpen(false);
        }
      } else if (typeof result === "string" && result.startsWith("http")) {
        window.open(result, "_blank");
        setLyricsOpen(false);
      } else {
        setNotFoundDialog(true);
        setLyricsOpen(false);
      }
    } catch (e) {
      setNotFoundDialog(true);
      setLyricsOpen(false);
    }
    setLyricsLoading(false);
  };

  const buttonStyle = {
    minWidth: 0,
    p: 1,
    color: (theme: any) => theme.palette.text.primary,
    "&:hover": {
      backgroundColor: (theme: any) => theme.palette.action.hover,
    },
    "&:focus, &:focus-visible, &:active": {
      outline: "none",
      border: "none",
      boxShadow: "none",
    },
  };

  return (
    <>
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
            ...getScrollbarStyles(theme),
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Canciones de {playlist?.name}
          </Typography>
          {/* Lista de canciones */}
          {tracks && Array.isArray(tracks) ? (
            tracks.map((track: any, idx: number) => (
              <Box
                key={track.uri || idx}
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
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
                {/* Botón para ver la letra */}
                <Button
                  type="button"
                  variant="text"
                  size="small"
                  sx={buttonStyle}
                  onClick={() => handleShowLyrics(track)}
                  disabled={lyricsLoading}
                >
                  <MusicNoteIcon />
                </Button>
                {/* Botón para eliminar canción */}
                <Button
                  type="button"
                  variant="text"
                  size="small"
                  sx={buttonStyle}
                  onClick={() => setOpenConfirm({ idx, track })}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay canciones en esta playlist.
            </Typography>
          )}
        </Box>
        {/* Diálogo para mostrar la letra de la canción */}
        <LyricsDialog
          open={lyricsOpen}
          onClose={() => setLyricsOpen(false)}
          lyrics={lyrics}
          loading={lyricsLoading}
          song={lyricsSong}
        />
        {/* Diálogo de confirmación para eliminar canción */}
        <ConfirmDeleteDialog
          open={!!openConfirm}
          onClose={() => { if (!loadingDelete) setOpenConfirm(null); }}
          onConfirm={() => openConfirm && handleRemoveTrack(openConfirm.track.uri, openConfirm.idx)}
          itemName={openConfirm?.track?.name}
          loading={loadingDelete}
        />
      </CustomDialog>
      <CustomDialogDarkBackground
        open={notFoundDialog}
        onClose={() => setNotFoundDialog(false)}
        buttons={[
          { label: "Cerrar", color: "primary", action: () => setNotFoundDialog(false) }
        ]}
        title="Letra no encontrada"
      >
        <Typography variant="body1" sx={{ p: 2 }}>
          No se encontró la letra de la canción en Genius.
        </Typography>
      </CustomDialogDarkBackground>

      <CustomDialogDefault
        open={captchaDialog}
        onClose={() => setCaptchaDialog(false)}
        buttons={[
          {
            label: "Cancelar",
            color: "secondary",
            action: () => setCaptchaDialog(false),
          },
          {
            label: "Aceptar",
            color: "primary",
            action: () => {
              if (captchaUrl) window.open(captchaUrl, "_blank");
              setCaptchaDialog(false);
            },
          },
        ]}
      >
        <Typography variant="body1" sx={{ p: 2 }}>
          DuckDuckGo requiere resolver un captcha manualmente para continuar buscando letras.
          Pulsa "Aceptar" para abrir el captcha en una nueva pestaña o "Cancelar" para cerrar.
        </Typography>
      </CustomDialogDefault>
    </>
  );
};

export default SongsDialog;
