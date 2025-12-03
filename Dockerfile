FROM nginx:alpine

# Copier les fichiers du projet dans le répertoire de nginx
COPY . /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Nginx démarre automatiquement

