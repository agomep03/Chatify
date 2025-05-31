import { Dialog, DialogContent, Box, Button } from '@mui/material';
import { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';

type ButtonConfig = {
  label: string;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  action?: () => void;
};

type CustomDialogDefaultProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
  buttons: ButtonConfig[];
};

const CustomDialogDefault = ({
  open,
  onClose,
  children,
  buttons,
}: CustomDialogDefaultProps) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      hideBackdrop
      disableEscapeKeyDown
      slotProps={{
        paper: {
          sx: {
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            boxShadow: 3,
            color: theme.palette.text.primary,
            width: 'auto',
            padding: 0,
          }
        }
      }}
    >
      <DialogContent>
        <Box sx={{ padding: 0, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', overflowX: 'hidden', width: '100%'}}>
          {children}
        </Box>
        <Box mt={3} display="flex" justifyContent="center" gap={1} sx={{flexWrap: 'wrap', overflowX: 'hidden'}}>
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              onClick={btn.action}
              color={btn.color}
              variant={idx === buttons.length - 1 ? 'contained' : 'outlined'}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '9999px',
                px: 3,
                py: 1,
                boxShadow: 'none',
                '&.MuiButton-contained': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.custom.primaryHover,
                    boxShadow: 'none',
                  }
                },
                '&.MuiButton-outlined': {
                  borderColor: theme.palette.custom.outlinedBorder,
                  color: theme.palette.text.primary,
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: theme.palette.text.primary,
                    boxShadow: 'none',
                  },
                  '&:active': {
                    borderColor: theme.palette.custom.outlinedBorder,
                    boxShadow: 'none',
                  },
                  '&:focus': {
                    borderColor: theme.palette.custom.outlinedBorder,
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    borderColor: theme.palette.custom.outlinedBorder,
                    boxShadow: 'none',
                  },
                },
                '&:focus': { outline: 'none', boxShadow: 'none' },
                '&:focus-visible': { outline: 'none', boxShadow: 'none' },
                '&:active': { outline: 'none', boxShadow: 'none' },
              }}
            >
              {btn.label}
            </Button>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialogDefault;
