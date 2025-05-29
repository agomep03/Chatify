import { Button, ButtonProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
