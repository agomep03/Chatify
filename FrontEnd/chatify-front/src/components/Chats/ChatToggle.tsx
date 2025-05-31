import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PsychologyIcon from '@mui/icons-material/Psychology';

export default function ChatModeToggle({ mode, setMode, theme }) {
  return (
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
  );
}