# Usa una imagen de Python
FROM python:3.10

# Crea y define el directorio de trabajo
WORKDIR /app

# Copia tus archivos al contenedor
COPY . .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Expón el puerto de FastAPI
EXPOSE 8000

# Comando para ejecutar Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]