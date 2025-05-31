import { Button, ButtonProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * Botón personalizado reutilizable para la aplicación.
 * @component
 * @param {ButtonProps} props - Todas las props estándar de MUI Button.
 * @param {string} [size="small"] - Tamaño del botón (por defecto "small").
 * @param {string} [color="primary"] - Color del botón (por defecto "primary").
 * @param {string} [variant="contained"] - Variante del botón (por defecto "contained").
 * @param {object} [sx] - Estilos adicionales para sobrescribir los estilos por defecto.
 * @returns {JSX.Element} Botón estilizado y consistente con el diseño de la app.
 * @description
 * Este componente centraliza el estilo de los botones principales de la app.
 * Usa bordes redondeados, fuente en negrita y ancho fijo.
 * Permite sobrescribir estilos y acepta todas las props estándar de Button de MUI.
 */
const AppButton = ({
  size = "small",
  sx,
  color = "primary",
  variant = "contained",
  ...props
}: ButtonProps) => {
  const theme = useTheme();
  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      sx={{
        borderRadius: "var(--encore-button-corner-radius, 9999px)",
        fontWeight: "bold",
        fontSize: "1rem",
        textTransform: "none",
        backgroundColor:
          variant === "contained" ? theme.palette.primary.main : undefined,
        color:
          variant === "contained"
            ? theme.palette.primary.contrastText
            : undefined,
        width: 220,
        maxWidth: 220,
        minWidth: 220,
        "&:hover": {
          backgroundColor:
            variant === "contained"
              ? theme.palette.custom.primaryHover
              : undefined,
        },
        "&:focus": { outline: "none", border: "none", boxShadow: "none" },
        "&:focus-visible": {
          outline: "none",
          border: "none",
          boxShadow: "none",
        },
        "&:active": { outline: "none", border: "none", boxShadow: "none" },
        ...sx,
      }}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default AppButton;
