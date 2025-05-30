import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TopBar from "../components/TopBar/TopBarLoginRegister";
import imageBackgroundLight from "../assets/background_music.jpeg";
import imageBackgroundDark from "../assets/background_music_dark.jpeg";

type LoginRegisterLayoutProps = {
  children: React.ReactNode;
  toggleTheme: () => void;
};

const LoginRegisterLayout: React.FC<LoginRegisterLayoutProps> = ({ children, toggleTheme }) => {
  const theme = useTheme();
  const backgroundImage =
    theme.palette.mode === "dark"
      ? `url(${imageBackgroundDark})`
      : `url(${imageBackgroundLight})`;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.palette.background.paper,
        backgroundImage: backgroundImage,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflow: "hidden",
        zIndex: 0,
        position: "relative",
      }}
    >
      <TopBar toggleTheme={toggleTheme} />
      {children}
    </Box>
  );
};

export default LoginRegisterLayout;