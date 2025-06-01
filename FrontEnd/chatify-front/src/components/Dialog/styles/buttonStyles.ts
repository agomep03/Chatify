import { Theme } from '@mui/material/styles';

export const getDialogButtonStyles = (theme: Theme) => ({
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
});