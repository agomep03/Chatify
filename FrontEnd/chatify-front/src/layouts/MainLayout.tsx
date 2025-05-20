import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import TopBar from "../components/TopBar";
import NavMenu from "../components/NavMenu";
import Chat from "../components/Chat";
import { useAlert } from "../components/Alert";
import {
  fetchDeleteChat,
  fetchStartChat,
  fetchUpdateChatTitle,
  fetchObtainAllChats,
} from "../api/chatService";
import PlaylistCards from "../components/PlaylistCards";

interface Chat {
  id: string;
  title: string;
}

const MainLayout = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("playlists");
  const { customAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const allTabs = [
    { id: "playlists", title: "Playlists" },
    { id: "add", title: "Añadir conversación" },
    ...chats,
  ];

  const closableTabs = [false, false, ...chats.map(() => true)];

  //Para eliminar un chat
  const handleTabClose = async (tadId: string) => {
    const chat = chats.find((c) => c.id === tadId);
    if (!chat) return;
    setChats((prev) => prev.filter((c) => c.id !== chat.id)); //Actualizo localmente

    try {
      await fetchDeleteChat(chat.id);
      if (selectedTab === chat.id) {
        setSelectedTab("playlists");
      }
    } catch (error) {
      console.error(error);
      customAlert("error", "Error al eliminar conversación");
    }
    await fetchChats();
  };

  // Para renombrar conversacion
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

  // Para empezar una nueva conversación
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

  // Actualizar los chats
  const fetchChats = async () => {
    try {
      const data = await fetchObtainAllChats();
      setChats(data);
    } catch (error) {
      customAlert("error", "Error al obtener chats");
    }
  };

  useEffect(() => {
    const loadChats = async () => {
      await fetchChats();
    };
    loadChats();
  }, []);

  useEffect(() => {
    if (selectedTab === "add") {
      handleStartChat();
    }
  }, [selectedTab]);

  const renderTabContent = () => {
    if (selectedTab === "playlists") {
      return <PlaylistCards />;
    }

    if (selectedTab == "add") {
      return <div></div>;
    }

    const chat = chats.find((chat) => chat.id === selectedTab);
    if (chat) {
      return <Chat chatId={chat.id} />;
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
      <TopBar />
      <Box
        sx={{ display: "flex", flex: 1, width: "100%", overflowX: "hidden" }}
      >
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            backgroundColor: "#1f1f1f",
            height: "100%",
          }}
        >
          <NavMenu
            tabs={allTabs}
            closableTabs={closableTabs}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            onTabClose={handleTabClose}
            onTabRename={handleTabRename}
          />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
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
              <CircularProgress size={60} sx={{ color: "#3be477" }} />
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
