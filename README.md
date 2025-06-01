# Chatify – Trabajo de Ingeniería del Software II

## Índice

1. [Información del Proyecto](#información-del-proyecto)  
2. [Equipo de trabajo](#equipo-de-trabajo)  
   2.1. [Integrantes y roles](#integrantes-y-roles)  
   2.2. [Dinámica de trabajo](#dinámica-de-trabajo)  
3. [Requisitos y Organización del Proyecto](#requisitos-y-organización-del-proyecto)  
   3.1. [Requisitos funcionales](#requisitos-funcionales)  
   3.2. [Gestión de tareas](#gestión-de-tareas)  
4. [Diseño y arquitectura](#diseño-y-arquitectura)  
   4.1. [Tecnologías utilizadas](#tecnologías-utilizadas)  
5. [Desarrollo e Implementación](#desarrollo-e-implementación)  
   5.1. [Buenas Prácticas Aplicadas](#buenas-prácticas-aplicadas)  
   5.2. [Ejemplo de Funcionalidad: Generación de Playlists con IA](#ejemplo-de-funcionalidad-generación-de-playlists-con-ia)  
   5.3. [Enfoque en las Pruebas](#enfoque-en-las-pruebas)  
6. [CI/CD y despliegue](#cicd-y-despliegue)  
7. [Resultados finales y capturas](#resultados-finales-y-capturas)  
8. [Conclusiones y lecciones aprendidas](#conclusiones-y-lecciones-aprendidas)  
9. [Enlaces](#enlaces)  

---

## 1. Información del Proyecto

**Nombre:** Chatify  
**Descripción:**  
Chatify es una aplicación inteligente para la gestión y descubrimiento de música. Permite a los usuarios iniciar sesión, conectar su cuenta de Spotify y descubrir música personalizada usando inteligencia artificial. Incluye funcionalidades para crear y modificar playlists, conversar con IA en distintos modos y gestionar contenido musical de forma intuitiva.

**Problema que resuelve:**  
Las recomendaciones musicales suelen ser genéricas y crear playlists desde cero es tedioso. Chatify permite una experiencia personalizada, rápida y conversacional para descubrir y organizar música.

**Público objetivo:**  
Amantes de la música, usuarios de Spotify y personas que buscan una forma más intuitiva e interactiva de gestionar su contenido musical.

**Objetivo principal:**  
Ofrecer una plataforma musical inteligente que permita descubrir nueva música, crear y gestionar playlists de forma personalizada y mejorar la experiencia musical mediante chat con IA.

---

## 2. Equipo de trabajo

### 2.1. Integrantes y roles

- **Adriana Ortega del Valle** (aorted01@estudiantes.unileon.es) – Backend  
- **Héctor Sastre Miguélez** (hsastm00@estudiantes.unileon.es) – Backend  
- **Alicia Gómez Pascual** (agomep03@estudiantes.unileon.es) – Frontend  
- **Mario López Barazón** (mlopeb04@estudiantes.unileon.es) – Frontend  

### 2.2. Dinámica de trabajo

- Reuniones periódicas para sincronizar avances y consensuar decisiones técnicas.
- Uso de GitHub Projects para milestones, issues y seguimiento Kanban.
- Colaboración constante entre frontend y backend, con acuerdos conjuntos para el diseño de la API.
- Decisiones relevantes tomadas de forma colectiva.

---

## 3. Requisitos y Organización del Proyecto

### 3.1. Requisitos funcionales

- Registro e inicio de sesión de usuarios.
- Vinculación con Spotify.
- Visualización y gestión de playlists (crear, editar, eliminar).
- Generación automática de playlists con IA a partir de prompts en lenguaje natural.
- Historial y gestión de conversaciones con IA.
- Modos de conversación IA: normal, razonador y creativo.
- Diseño responsive para escritorio y móvil.

### 3.2. Gestión de tareas

- Organización mediante GitHub Projects: milestones, issues y tableros Kanban.
- Cada tarea documentada como issue, asignada y enlazada a ramas.
- Planificación clara y seguimiento del avance.
- [Enlace a GitHub Projects](https://github.com/users/agomep03/projects/1)

---

## 4. Diseño y arquitectura

La arquitectura es cliente-servidor:  
- **Frontend:** React (TypeScript)  
- **Backend:** FastAPI (Python)  
- **Base de datos:** PostgreSQL  
- **Servicios externos:** Spotify, IA, Genius (letras)  
- **Autenticación:** OAuth con Spotify

### 4.1. Tecnologías utilizadas

- **Backend:** Python + FastAPI
- **Frontend:** React + TypeScript + MUI
- **Base de datos:** PostgreSQL (Aiven)
- **Control de versiones:** Git + GitHub
- **CI/CD y calidad:** GitHub Actions + SonarQube
- **Contenedores y despliegue:** Docker + Render

---

## 5. Desarrollo e Implementación

### 5.1. Buenas Prácticas Aplicadas

- Separación de responsabilidades (routes, controllers, services, models, schemas, utils, config).
- Inyección de dependencias en FastAPI.
- Manejo exhaustivo de errores y validación de entradas/salidas.
- Programación asíncrona para llamadas externas.
- Desacoplamiento entre capas.
- Code reviews y pull requests obligatorios.
- Reuniones periódicas y acuerdos conjuntos para la API.

### 5.2. Ejemplo de Funcionalidad: Generación de Playlists con IA

#### 5.2.1. Flujo General

1. El usuario introduce un prompt (ej: “canciones para estudiar con lluvia”).
2. Se extrae información personalizada de Spotify (artistas, canciones, géneros).
3. Se construye un prompt para la IA y se obtiene una lista personalizada.
4. Se valida y busca la música en Spotify.
5. Se crea la playlist y se agregan las canciones.
6. Se muestra el resultado al usuario.

#### 5.2.2. Estructura de Archivos Relacionados

- `spotify_routes.py`, `spotify_controller.py`, `chatIA_service.py`, `spotify_service.py`

#### 5.2.3. Características Técnicas

- Endpoints asíncronos.
- Validación con Pydantic.
- Manejo exhaustivo de errores.
- Desacoplamiento y extensibilidad.

#### 5.2.4. Ventajas del Enfoque

- Alta personalización.
- Fiabilidad y validación en cada paso.
- Extensible a otros modelos IA o plataformas musicales.

### 5.3. Enfoque en las Pruebas

#### 5.3.1. Estrategia General

- Pruebas unitarias y de integración con PyTest.
- Fixtures personalizadas y mocking de dependencias externas.

#### 5.3.2. Arquitectura de Pruebas

- Base de datos en memoria para tests.
- Inyección de dependencias para simular contextos.
- Pruebas agrupadas por módulos.

#### 5.3.3. Cobertura y CI/CD

- Cobertura monitorizada con SonarQube y GitHub Actions.
- Bloqueo de PRs si bajan los estándares de calidad.

---

## 6. CI/CD y despliegue

### 6.1. Pipeline de Integración Continua (CI)

- **Backend:**  
  - Python 3.10, instalación de dependencias, ejecución de tests y cobertura, análisis SonarQube.
- **Frontend:**  
  - Node.js, instalación de dependencias, build y análisis estático.
- **Ambos:**  
  - Docker para builds y despliegue.
  - Automatización de pruebas y análisis en cada push.

### 6.2. Plataforma utilizada para el despliegue

- **Render:** despliegue automático tras cada push a main.
- **Docker:** coherencia entre entornos de desarrollo y producción.

---

## 7. Resultados finales y capturas

### 7.1. Pantalla de inicio

- Página de bienvenida personalizada según sesión.
- Tarjetas informativas sobre funcionalidades.

### 7.2. Pantalla de inicio de sesión y de registro

- Formularios de login y registro.
- Menú para cambiar tema y volver al inicio.
- Alertas de error y flujo de autorización con Spotify.

### 7.3. Playlists

- Visualización, creación, edición y borrado de playlists.
- Menú para ver y gestionar canciones, ver letras (redirige a Genius).

### 7.4. Redimensionalidad

- Diseño responsive para escritorio y móvil.
- Menú lateral adaptativo.

### 7.5. Temas de colores

- Tema claro y oscuro, configurable por el usuario.

### 7.6. Conversaciones

- Creación y gestión de conversaciones con IA.
- Modos de interacción: normal, creativo, razonador.
- Renombrado automático/manual de conversaciones.

### 7.7. TopBar

- Acceso rápido a inicio, cambio de tema y menú de usuario.

### 7.8. Perfil

- Visualización y edición de datos de usuario.

### 7.9. Resumen musical

- Estadísticas de artistas, canciones y géneros más escuchados.

---

## 8. Conclusiones y lecciones aprendidas

- Experiencia práctica en desarrollo y despliegue de una aplicación real.
- Mejora en trabajo en equipo y uso de herramientas colaborativas.
- Importancia de la calidad, CI/CD y pruebas automatizadas.
- Dificultades técnicas superadas (Spotify, Genius, despliegue).
- Ideas para mejoras futuras: sistema de letras más robusto, recuperación de contraseñas, generación de imágenes con IA, apertura de la beta.

---

## 9. Enlaces

- [Repositorio de GitHub](https://github.com/agomep03/Chatify)
- [GitHub Projects](https://github.com/users/agomep03/projects/1)
- [Despliegue FrontEnd](https://chatifyfront.onrender.com/)
- [Despliegue BackEnd](https://chatifyback.onrender.com)
- [SonarQube](https://sonarcloud.io/project/overview?id=agomep03_chatify)

---

**Trabajo realizado para la asignatura Ingeniería del Software II.**