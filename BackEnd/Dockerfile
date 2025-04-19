# Imagen base de Python 3.9 (puedes cambiar la versión según tu necesidad)
FROM python:3.9-slim

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo de dependencias (requirements.txt) al contenedor
COPY requirements.txt .

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código fuente al contenedor
COPY . .

# Copiar el archivo .env al contenedor
COPY .env .env

# Exponer el puerto en el que se ejecutará la app
EXPOSE 8000

# Comando para iniciar la aplicación con Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
