# Use the official Nginx image
FROM nginx:stable-alpine

# Set ownership and permissions for the static files
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

# Copy the Nginx configuration file
COPY docker/nginx/production/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]