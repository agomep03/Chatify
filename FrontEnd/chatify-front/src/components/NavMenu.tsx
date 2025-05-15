import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface Tab {
  id: string;
  title: string;
}

interface NavMenuProps {
  tabs: Tab[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  closableTabs?: boolean[]; // Indica qué tabs se pueden editar y cerrrar
  onTabClose?: (tab: string) => void; // Callback eliminar conversacion
  onTabRename?: (tab: string) => void; //Callback editar titulo conversacion
}

const NavMenu: React.FC<NavMenuProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  closableTabs = [],
  onTabClose,
  onTabRename,
}) => {
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTabId, setMenuTabId] = useState<string | null>(null);
  return (
    <List
      sx={{
        padding: 0, // Elimina el padding por defecto si lo quieres más limpio
        overflowY: 'auto',
        height:'100%'
      }}
    >
      <Box
        sx={{
          padding: 2, // Ajusta el padding según lo necesites
          flexShrink: 0,
        }}
      >
        {tabs.map((tab, index) => (
          <ListItem
            key={tab.id}
            disablePadding
            onMouseEnter={() => setHoveredTabId(tab.id)}
            onMouseLeave={() => setHoveredTabId(null)}
            secondaryAction={
              closableTabs[index] ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAnchorEl(e.currentTarget);
                        setMenuTabId(tab.id);
                      }}
                      sx={{ color: menuTabId === tab.id ? "white" : "grey" }}
                      >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
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
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => {setMenuAnchorEl(null); setMenuTabId(null);}}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        >

          <MenuItem
            onClick={() => {
              setMenuAnchorEl(null);
              if (onTabClose && menuTabId) onTabClose(menuTabId);
            }}
          >
            Eliminar
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchorEl(null);
              const newname= "TODO";
              console.log("TODO lógica para cambiar nombre");
              if (onTabRename && newname) onTabRename(newname);
              console.log("Cambiar nombre de", menuTabId);
            }}
          >
            Cambiar nombre
          </MenuItem>
        </Menu>

      </Box>
    </List>
  );
};

export default NavMenu;
