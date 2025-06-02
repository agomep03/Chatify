# Chatify – Trabajo de Ingeniería del Software II (Universidad de León)

**Trabajo realizado para la asignatura Ingeniería del Software II, Universidad de León.**

---

## Índice

1. [Información del Proyecto](#información-del-proyecto)  
2. [Equipo de trabajo](#equipo-de-trabajo)  
3. [Tecnologías utilizadas](#tecnologías-utilizadas)  
4. [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)  
5. [Enlaces de interés](#enlaces-de-interés)  

---

## 1. Información del Proyecto

Chatify es una aplicación web inteligente para la gestión y descubrimiento de música. Permite a los usuarios iniciar sesión, conectar su cuenta de Spotify y descubrir música personalizada usando inteligencia artificial. Incluye funcionalidades para crear y modificar playlists, conversar con IA en distintos modos y gestionar contenido musical de forma intuitiva.

Este proyecto ha sido desarrollado como parte de la asignatura **Ingeniería del Software II** en la **Universidad de León**.

---

## 2. Equipo de trabajo

- **Adriana Ortega del Valle**  
- **Héctor Sastre Miguélez**  
- **Alicia Gómez Pascual**  
- **Mario López Barazón**  

---

## 3. Tecnologías utilizadas

- **Backend:** Python + FastAPI
- **Frontend:** React + TypeScript + MUI + Vite
- **Base de datos:** PostgreSQL (Aiven)
- **Control de versiones:** Git + GitHub
- **CI/CD y calidad:** GitHub Actions + SonarQube
- **Contenedores y despliegue:** Docker + Render

---

## 4. Cómo ejecutar el proyecto

### Requisitos previos

- Tener instalado **Node.js** (v18 o superior) y **npm**.
- Tener instalado **Python** (v3.10 o superior) y **pip** (para el backend).
- (Opcional) Tener instalado **Docker** si se desea ejecutar en contenedores.

### Ejecución del BackEnd

1. **Accede a la carpeta del backend:**
   ```bash
   cd Chatify/BackEnd
   ```

2. **Crea un entorno virtual e instale las dependencias:**
   ```bash
   python -m venv env
   source env/bin/activate  # En Windows usa `env\Scripts\activate`
   pip install -r requirements.txt
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en BackEnd/ y añade las siguientes líneas:
   ```env
   # Configuración de la base de datos
   DATABASE_URL=

   # Configuración de autenticación JWT
   SECRET_KEY=
   ALGORITHM=
   ACCESS_TOKEN_EXPIRE_MINUTES=

   # Api key OpenRouter
   OPENROUTER_API_KEY=

   # Configuración con Spotify
   SPOTIFY_CLIENT_ID=
   SPOTIFY_CLIENT_SECRET=
   SPOTIFY_REDIRECT_URI=

   # Api de Genious
   TOKEN_GENIUS = 

   GENIOUS_CLIENT_ID=
   GENIOUS_CLIENT_SECRET=
   GENIOUS_CLIENT_ACCESS_TOKEN=

   # Configurar la direccion del FrontEnd
   FRONTEND_URL=

   ```

4. **Inicia la aplicación:**
   ```bash
   uvicorn main:app --reload
   ```

   La aplicación estará disponible en `http://localhost:8000`.


### Ejecución del FrontEnd

1. **Accede a la carpeta del frontend:**
   ```bash
   cd Chatify/FrontEnd/chatify-front
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**

   Crea un archivo `.env` en /FrontEnd/chatify-front y añade las siguientes líneas:
   ```env
   # Dirección del BackEnd
   VITE_API_BASE_URL=
   ```

3. **Inicia la aplicación:**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`.


## 5.Ejecución con Docker


1. **Configura las variables de entorno de BackEnd**

   Crea un archivo `.env` en BackEnd/ y añade las siguientes líneas:
   ```env
   # Configuración de la base de datos
   DATABASE_URL=

   # Configuración de autenticación JWT
   SECRET_KEY=
   ALGORITHM=
   ACCESS_TOKEN_EXPIRE_MINUTES=

   # Api key OpenRouter
   OPENROUTER_API_KEY=

   # Configuración con Spotify
   SPOTIFY_CLIENT_ID=
   SPOTIFY_CLIENT_SECRET=
   SPOTIFY_REDIRECT_URI=

   # Api de Genious
   TOKEN_GENIUS = 

   GENIOUS_CLIENT_ID=
   GENIOUS_CLIENT_SECRET=
   GENIOUS_CLIENT_ACCESS_TOKEN=

   # Configurar la direccion del FrontEnd
   FRONTEND_URL=

   ```

2. **Construye Docker de BackEnd**

   ```bash
   docker build -t chatify-backend ./BackEnd
   ```

3. **Ejecuta Docker de BackEnd**
   ```bash
   docker run --env-file ./BackEnd/.env -p 8000:8000 chatify-backend
   ```

4. **Configura las variables de entorno de FrontEnd**

   Crea un archivo `.env` en /FrontEnd/chatify-front y añade las siguientes líneas:
   ```env
   # Dirección del BackEnd
   VITE_API_BASE_URL=
   ```

5. **Construye Docker de FrontEnd**
   ```bash
   docker build -t chatify-frontend ./FrontEnd/chatify-front
   ```

6. **Ejecuta Docker de FrontEnd**
   ```bash
   docker run --env-file ./FrontEnd/chatify-front/.env -p 80:80 chatify-frontend
   ```

---

## 6. Enlaces de interés

- [Despliegue FrontEnd](https://chatifyfront.onrender.com/)
- [Despliegue BackEnd](https://chatifyback.onrender.com)
- [SonarQube](https://sonarcloud.io/project/overview?id=agomep03_chatify)

