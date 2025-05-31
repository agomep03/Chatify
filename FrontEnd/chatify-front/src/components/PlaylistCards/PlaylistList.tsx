import PlaylistCard from "./PlaylistCard/PlaylistCard";

const PlaylistList = ({
  playlists,
  onEdit,
  onDelete,
  onShowSongs,
  theme,
}: {
  playlists: any[];
  onEdit: (playlist: any) => void;
  onDelete: (playlistId: string) => void;
  onShowSongs: (playlist: any) => void;
  theme: any;
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
          theme={theme}
        />
      ))}
  </>
);

export default PlaylistList;
