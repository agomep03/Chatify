import React, { useEffect, useRef, useState } from 'react';
import { Box, List, ListItem, ListItemText, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import config from "../config";

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};



const Chat: React.FC= ( {chatId} ) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoadingDot, setIsLoadingDot] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [dots, setDots] = useState('');

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!chatId) return;
    setIsLoadingChat(true);
    const token = localStorage.getItem("token");
    fetch(`${config.apiBaseUrl}/chat/${chatId}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const historyMessages: Message[] = data.map((msg: any, index: number) => ({
          id: Date.now() + index,
          sender: msg.role === 'user' ? 'user' : 'bot',
          text: msg.content,
        }));
        setMessages(historyMessages);
      })
      .catch(() => {
        setMessages([]);
      })
      .finally(() => {
        setIsLoadingChat(false);
      });
  }, [chatId]);
  

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]); 

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

  const handleSend = () => {
    if (!input.trim()) return;
  
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoadingDot(true);
    const token = localStorage.getItem("token");
    fetch(`${config.apiBaseUrl}/chat/${chatId}/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain", 
        },
        body: input, 
      })
      .then(res => res.json())
      .then(data => {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: data.answer || 'Sin respuesta',
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
        setIsLoadingDot(false);
      });
  };

  const renderTextToHtml = (text: string) => {
    let htmlText = text.replace(/\n^### (.*)$\n+/gm, '<h3>$1</h3>');
    htmlText = htmlText.replace(/^### (.*)$\n+/gm, '<h3>$1</h3>');
    htmlText = htmlText.replace(/\n^## (.*)$\n+/gm, '<h2>$1</h2>');
    htmlText = htmlText.replace(/^## (.*)$\n+/gm, '<h2>$1</h2>');
    htmlText = htmlText.replace(/\n^# (.*)$\n+/gm, '<h1>$1</h1>');
    htmlText = htmlText.replace(/^# (.*)$\n+/gm, '<h1>$1</h1>');
    htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    htmlText = htmlText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    htmlText = htmlText.replace(/^\s*[-\*]\s+(.*)$/gm, '<ul><li>$1</li></ul>');
    htmlText = htmlText.replace(/<\/?p>/g, '');
    htmlText = htmlText.replace(/\n/g, '<br>');
    return { __html: htmlText };
  };

  if (isLoadingChat) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <CircularProgress size={60} sx={{color:"#3be477"}}/>
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
              primary={<span dangerouslySetInnerHTML={renderTextToHtml(msg.text)} />} // Usamos dangerouslySetInnerHTML
              sx={{ whiteSpace: 'pre-wrap', textAlign:msg.sender === 'user' ? 'right' : 'left' }} 
            />
          </Box>
        </ListItem>
      ))}
      {isLoadingDot && (
      <ListItem sx={{ justifyContent: 'flex-start' }}>
        <Box
          sx={{
            padding: '8px 12px',
            backgroundColor: '#303030',
            color: '#fff',
            borderRadius: '15px 15px 15px 0px',
          }}
        >
          <ListItemText primary={`Pensando${dots}`} sx={{textAlign:"left"}} />
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
