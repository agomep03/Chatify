import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

interface Tab {
  id: string;
  title: string;
}

interface NavMenuProps {
  tabs: Tab[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  closableTabs?: boolean[]; // Nuevo: indica qué tabs se pueden cerrar
  onTabClose?: (tab: string) => void; // Nuevo: callback al cerrar una tab
}

const NavMenu: React.FC<NavMenuProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  closableTabs = [],
  onTabClose,
}) => {
  return (
    <List
      sx={{
        backgroundColor: "#1f1f1f", // Cambia el color de fondo del TabMenu
        padding: 0, // Elimina el padding por defecto si lo quieres más limpio
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1f1f1f", // Cambia el color de fondo del TabMenu completo
          height: "100vh", // Asegura que ocupe toda la altura de la pantalla
          padding: 2, // Ajusta el padding según lo necesites
        }}
      >
        {tabs.map((tab, index) => (
          <ListItem
            key={tab.id}
            disablePadding
            secondaryAction={
              closableTabs[index] && onTabClose ? (
                <IconButton
                  edge="end"
                  aria-label="close"
                  onClick={() => onTabClose(tab.id)}
                  sx={{ color: "white" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null
            }
          >
            <ListItemButton
              selected={selectedTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              sx={{
                borderRadius: 2, // Bordes redondeados
                backgroundColor:
                  selectedTab === tab.id ? "#1abc54" : "transparent", // Fondo cuando está seleccionado
                "&:hover": {
                  backgroundColor: "#1abc54", // Color de fondo al pasar el ratón
                },
              }}
            >
              <ListItemText
                primary={tab.title}
                sx={{
                  color: selectedTab === tab.id ? "#1abc54" : "#ffffff", // Color del texto cuando está seleccionado
                  fontWeight: selectedTab === tab.id ? "bold" : "normal", // Fuente más gruesa para el tab seleccionado
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </Box>
    </List>
  );
};

export default NavMenu;
