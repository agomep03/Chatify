import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatModeToggle from './ChatToggle';
import { Theme } from '@mui/material/styles';

/**
 * Barra de entrada del chat.
 * @component
 * @param {string} input - Texto actual del input.
 * @param {(value: string) => void} setInput - Setter para el input.
 * @param {() => void} handleSend - Función para enviar el mensaje.
 * @param {string} mode - Modo de IA seleccionado.
 * @param {(mode: string) => void} setMode - Setter para el modo.
 * @param {Theme} theme - Tema de MUI.
 * @returns {JSX.Element} Barra de entrada con selector de modo, input multilinea y botón de enviar.
 * @description
 * Permite al usuario escribir y enviar mensajes, seleccionar el modo de IA (creatividad o razonamiento)
 * y muestra el input con estilos personalizados. El envío se puede hacer con Enter o con el botón.
 */
interface ChatInputBarProps {
  readonly input: string;
  readonly setInput: (value: string) => void;
  readonly handleSend: () => void;
  readonly mode: string;
  readonly setMode: (mode: string) => void;
  readonly theme: Theme & { palette: any };
}

export default function ChatInput({
  input,
  setInput,
  handleSend,
  mode,
  setMode,
  theme,
}: ChatInputBarProps) {
  return (
    <Box display="flex" flexDirection="column" gap={1} sx={{backgroundColor: 'transparent', borderRadius: "15px"}}>
      {/* Toggle buttons siempre arriba */}
      <ChatModeToggle mode={mode} setMode={setMode} theme={theme} />
      {/* Input y botón de enviar */}
      <Box display="flex" alignItems="flex-end">
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          multiline
          minRows={1}
          maxRows={6}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
              setInput('');
            }
          }}
          sx={{
            overflow: 'auto',
            backgroundColor: theme.palette.custom.botDialogBg,
            borderRadius: "15px",
            '& .MuiInputBase-input': {
              color: theme.palette.text.primary,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
            },
          }}
        />
        <IconButton onClick={handleSend} sx={{ color: theme.palette.primary.main, ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}