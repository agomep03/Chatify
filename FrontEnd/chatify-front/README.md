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

### Ejecución del FrontEnd

1. **Clona el repositorio y accede a la carpeta del frontend:**
   ```bash
   git clone https://github.com/agomep03/Chatify.git
   cd Chatify/FrontEnd/chatify-front
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia la aplicación:**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`.

### Ejecución del BackEnd

1. **Clona el repositorio y accede a la carpeta del backend:**
   ```bash
   git clone https://github.com/agomep03/Chatify.git
   cd Chatify/BackEnd/chatify-back
   ```

2. **Crea un entorno virtual e instale las dependencias:**
   ```bash
   python -m venv env
   source env/bin/activate  # En Windows usa `env\Scripts\activate`
   pip install -r requirements.txt
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en la raíz del proyecto y añade las siguientes líneas:
   ```env
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/chatify
   SPOTIFY_CLIENT_ID=tu_client_id
   SPOTIFY_CLIENT_SECRET=tu_client_secret
   OPENAI_API_KEY=tu_api_key
   ```

4. **Inicia la aplicación:**
   ```bash
   uvicorn main:app --reload
   ```

   La aplicación estará disponible en `http://localhost:8000`.

### Ejecución con Docker (opcional)

1. **Construye y ejecuta los contenedores:**
   ```bash
   docker-compose up --build
   ```

   Los servicios estarán disponibles en los puertos configurados en el archivo `docker-compose.yml`.

---

## 5. Enlaces de interés

- [Despliegue FrontEnd](https://chatifyfront.onrender.com/)
- [Despliegue BackEnd](https://chatifyback.onrender.com)
- [SonarQube](https://sonarcloud.io/project/overview?id=agomep03_chatify)

