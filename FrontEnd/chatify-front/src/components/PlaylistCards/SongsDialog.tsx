import CustomDialog from "../Dialog/Dialog";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import React, { useState } from "react";
import { removeTracksFromPlaylist, fetchLyrics } from "../../api/spotifyService";
import LyricsDialog from "./LyricsDialog";

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
  const [loading, setLoading] = useState<string | null>(null);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyrics, setLyrics] = useState<string>("");
  const [lyricsSong, setLyricsSong] = useState<{ artist: string; name: string } | null>(null);

  // Actualiza tracks si cambia la playlist
  React.useEffect(() => {
    setTracks(playlist?.tracks || []);
  }, [playlist]);

  const handleRemoveTrack = async (trackUri: string, idx: number) => {
    setLoading(trackUri);
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
    setLoading(null);
  };

  const handleShowLyrics = async (track: any) => {
    setLyricsOpen(true);
    setLyrics("");
    setLyricsSong({ artist: Array.isArray(track.artists) ? track.artists[0] : track.artists, name: track.name });
    setLyricsLoading(true);
    try {
      const artist = Array.isArray(track.artists) ? track.artists[0] : track.artists;
      const l = await fetchLyrics(artist, track.name);
      setLyrics(l);
    } catch (e) {
      setLyrics("No se pudo obtener la letra.");
    }
    setLyricsLoading(false);
  };

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
              <Button
                type="button"
                variant="text"
                size="small"
                sx={{
                  minWidth: 0,
                  p: 1,
                  color: (theme) => theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                  "&:focus": {
                    outline: "none",
                    border: "none",
                    boxShadow: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                    border: "none",
                    boxShadow: "none",
                  },
                  "&:active": {
                    outline: "none",
                    border: "none",
                    boxShadow: "none",
                  },
                }}
                onClick={() => handleShowLyrics(track)}
                disabled={lyricsLoading}
              >
                <MusicNoteIcon />
              </Button>
              <Button
                type="button"
                variant="text"
                size="small"
                sx={{
                  minWidth: 0,
                  p: 1,
                  color: (theme) => theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                  "&:focus": {
                    outline: "none",
                    border: "none",
                    boxShadow: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                    border: "none",
                    boxShadow: "none",
                  },
                  "&:active": {
                    outline: "none",
                    border: "none",
                    boxShadow: "none",
                  },
                }}
                onClick={() => handleRemoveTrack(track.uri, idx)}
                disabled={loading === track.uri}
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
      <LyricsDialog
        open={lyricsOpen}
        onClose={() => setLyricsOpen(false)}
        lyrics={lyrics}
        loading={lyricsLoading}
        song={lyricsSong}
      />
    </CustomDialog>
  );
};

export default SongsDialog;
