import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatModeToggle from './ChatToggle';

export default function ChatInputBar({ input, setInput, handleSend, mode, setMode, theme }) {
  return (
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
            <ChatToggleMode mode={mode} setMode={setMode} theme={theme} />
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
  );
}