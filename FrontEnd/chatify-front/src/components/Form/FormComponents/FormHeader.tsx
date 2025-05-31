import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Logo from "../../Logo/Logo";

interface FormHeaderProps {
  title: string;
  logoUrl?: string;
  showHomeButton?: boolean;
}

const FormHeader = ({ title, logoUrl, showHomeButton = false }: FormHeaderProps) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const navigate = useNavigate();

  const logoSrc =
    isLight && logoUrl
      ? logoUrl.replace("Logo.png", "Logo_dark.png")
      : logoUrl;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        width: "100%",
        justifyContent: "center",
        gap: showHomeButton ? 2 : 0,
      }}
    >
      {showHomeButton && (
        <Button
          variant="contained"
          size="small"
          disableRipple
          disableFocusRipple
          disableElevation
          sx={{
            boxShadow: "none",
            minWidth: 0,
            p: "6px",
            border: "none",
            backgroundColor: theme.palette.background.default,
            "&:hover": {
              backgroundColor: theme.palette.background.default,
              boxShadow: "none",
            },
            "&:active": {
              border: "none",
              outline: "none",
              boxShadow: "none",
            },
            "&:focus-visible": {
              border: "none",
              outline: "none",
              boxShadow: "none",
            },
            "&:focus": {
              border: "none",
              outline: "none",
              boxShadow: "none",
            },
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => navigate("/home")}
        >
          <ArrowBackIcon sx={{ color: theme.palette.text.primary }} />
        </Button>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 0,
          justifyContent: "center",
        }}
      >
        {logoSrc && <Logo logoUrl={logoSrc} />}
        <Typography
          variant="h5"
          sx={{ color: theme.palette.text.primary, ml: logoUrl ? 1 : 0 }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default FormHeader;
