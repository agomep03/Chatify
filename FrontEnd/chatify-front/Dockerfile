# Usar una imagen base de Node.js
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente al contenedor
COPY . .

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 80

# Comando  por defecto para ejecutar
CMD ["npm", "start"]
