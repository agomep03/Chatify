import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { Theme } from '@mui/material/styles';

/**
 * Selector de modo de IA para el chat.
 * @component
 * @param {string} mode - Modo de IA seleccionado ("normal", "creatividad" o "razonamiento").
 * @param {(mode: string) => void} setMode - Setter para el modo.
 * @param {Theme} theme - Tema de MUI.
 * @returns {JSX.Element} Grupo de botones para seleccionar el modo de IA.
 * @description
 * Permite alternar entre los modos "creatividad" y "razonamiento" para los mensajes del chat.
 * Solo uno puede estar activo a la vez, o ninguno (modo "normal").
 * El foco se elimina tras pulsar para evitar bordes de enfoque.
 */
interface ChatModeToggleProps {
  mode: string;
  setMode: (mode: string) => void;
  theme: Theme;
}

// Estilos comunes para los ToggleButton
const getToggleButtonSx = (theme: Theme) => ({
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
});

export default function ChatModeToggle({ mode, setMode, theme }: ChatModeToggleProps) {
  const buttons = [
    {
      value: "creatividad",
      selected: mode === "creatividad",
      icon: <LightbulbIcon sx={{ fontSize: 18, mr: 1 }} />,
      label: "Se creativo",
    },
    {
      value: "razonamiento",
      selected: mode === "razonamiento",
      icon: <PsychologyIcon sx={{ fontSize: 18, mr: 1 }} />,
      label: "Razona",
    },
  ];

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
      {buttons.map(btn => (
        <ToggleButton
          key={btn.value}
          value={btn.value}
          selected={btn.selected}
          sx={getToggleButtonSx(theme)}
        >
          {btn.icon}
          {btn.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}