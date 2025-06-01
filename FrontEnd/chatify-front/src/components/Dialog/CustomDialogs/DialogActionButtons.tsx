import { Button, useTheme } from '@mui/material';
import { getDialogButtonStyles } from '../styles/buttonStyles';

type ButtonConfig = {
  label: string;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  action?: () => void;
};

type DialogActionButtonsProps = {
  buttons: ButtonConfig[];
};

const DialogActionButtons = ({ buttons }: DialogActionButtonsProps) => {
  const theme = useTheme();
  return (
    <>
      {buttons.map((btn, idx) => (
        <Button
          key={idx}
          onClick={btn.action}
          color={btn.color}
          variant={idx === buttons.length - 1 ? 'contained' : 'outlined'}
          sx={getDialogButtonStyles(theme)}
        >
          {btn.label}
        </Button>
      ))}
    </>
  );
};

export default DialogActionButtons;