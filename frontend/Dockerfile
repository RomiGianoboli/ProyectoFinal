# Dockerfile para Frontend (React PWA)

# Etapa 1: Build de la aplicación React
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Argumento para la URL del backend (se pasa desde docker-compose)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Compilar la aplicación para producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar archivos compilados desde la etapa build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto de Nginx
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]
