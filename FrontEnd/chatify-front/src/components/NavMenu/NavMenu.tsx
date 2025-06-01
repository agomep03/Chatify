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
import ScrollableText from '../ScrollableText/ScrollableText';
import { useTheme } from "@mui/material/styles";
import ConfirmDeleteDialog from '../Dialog/ConfirmDeleteDialog/ConfirmDeleteDialog';
import { getScrollbarStyles } from "../../styles/scrollbarStyles";

/**
 * Menú de navegación lateral para tabs/conversaciones.
 * @component
 * @param {Tab[]} tabs - Lista de tabs/conversaciones a mostrar.
 * @param {string} selectedTab - ID de la tab actualmente seleccionada.
 * @param {(tab: string) => void} onTabChange - Callback al seleccionar una tab.
 * @param {boolean[]} [closableTabs] - Indica qué tabs pueden editarse/cerrarse.
 * @param {(tab: string) => void} [onTabClose] - Callback para eliminar una tab.
 * @param {(chatId: string, newTitle: string) => void | Promise<void>} [onTabRename] - Callback para renombrar una tab.
 * @returns {JSX.Element} Lista de tabs con opciones de menú contextual (eliminar/renombrar).
 * @description
 * Muestra una lista de tabs/conversaciones con scroll y opciones de menú contextual para cada una (si es cerrable).
 * Permite eliminar o renombrar una tab mediante diálogos de confirmación y formularios.
 * El diseño es responsivo y usa estilos personalizados para el scroll y los elementos seleccionados.
 */

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
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTabId, setMenuTabId] = useState<string | null>(null);
  const [openRenameForm, setOpenRenameForm] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [tabToDelete, setTabToDelete] = useState<Tab | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lastAnchorEl = useRef<HTMLElement | null>(null);
  const theme = useTheme();

  // Lanza el submit del formulario de renombrar desde el diálogo
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
        {/* Renderiza cada tab/conversación */}
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
              selected={String(selectedTab) === String(tab.id)}
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
                primary={<ScrollableText text={tab.title} selected={String(selectedTab) === String(tab.id)} />}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Menú contextual para eliminar o renombrar */}
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
              // Buscar la tab a eliminar y mostrar el confirm dialog
              const tab = tabs.find(t => t.id === menuTabId);
              setTabToDelete(tab ?? null);
              setOpenConfirmDelete(true);
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
        {/* Diálogo para cambiar el nombre de la tab */}
        {openRenameForm && (
          <CustomDialog
            open={openRenameForm}
            onClose={() => {setOpenRenameForm(false); setMenuTabId(null);}}
            onConfirm={handleDialogAccept}
          >
            <Form
              ref={formRef}  // Referencia al formulario para submit programático
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
        {/* Diálogo de confirmación para eliminar la tab */}
        <ConfirmDeleteDialog
          open={openConfirmDelete}
          onClose={() => { setOpenConfirmDelete(false); setTabToDelete(null); }}
          onConfirm={() => {
            if (onTabClose && tabToDelete) onTabClose(tabToDelete.id);
            setOpenConfirmDelete(false);
            setTabToDelete(null);
          }}
          itemName={tabToDelete?.title}
        />
      </Box>
    </List>
  );
};

export default NavMenu;
