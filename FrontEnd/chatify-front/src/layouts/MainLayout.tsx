import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import TopBar from "../components/TopBar/TopBarHome";
import NavMenu from "../components/NavMenu/NavMenu";
import Chat from "./ChatLayout";
import { useAlert } from "../components/Alert/Alert";
import {
  fetchDeleteChat,
  fetchStartChat,
  fetchUpdateChatTitle,
  fetchObtainAllChats,
} from "../api/chatService";
import PlaylistCards from "./PlaylistCardsLayout";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/**
 * Layout principal de la aplicación (zona privada tras login).
 * @component
 * @param {() => void} toggleTheme - Función para alternar entre modo claro y oscuro.
 * @returns {JSX.Element} Layout con barra superior, menú lateral de navegación, y contenido principal (chats o playlists).
 * @description
 * Gestiona la navegación entre chats y playlists, el estado de los chats, y muestra el contenido correspondiente según la tab seleccionada.
 * Permite crear, eliminar y renombrar chats. El menú lateral es responsivo y puede ocultarse en pantallas pequeñas.
 */

interface Chat {
  id: string;
  title: string;
}

type MainLayoitProps = {
  toggleTheme: () => void;
};

const MainLayout: React.FC<MainLayoitProps> = ({ toggleTheme }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("playlists");
  const { customAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const theme = useTheme();
  const computerScreenIsSmall = useMediaQuery("(max-width:1200px)");

  const allTabs = [
    { id: "playlists", title: "Playlists" },
    { id: "add", title: "Nueva conversación" },
    ...chats,
  ];

  const closableTabs = [false, false, ...chats.map(() => true)];

  /**
   * Elimina un chat por id.
   * Si el chat eliminado estaba seleccionado, vuelve a la tab de playlists.
   * Actualiza la lista de chats tras la eliminación.
   */
  const handleTabClose = async (tadId: string) => {
    const chat = chats.find((c) => c.id === tadId);
    if (!chat) return;
    setChats((prev) => prev.filter((c) => c.id !== chat.id)); //Actualizo localmente

    try {
      if (String(selectedTab) === String(chat.id)) {
        setSelectedTab("playlists");
      }
      await fetchDeleteChat(chat.id);
    } catch (error) {
      console.error(error);
      customAlert("error", "Error al eliminar conversación");
    }
    await fetchChats();
  };

  /**
   * Renombra un chat.
   * Actualiza el título localmente y en el backend.
   */
  const handleTabRename = async (chatId: string, newTitle: string) => {
    try {
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c))
      );
      await fetchUpdateChatTitle(chatId, newTitle);
    } catch (error) {
      console.error(error);
      customAlert("error", "Error al renombrar conversación");
    }
    await fetchChats();
  };

  /**
   * Inicia una nueva conversación.
   * Crea el chat en backend y lo selecciona.
   */
  const handleStartChat = async () => {
    try {
      setIsLoading(true);
      const chatId = await fetchStartChat();
      await fetchChats();
      setSelectedTab(chatId);
    } catch (error) {
      console.error(error);
      customAlert("error", "Error al iniciar conversación");
    }
    setIsLoading(false);
  };

  /**
   * Obtiene todos los chats del usuario.
   */
  const fetchChats = async () => {
    try {
      const data = await fetchObtainAllChats();
      setChats(data);
    } catch (error) {
      customAlert("error", "Error al obtener chats");
    }
  };

  // Carga los chats al montar el componente
  useEffect(() => {
    const loadChats = async () => {
      await fetchChats();
    };
    loadChats();
  }, []);

  // Si la tab seleccionada es "add", inicia una nueva conversación
  useEffect(() => {
    if (selectedTab === "add") {
      handleStartChat();
    }
  }, [selectedTab]);

  // Si la pantalla no es pequeña, muestra el menú lateral por defecto
  useEffect(() => {
    if (!computerScreenIsSmall) {
      setShowNav(true);
    }
  }, [computerScreenIsSmall]);

  /**
   * Cambia la tab seleccionada y oculta el menú lateral en pantallas pequeñas.
   */
  const handleOnTabChange = (tab: string) => {
    setSelectedTab(tab);
    if (computerScreenIsSmall) setShowNav(false);
  };

  /**
   * Renderiza el contenido principal según la tab seleccionada.
   * - "playlists": muestra las playlists
   * - "add": muestra un placeholder vacío
   * - id de chat: muestra el chat correspondiente
   */
  const renderTabContent = () => {
    if (selectedTab === "playlists") {
      return <PlaylistCards />;
    }

    if (selectedTab == "add") {
      return <div></div>;
    }

    const chat = chats.find((chat) => String(chat.id) === String(selectedTab));
    if (chat) {
      return <Chat chatId={chat.id} fetchChats={fetchChats} />;
    }
    return <div>Tab no encontrada</div>;
  };

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
      {/* Barra superior con botón de menú y cambio de tema */}
      <TopBar toggleTheme={toggleTheme} onToggleNav={() => setShowNav(prev => !prev)}/>
      <Box
        sx={{ display: "flex", flex: 1, width: "100%", overflowX: "hidden" }}
      >
        {/* Menú lateral de navegación (NavMenu) */}
        <Box
          sx={{
            width: showNav ? 280 : 0,
            flexShrink: 0,
            backgroundColor: theme.palette.background.default,
            height: "100%",
            '@media (max-width:600px)': {
              position: 'absolute',
              zIndex: 10,
              height: '100%',
              boxShadow: showNav ? 4 : 0,
            },
          }}
        >
          <NavMenu
            tabs={allTabs}
            closableTabs={closableTabs}
            selectedTab={selectedTab}
            onTabChange={handleOnTabChange}
            onTabClose={handleTabClose}
            onTabRename={handleTabRename}
          />
        </Box>
        {/* Contenido principal: playlists o chat */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: theme.palette.custom.tabBg,
          }}
        >
          {isLoading ? (
            <Box
              height="100vh"
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
            </Box>
          ) : (
            renderTabContent()
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
