import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      userDialogBg: string;
      botDialogBg: string;
      topBarBg: string;
      topBarText: string;
      primaryHover: string;
      outlinedBorder: string;
      tabBg: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      userDialogBg?: string;
      botDialogBg?: string;
      topBarBg?: string;
      topBarText?: string;
      primaryHover?: string;
      outlinedBorder?: string;
      tabBg?: string;
    };
  }
}
