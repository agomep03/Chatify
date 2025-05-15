import { useEffect, useState } from "react";
import { Box, Toolbar } from "@mui/material";
import TopBar from "../components/TopBar";
import NavMenu from "../components/NavMenu";
import Chat from "../components/Chat";

interface Chat {
  id: string;
  title: string;
}

const MainLayout = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("Playlists");

  useEffect(() => {
    const fetchChats = async () => {
      const simulatedChats: Chat[] = [
        { id: "1", title: "Chat de marketing" },
        { id: "2", title: "Análisis mensual" },
        { id: "3", title: "Brainstorming IA" },
      ];
      setChats(simulatedChats);
    };

    fetchChats();
  }, []);

  const allTabs = ["Playlists", ...chats.map((chat) => chat.title)];
  const closableTabs = [false, ...chats.map(() => true)];

  const handleTabClose = (tabTitle: string) => {
    // Eliminar del estado local
    setChats((prev) => prev.filter((chat) => chat.title !== tabTitle));

    // Cambiar selección si se eliminó la tab activa
    if (selectedTab === tabTitle) {
      setSelectedTab("Playlists");
    }

    // Aquí irá tu llamada al endpoint de borrado:
    // await api.delete(`/chats/${chatId}`)
    // Para eso necesitarías buscar el `id` del chat por el `title`
    const chat = chats.find((c) => c.title === tabTitle);
    if (chat) {
      console.log(`Eliminar chat con ID: ${chat.id}`);
      // await deleteChat(chat.id);
    }
  };

  const renderTabContent = () => {
    if (selectedTab === "Playlists") {
      return <div>Contenido de las playlists guardadas</div>;
    }

    const chat = chats.find((chat) => chat.title === selectedTab);
    if (chat) {
      return <Chat/>;
    }

    return <div>Tab no encontrada</div>;
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar />
      <Toolbar />
      <Box sx={{ display: "flex", flex: 1, width: "100%" }}>
        <Box sx={{ width: 240 }}>
          <NavMenu
            tabs={allTabs}
            closableTabs={closableTabs}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            onTabClose={handleTabClose}
          />
        </Box>
        <Box sx={{ flexGrow: 1, p: 2 }}>{renderTabContent()}</Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
