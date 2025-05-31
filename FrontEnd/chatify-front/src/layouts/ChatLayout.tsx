import React, { useEffect, useRef, useState } from 'react';
import { Box, List, ListItem, ListItemText, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { fetchSendMessage, fetchChatHistory } from "../api/chatService";
import { useTheme } from "@mui/material/styles";
import { getScrollbarStyles } from "../styles/scrollbarStyles";
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

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
};

const Chat: React.FC<ChatProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoadingDot, setIsLoadingDot] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [dots, setDots] = useState('');
  const theme = useTheme();

  const listRef = useRef<HTMLUListElement>(null);

  // Carga el historial del chat cuando cambia el chatId
  useEffect(() => {
    if (!chatId) return;
    fetchChatHistory(chatId, setMessages, setIsLoadingChat);
    console.log(messages);
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
  const handleSend = () => {
    if (!input.trim()) return;
    fetchSendMessage(chatId, input, (msg) => setMessages(prev => [...prev, msg]), setIsLoadingDot);
    setInput('');
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
      {/* Lista de mensajes */}
      <Box
        ref={listRef}
        flexGrow={1}
        overflow="hidden"
        mb={2}
        sx={{
          maxHeight: '90%',
          overflowY: 'auto',
          overflowX: 'hidden',
          ...getScrollbarStyles(theme),
        }}
      >
        <List>
        {messages.map((msg) => (
        <ListItem key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
          <Box
            sx={{
              maxWidth: '80%',
              wordWrap: 'break-word',  // Hace que el texto se ajuste y no se desborde
              backgroundColor: msg.sender === 'user' ? theme.palette.custom.userDialogBg : theme.palette.custom.botDialogBg, //color user : bot
              color: theme.palette.text.primary,
              borderRadius:  msg.sender === 'user' ? '15px 15px 0px 15px' : '15px 15px 15px 0px', //redondeo esquinas user : bot
                padding: '0px 12px',
                wordBreak: 'break-word',
                '& ol, & ul': {
                paddingLeft: '1.5em',
                margin: 0,
                },
                '& li': {
                marginBottom: '0.2em',
                },
              }}
              >
            <ReactMarkdown
              remarkPlugins={[remarkBreaks]}
            >
              {msg.text}
            </ReactMarkdown>
          </Box>
        </ListItem>
      ))}
      {/* Mensaje de "bot escribiendo" */}
      {isLoadingDot && (
      <ListItem sx={{ justifyContent: 'flex-start' }}>
        <Box
          sx={{
            padding: '8px 12px',
            backgroundColor: theme.palette.custom.botDialogBg,
            color: theme.palette.text.primary,
            borderRadius: '15px 15px 15px 0px',
          }}
        >
          <ListItemText primary={`Pensando${dots}`} sx={{textAlign:"left"}} />
        </Box>
      </ListItem>
    )}
        </List>
      </Box>
      {/* Input para escribir y enviar mensajes */}
      <Box display="flex" overflow="hidden">
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          multiline
          minRows={1}
          maxRows={6}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
              setInput('');
            }
          }}
          sx={{
            backgroundColor: theme.palette.custom.botDialogBg,
            resize: 'none',
            overflow: 'auto',
            borderRadius: "15px",
            color: theme.palette.text.primary,
            '& .MuiInputBase-input': {
                color: theme.palette.text.primary, 
            },
            '& .MuiOutlinedInput-root': { //Eliminamos el borde y sus variaciones cuando se toca el componente
                '& fieldset': {
                    border: 'none',
                },
                '&:hover fieldset': {
                    border: 'none',
                },
                '&.Mui-focused fieldset': {
                    border: 'none',
                },
            },
          }}
    
        />
        <IconButton onClick={handleSend} sx={{ color: theme.palette.primary.main }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;
