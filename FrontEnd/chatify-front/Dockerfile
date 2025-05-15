##########################################################################################################
# Etapa 1: Build

# Usar una imagen base de Node.js
FROM node:20 AS builder

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


##########################################################################################################
# Etapa 2: Nginx

# Usar una imagen más ligera para servir la aplicación
FROM nginx:alpine

# Eliminar los archivos por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde la fase anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 80

