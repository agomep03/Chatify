# Dockerfile para React (Frontend)

# Usar una imagen base de Node.js
FROM node:18-alpine AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente al contenedor
COPY . .

# Construir la aplicación (Vite genera los archivos en 'dist/')
RUN npm run build

# Usar una imagen más ligera para servir la aplicación
FROM nginx:alpine

# Copiar los archivos construidos desde la fase anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 80

# Comando por defecto para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
