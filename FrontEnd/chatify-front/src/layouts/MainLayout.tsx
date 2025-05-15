import { useEffect, useMemo, useState } from "react";
import { Box, Toolbar } from "@mui/material";
import TopBar from "../components/TopBar";
import NavMenu from "../components/NavMenu";
import Chat from "../components/Chat";
import config from "../config";
import {useAlert} from "../components/Alert";

interface Chat {
  id: string;
  title: string;
}

const MainLayout = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("playlists");
  const { customAlert } = useAlert();

  const filterchats = useMemo(() => 
    chats
      .filter((chat) => chat && chat.id)
      .map((chat) => ({
        id: chat.id.toString(),
        title: chat.title,
      })), [chats]);
  

  const allTabs = [
    { id: "playlists", title: "Playlists" },
    { id: "add", title: "Añadir conversación" },
    ...filterchats
  ];

  
  const closableTabs = [false, false, ...filterchats.map(() => true)];

  //Para eliminar un chat
  const deleteChat = async (chatId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${config.apiBaseUrl}/chat/${chatId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("No se pudo eliminar el chat");
  };
  const handleTabClose = async (tadId: string) => {
    const chat = filterchats.find((c) => c.id === tadId);
    if (!chat) return;
  
    try {
      await deleteChat(chat.id);
      await fetchChats();
      if (selectedTab === chat.id) {
        setSelectedTab("playlists");
      }
    } catch (error) {
      console.error(error);
      customAlert("error", "Error al eliminar conversación");
    }
  };
  

  // Para empezar una nueva conversación
  const handleStartChat = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${config.apiBaseUrl}/chat/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newChat = await res.json();
      if (!res.ok || !newChat.chat_id) {
        throw new Error("Respuesta inválida del servidor");
      }
      await fetchChats();
      setSelectedTab(newChat.chat_id.toString());
    } catch (error) {
      console.error(error);
      customAlert("error", "Error al iniciar conversación");
    }
  };
  
  // Actualizar los chats
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${config.apiBaseUrl}/chat/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: Chat[] = await res.json();
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
      return <div>Contenido de las playlists guardadas</div>;
    }
    
    if(selectedTab == "add"){
      return <div>Iniciando conversación...</div>;
    }

    const chat = filterchats.find((chat) => chat.id.toString() === selectedTab); //da error aqui
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
