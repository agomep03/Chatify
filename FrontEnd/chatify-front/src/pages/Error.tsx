import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import CustomDialog from '../components/Dialog/Dialog';

/**
 * Página de error genérica.
 * @component
 * @returns {JSX.Element} Diálogo modal mostrando el motivo del error y redirige al login al cerrar.
 * @description
 * Muestra un diálogo con el mensaje de error recibido por query param (?reason=...).
 * Al cerrar el diálogo, redirige automáticamente a la página de login.
 */

const PageError: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("No se ha especificado el error");


  const handleClose = () => {
    setOpen(false);
    navigate("/login"); // Redirige al login
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let reason = params.get("reason");

    if (reason) {
      setReason(reason);
    }else{
      setReason("No se ha especificado el error");
    }

    setOpen(true);
  }, [location]);

  return (
    <Box
      sx={{
        position: "relative",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
        <CustomDialog
            open={open}
            onClose={handleClose}
            onConfirm={handleClose}
            buttons={[{ label: "Aceptar", color: "primary" }]}
          >
            <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Ha ocurrido un error
                </Typography>
                <Typography variant="h6" color="error">
                    {reason}
                </Typography>
            </Box>
        </CustomDialog>
      
    </Box>
  );
};

export default PageError;
