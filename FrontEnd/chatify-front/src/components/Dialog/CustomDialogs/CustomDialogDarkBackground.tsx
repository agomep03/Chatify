import { Dialog, DialogContent, Box, Button, DialogTitle, IconButton } from '@mui/material';
import { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

type ButtonConfig = {
  label: string;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  action?: () => void;
};

type CustomDialogDarkBackgroundProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
  buttons: ButtonConfig[];
  title?: string;
  showCloseIcon?: boolean;
};

const CustomDialogDarkBackground = ({
  open,
  onClose,
  children,
  buttons,
  title,
  showCloseIcon = false,
}: CustomDialogDarkBackgroundProps) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {title}
        {showCloseIcon && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              outline: "none",
              border: "none",
              boxShadow: "none",
              "&:focus": { outline: "none", border: "none", boxShadow: "none" },
              "&:focus-visible": { outline: "none", border: "none", boxShadow: "none" },
              "&:active": { outline: "none", border: "none", boxShadow: "none" },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {children}
        <Box mt={3} display="flex" justifyContent="center" gap={1} sx={{ flexWrap: 'nowrap', overflowX: 'hidden' }}>
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              onClick={btn.action}
              color={btn.color}
              variant={idx === buttons.length - 1 ? 'contained' : 'outlined'}
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '9999px',
                px: 2,
                py: 0.5,
                minWidth: 80,
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

export default CustomDialogDarkBackground;
