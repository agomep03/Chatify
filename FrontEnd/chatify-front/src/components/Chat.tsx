import React, { useEffect, useRef, useState } from 'react';
import { Box, List, ListItem, ListItemText, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import config from "../config";

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};



const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dots, setDots] = useState('');

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]); 

  useEffect(() => {
    if (!isLoading) {
      setDots('...');
      return;
    }
  
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
  
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;
  
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
  
    fetch(`${config.apiBaseUrl}/chat/ask-music-question/?question=${encodeURIComponent(input)}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: data.response || 'Sin respuesta',
          sender: 'bot',
        };
        setMessages(prev => [...prev, botMessage]);
      })
      .catch(() => {
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: 'Error al obtener respuesta.',
          sender: 'bot',
        };
        setMessages(prev => [...prev, errorMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  return (
    <Box display="flex" flexDirection="column" height="90vh" width="85vw" overflow="hidden" p={2}>
      <Box
        ref={listRef}
        flexGrow={1}
        overflow="hidden"
        mb={2}
        sx={{ maxHeight: '90%', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <List>
        {messages.map((msg) => (
        <ListItem key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
          <Box
            sx={{
              maxWidth: '80%',
              wordWrap: 'break-word',  // Hace que el texto se ajuste y no se desborde
              backgroundColor: msg.sender === 'user' ? '#414141' : '#303030', //color user : bot
              color: '#fff',
              borderRadius:  msg.sender === 'user' ? '15px 15px 0px 15px' : '15px 15px 15px 0px', //redondeo esquinas user : bot
              padding: '8px 12px', 
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            <ListItemText
              primary={msg.text}
              align={msg.sender === 'user' ? 'right' : 'left'}
              sx={{ whiteSpace: 'pre-wrap' }} 
            />
          </Box>
        </ListItem>
      ))}
      {isLoading && (
      <ListItem sx={{ justifyContent: 'flex-start' }}>
        <Box
          sx={{
            padding: '8px 12px',
            backgroundColor: '#303030',
            color: '#fff',
            borderRadius: '15px 15px 15px 0px',
          }}
        >
          <ListItemText primary={`Pensando${dots}`} align="left" />
        </Box>
      </ListItem>
    )}
        </List>
      </Box>
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
            backgroundColor:'#303030',
            resize: 'none',
            overflow: 'auto',
            borderRadius: "15px",
            color: '#fff',
            '& .MuiInputBase-input': {
                color: '#fff', 
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
        <IconButton onClick={handleSend} sx={{ color: '#3be477' }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;
