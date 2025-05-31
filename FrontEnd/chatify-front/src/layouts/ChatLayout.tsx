import React, { useEffect, useRef, useState } from 'react';
import { Box, List, ListItem, ListItemText, TextField, IconButton, CircularProgress, Select, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PsychologyIcon from '@mui/icons-material/Psychology';
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
  const [mode, setMode] = useState("normal");
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
    fetchSendMessage(chatId, input, (msg) => setMessages(prev => [...prev, msg]), setIsLoadingDot, mode);
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
          maxHeight: '80%',
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
      <Box display="flex" overflow="hidden" flexDirection="column">
        <Box display="flex" overflow="hidden">
          <Box
              sx={{
                width: "100%",
                backgroundColor: theme.palette.custom.botDialogBg,
                resize: 'none',
                overflow: 'hidden',
                borderRadius: "15px",
                color: theme.palette.text.primary,
                '& .MuiInputBase-input': {
                    color: theme.palette.text.primary, 
                },
                '& .MuiOutlinedInput-root': {
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
          >
            <ToggleButtonGroup
              value={mode === "normal" ? null : mode}
              exclusive
              onChange={(event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
                setMode(newMode || "normal");
                if (event && event.currentTarget) {
                  (event.currentTarget as HTMLElement).blur();
                }
              }}
              sx={{ mb: 1, maxWidth: 300, ml: 1, mt: 1 }}
            >
              <ToggleButton
                value="creatividad"
                selected={mode === "creatividad"}
                sx={{
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&': {
                    transition: 'none',
                    border: '1px solid',
                    borderColor: theme.palette.action.selected,
                  },
                  '&:not(.Mui-selected)': {
                    border: '1px solid',
                    borderColor: theme.palette.action.selected,
                  },
                  '&.Mui-selected': {
                    border: '1px solid',
                    borderColor: theme.palette.action.selected,
                    background: theme.palette.action.selected,
                  },
                  '&.Mui-selected:hover': {
                    border: '1px solid',
                    borderColor: theme.palette.action.selected,
                    background: theme.palette.action.selected,
                  },
                  '&:focus, &:active, &:focus-visible': {
                    outline: 'none !important',
                    border: '1px solid transparent !important',
                    boxShadow: 'none !important',
                    borderColor: theme.palette.action.selected,
                  },

                }}
              >
                <LightbulbIcon sx={{ fontSize: 18, mr: 1 }} />
                Se creativo
              </ToggleButton>
              <ToggleButton
                value="razonamiento"
                selected={mode === "razonamiento"}
                sx={{
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&': {
                    transition: 'none',
                    border: '1px solid',
                    borderColor: theme.palette.action.selected,
                  },
                  '&:not(.Mui-selected)': {
                    border: '1px solid',
                    borderColor: theme.palette.action.selected,
                  },
                  '&.Mui-selected': {
                    border: '1px solid',
                    borderColor: theme.palette.action.selected,
                    background: theme.palette.action.selected,
                  },
                  '&.Mui-selected:hover': {
                    border: '1px solid',
                    borderColor: theme.palette.action.selected,
                    background: theme.palette.action.selected,
                  },
                  '&:focus, &:active, &:focus-visible': {
                    outline: 'none !important',
                    border: '1px solid transparent !important',
                    boxShadow: 'none !important',
                    borderColor: theme.palette.action.selected,
                  },
                }}
              >
                <PsychologyIcon sx={{ fontSize: 18, mr: 1 }} />
                Razona
              </ToggleButton>
            </ToggleButtonGroup>
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
              sx={{overflow: 'auto',}}
            />
          </Box>
          <IconButton onClick={handleSend} sx={{ color: theme.palette.primary.main }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
