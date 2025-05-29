import { useRef } from "react";
import CustomDialog from "../Dialog";
import Form from "../Form";

const EditPlaylistDialog = ({
  open,
  playlist,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  playlist: any;
  onClose: () => void;
  onSubmit: (formData: Record<string, string>) => void;
  loading: boolean;
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleDialogAccept = () => {
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  if (!playlist) return null;

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDialogAccept}
      buttons={[
        { label: "Cancelar", color: "secondary" },
        { label: "Guardar", color: "primary" },
      ]}
    >
      <Form
        ref={formRef}
        title="Editar Playlist"
        fields={[
          { name: "name", label: "Nombre", type: "text" },
          { name: "description", label: "Descripción", type: "text" },
        ]}
        initialValues={{
          name: playlist.name,
          description: playlist.description,
        }}
        onSubmit={onSubmit}
        buttonText=""
        showButton={false}
        showHomeButton={false}
        noBackground
        loading={loading}
      />
    </CustomDialog>
  );
};

export default EditPlaylistDialog;
