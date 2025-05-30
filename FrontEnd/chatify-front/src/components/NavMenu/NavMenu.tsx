import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Form from '../Form/Form';
import CustomDialog from '../Dialog/Dialog';
import ScrollableText from './ScrollableText';
import { useTheme } from "@mui/material/styles";
import { getScrollbarStyles } from "../styles/scrollbarStyles";

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
  onTabRename?: (chatId: string, newTitle: string) => void | Promise<void>  ; //Callback editar titulo conversacion
}

const NavMenu: React.FC<NavMenuProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  closableTabs = [],
  onTabClose,
  onTabRename,
}) => {
  const [, setHoveredTabId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTabId, setMenuTabId] = useState<string | null>(null);
  const [openRenameForm, setOpenRenameForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const lastAnchorEl = useRef<HTMLElement | null>(null);
  const theme = useTheme();

  const handleDialogAccept = () => {
    formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  };


  return (
    <List
      sx={{
        padding: 0, // Elimina el padding por defecto si lo quieres más limpio
        overflowY: 'auto',
        height:'100%',
        ...getScrollbarStyles(theme),
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
                        lastAnchorEl.current = e.currentTarget;
                        setMenuAnchorEl(e.currentTarget);
                        setMenuTabId(tab.id);
                      }}
                      sx={{ color: menuTabId === tab.id ? theme.palette.text.primary : "grey" ,
                            '&:focus': { outline: 'none' },
                      }}
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
              sx={(theme)=>({
                borderRadius: 2, // Bordes redondeados
                backgroundColor:
                  selectedTab === tab.id ? theme.palette.custom.primaryHover : "transparent", // Fondo cuando está seleccionado
                "&:hover": {
                  backgroundColor: theme.palette.custom.primaryHover, // Color de fondo al pasar el ratón
                },
              })}
            >
              <ListItemText
                primary={<ScrollableText text={tab.title} selected={selectedTab === tab.id} />}
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
              if (lastAnchorEl.current && document.contains(lastAnchorEl.current)) {
                lastAnchorEl.current.focus();
              }
              if (onTabClose && menuTabId) onTabClose(menuTabId);
            }}
          >
            Eliminar
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchorEl(null);
              setOpenRenameForm(true); // abrir el formulario
            }}
          >
            Cambiar nombre
          </MenuItem>
        </Menu>
        {openRenameForm && (
          <CustomDialog
            open={openRenameForm}
            onClose={() => {setOpenRenameForm(false); setMenuTabId(null);}}
            onConfirm={handleDialogAccept}
          >
            <Form
              ref={formRef}  // <-- aquí asignas el ref
              title="Cambiar nombre"
              fields={[{ name: "newName", label: "Nuevo nombre", type: "text" }]}
              onSubmit={(data) => {
                if (data.newName && onTabRename && menuTabId) {
                  onTabRename(menuTabId, data.newName);
                }
                setOpenRenameForm(false);
                setMenuTabId(null);
              }}
              buttonText=""
              showButton={false}
              noBackground={true}
            />
          </CustomDialog>
        )}


      </Box>
    </List>
  );
};

export default NavMenu;
