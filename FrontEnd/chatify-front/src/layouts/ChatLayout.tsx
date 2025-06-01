import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { fetchSendMessage, fetchChatHistory } from "../api/chatService";
import { useTheme } from "@mui/material/styles";
import ChatMessagesList from '../components/Chats/ChatMessagesList';
import ChatInput from '../components/Chats/ChatInput';

/**
 * Layout principal del chat.
 * @component
 * @param {string} chatId - ID de la conversación a mostrar.
 * @returns {JSX.Element} Vista de chat con historial, input y mensajes.
 * @description
 * Muestra el historial de mensajes de un chat, permite enviar mensajes y muestra el estado de carga.
 * Los mensajes se renderizan con estilos diferentes para usuario y bot.
 * El input soporta multilinea y envío con Enter o botón.
 * El historial se actualiza automáticamente al cambiar el chatId.
 */

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};


type ChatProps = {
  chatId: string; 
  fetchChats: () => Promise<void>;
};

const Chat: React.FC<ChatProps> = ({ chatId, fetchChats }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoadingDot, setIsLoadingDot] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [dots, setDots] = useState('');
  const [mode, setMode] = useState("normal");
  const theme = useTheme();
  const listRef = useRef<HTMLDivElement>(null);

  // Carga el historial del chat cuando cambia el chatId
  useEffect(() => {
    if (!chatId) return;
    fetchChatHistory(chatId, setMessages, setIsLoadingChat);
  }, [chatId]);
  
  // Hace scroll al final de la lista cuando llegan nuevos mensajes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]); 

  // Maneja la animación de puntos "Pensando..."
  useEffect(() => {
    if (!isLoadingDot) {
      setDots('...');
      return;
    }
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, [isLoadingDot]);

  // Envía el mensaje del usuario
  const handleSend = async () => {
    if (!input.trim()) return;
    const data = await fetchSendMessage(chatId, input, (msg) => setMessages(prev => [...prev, msg]), setIsLoadingDot, mode);
    setInput('');
    if (data && data.title_changed){
      await fetchChats();
    }
  };

  // Muestra spinner mientras se carga el historial
  if (isLoadingChat) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <CircularProgress size={60}/>
      </Box>
    );
  }
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      minHeight={0}
      overflow="hidden"
      p={2}
    >
      <ChatMessagesList
        messages={messages}
        isLoadingDot={isLoadingDot}
        dots={dots}
        listRef={listRef}
        theme={theme}
      />
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        mode={mode}
        setMode={setMode}
        theme={theme}
      />
    </Box>
  );
};

export default Chat;
