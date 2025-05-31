import { Box, List, ListItem, ListItemText } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { getScrollbarStyles } from "../../styles/scrollbarStyles";

/**
 * Lista de mensajes del chat.
 * @component
 * @param {Message[]} messages - Array de mensajes a mostrar.
 * @param {boolean} isLoadingDot - Indica si el bot está "pensando".
 * @param {string} dots - Animación de puntos para el estado "pensando".
 * @param {RefObject<HTMLDivElement | null>} listRef - Ref para el scroll automático.
 * @param {any} theme - Tema de MUI para estilos.
 * @returns {JSX.Element} Lista de mensajes con estilos diferenciados para usuario y bot.
 * @description
 * Muestra el historial de mensajes del chat, renderiza Markdown y aplica estilos personalizados.
 * El mensaje "Pensando..." aparece cuando el bot está generando respuesta.
 */

interface Message {
  id: string | number;
  sender: 'user' | 'bot';
  text: string;
}

interface ChatMessagesListProps {
  messages: Message[];
  isLoadingDot: boolean;
  dots: string;
  listRef: React.RefObject<HTMLDivElement | null>;
  theme: any;
}

export default function ChatMessagesList({
  messages,
  isLoadingDot,
  dots,
  listRef,
  theme,
}: ChatMessagesListProps) {

  return (
      <Box
        ref={listRef}
        flexGrow={1}
        overflow="hidden"
        mb={2}
        sx={{
          maxHeight: '80vh',
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
  );
}