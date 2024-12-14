FROM node:22-alpine3.19 as build

WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./

RUN npm ci 
COPY ./frontend/ ./

RUN npm run build

# Copy React static files and start nginx
FROM nginx:stable-alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]