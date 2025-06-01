import { useRef } from "react";
import CustomDialog from "../../../Dialog/Dialog";
import Form from "../../../Form/Form";
import { useAlert } from "../../../Alert/Alert";

/**
 * Diálogo para editar una playlist existente.
 * @component
 * @param {boolean} open - Si el diálogo está abierto.
 * @param {object} playlist - Objeto con los datos actuales de la playlist.
 * @param {() => void} onClose - Callback para cerrar el diálogo.
 * @param {(formData: Record<string, string>) => void} onSubmit - Callback al enviar el formulario.
 * @param {boolean} loading - Si está en true, deshabilita el formulario y muestra loading.
 * @returns {JSX.Element|null} Diálogo con formulario para editar nombre, descripción e imagen de la playlist.
 * @description
 * Muestra un diálogo con un formulario para editar los datos de una playlist.
 * Valida que los campos requeridos no estén vacíos antes de permitir guardar.
 * Usa el sistema de alertas para mostrar errores de validación.
 */

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
  const { customAlert } = useAlert();

  const requiredFields = [
    { name: "name", label: "Nombre" },
    { name: "description", label: "Descripción" },
    { name: "image", label: "Imagen" },
  ];

  const handleDialogAccept = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    for (const field of requiredFields) {
      const value = formData.get(field.name);
      if (!value || (typeof value === "string" && value.trim() === "")) {
        customAlert("error", `El campo "${field.label}" es obligatorio.`);
        return;
      }
    }
    formRef.current.dispatchEvent(
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
          { name: "name", label: "Nombre", type: "text", required: true },
          { name: "description", label: "Descripción", type: "text", required: true },
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
