## 📚 Estructura del Backend

Este backend sigue una arquitectura modular para garantizar escalabilidad, mantenimiento y facilidad de desarrollo.

### 🌳 Estructura de Carpetas y Archivos
```
chatify-backend/
│── src/
│   ├── controllers/         # Controladores de cada funcionalidad
│   │   ├── auth_controller.py
│   │   ├── chat_controller.py
│   │   ├── playlist_controller.py
│   │   ├── user_controller.py
│   ├── routes/              # Rutas de la API
│   │   ├── auth_routes.py
│   │   ├── chat_routes.py
│   │   ├── playlist_routes.py
│   │   ├── user_routes.py
│   ├── models/              # Modelos de la BD
│   │   ├── user_model.py
│   │   ├── playlist_model.py
│   │   ├── conversation_model.py
│   ├── services/            # Lógica de negocio y conexión con APIs externas
│   │   ├── spotify_service.py
│   │   ├── chatAI_service.py
│   │   ├── lyrics_service.py
│   ├── middlewares/         # Middleware (autenticación, logs, manejo de errores)
│   │   ├── auth_middleware.py
│   │   ├── error_handler.py
│   ├── config/              # Configuración de la base de datos y entorno
│   │   ├── db.py
│   │   ├── dotenv_config.py
│   ├── app.py               # Configuración principal de FastAPI/Flask
│   ├── main.py              # Punto de entrada de la API
│── tests/                   # Pruebas unitarias y de integración
│   ├── test_auth.py
│   ├── test_chat.py
│── docs/                    # Documentación de la API
│   ├── api_docs.md
│── .env                     # Variables de entorno (API keys, DB)
│── .gitignore               # Archivos a ignorar en Git
│── requirements.txt         # Dependencias de Python
│── README.md                # Documentación general del proyecto
```

---

### 🔧 Explicación de Carpetas

#### **1️⃣ `controllers/` → Controladores de la API**
Aquí se encuentra la lógica que responde a las solicitudes HTTP. Los controladores reciben las peticiones, llaman a los servicios y devuelven una respuesta.  
Ejemplo: `auth_controller.py` maneja el login/logout de usuarios.

#### **2️⃣ `routes/` → Definición de Endpoints**
Define las rutas de la API y las conecta con los controladores correspondientes. Solo maneja rutas, no lógica de negocio.

#### **3️⃣ `models/` → Esquemas de la Base de Datos**
Define la estructura de los datos en la BD. Se usa SQLAlchemy para PostgreSQL.

#### **4️⃣ `services/` → Lógica de Negocio y APIs Externas**
Contiene la lógica que se reutiliza en diferentes partes del backend, como la conexión con la API de Spotify, procesamiento de letras de canciones y el chatbot IA.

#### **5️⃣ `middlewares/` → Funcionalidades Intermedias**
Contiene funciones que se ejecutan antes de que las rutas respondan, como autenticación, validación de datos y manejo de errores.

#### **6️⃣ `config/` → Configuración Global**
Incluye la configuración de la base de datos y variables de entorno.

#### **7️⃣ `tests/` → Pruebas Unitarias**
Contiene las pruebas para asegurar que los endpoints funcionan correctamente. Se usa PyTest.

#### **8️⃣ `docs/` → Documentación de la API**
Incluye documentación de los endpoints en formato Markdown o Swagger.

#### **9️⃣ Archivos en la raíz del proyecto**
- `.env` → Contiene credenciales y configuraciones sensibles.
- `.gitignore` → Archivos que no deben subirse a GitHub.
- `requirements.txt` → Lista de dependencias del proyecto.
- `README.md` → Documentación principal del backend.
- `main.py` → Punto de entrada del backend. 

---