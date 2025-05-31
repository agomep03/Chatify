import PlaylistCard from "./PlaylistCard/PlaylistCard";

/**
 * Lista de tarjetas de playlists.
 * @component
 * @param {any[]} playlists - Array de objetos playlist a mostrar.
 * @param {(playlist: any) => void} onEdit - Callback para editar una playlist.
 * @param {(playlistId: string) => void} onDelete - Callback para eliminar una playlist.
 * @param {(playlist: any) => void} onShowSongs - Callback para mostrar las canciones de una playlist.
 * @returns {JSX.Element} Lista de componentes PlaylistCard.
 * @description
 * Renderiza una lista de tarjetas PlaylistCard, una por cada playlist recibida.
 * Cada tarjeta permite editar, eliminar o ver canciones de la playlist.
 */
const PlaylistList = ({
  playlists,
  onEdit,
  onDelete,
  onShowSongs,
}: {
  playlists: any[];
  onEdit: (playlist: any) => void;
  onDelete: (playlistId: string) => void;
  onShowSongs: (playlist: any) => void;
}) => (
  <>
    {Array.isArray(playlists) &&
      playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          onEdit={onEdit}
          onDelete={onDelete}
          onShowSongs={onShowSongs}
        />
      ))}
  </>
);

export default PlaylistList;
