# Chatify – FrontEnd

**Frontend de la aplicación web Chatify desarrollado con React + TypeScript + MUI + Vite**

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** React + TypeScript
- **Estilos:** Material UI (MUI)
- **Bundler:** Vite
- **Gestión de estado:** Context API
- **Estilado:** CSS Modules + TailwindCSS
- **Despliegue:** Docker + Render

---

## 📦 Estructura del Proyecto

### 🌳 Estructura de Carpetas y Archivos
```

chatify-frontend/
 │── public/ # Archivos estáticos (favicon, imágenes)
 │── src/
 │ ├── api/ # Servicios de API
 │ │ ├── authService.ts
 │ │ ├── chatService.ts
 │ │ └── spotifyService.ts
 │ ├── components/ # Componentes reutilizables
 │ │ ├── Alert/
 │ │ ├── Buttons/
 │ │ ├── Chats/
 │ │ ├── Dialog/
 │ │ ├── Form/
 │ │ ├── Landing/
 │ │ ├── Logo/
 │ │ ├── NavMenu/
 │ │ ├── PlaylistCards/
 │ │ ├── PrivateRoute/
 │ │ ├── ScrollableText/
 │ │ ├── styles/
 │ │ └── TopBar/
 │ ├── layouts/ # Layouts de página
 │ │ ├── ChatLayout.tsx
 │ │ ├── LoginRegisterLayout.tsx
 │ │ └── MainLayout.tsx
 │ ├── pages/ # Páginas principales
 │ │ ├── Home.tsx
 │ │ ├── Landing.tsx
 │ │ ├── Login.tsx
 │ │ ├── Profile.tsx
 │ │ └── Register.tsx
 │ ├── theme/ # Configuración de temas
 │ │ ├── DarkTheme.ts
 │ │ └── LightTheme.ts
 │ ├── utils/ # Utilidades
 │ │ └── auth.ts
 │ ├── App.css # Estilos globales
 │ ├── App.tsx # Componente principal
 │ ├── config.ts # Configuración global
 │ ├── index.css # Estilos iniciales
 │ ├── main.tsx # Punto de entrada
 │ └── vite-env.d.ts # Tipos para Vite
 │── .env # Variables de entorno
 │── .gitignore # Archivos a ignorar en Git
 │── package.json # Dependencias y scripts
 │── tsconfig.json # Configuración de TypeScript
 │── vite.config.ts # Configuración de Vite
 │── Dockerfile # Configuración de Docker
 │── nginx.conf # Configuración de Nginx
 │── README.md # Documentación del frontend
```

---

### 🔧 Explicación de Carpetas

#### **1️⃣ `api/` → Servicios de API**
Contiene los servicios que se comunican con el backend, organizados por funcionalidad (auth, chat, Spotify).

#### **2️⃣ `components/` → Componentes reutilizables**
Componentes UI reutilizables organizados por funcionalidad, con subcomponentes y estilos.

#### **3️⃣ `layouts/` → Layouts de página**
Estructuras de página reutilizables que definen el esqueleto común de diferentes secciones.

#### **4️⃣ `pages/` → Páginas principales**
Contiene las páginas principales de la aplicación, organizadas por secciones.

#### **5️⃣ `theme/` → Gestión de temas**
Configuración de temas claro/oscuro y tipado para el tema de MUI.

#### **6️⃣ `utils/` → Utilidades**
Funciones auxiliares como la gestión de autenticación.

#### **7️⃣ Archivos en la raíz del proyecto**
- `.env` → Variables de entorno
- `.gitignore` → Archivos a ignorar en Git
- `package.json` → Dependencias y scripts de desarrollo
- `tsconfig.json` → Configuración de TypeScript
- `vite.config.ts` → Configuración de Vite
- `Dockerfile` → Configuración de Docker
- `nginx.conf` → Configuración de Nginx

---
